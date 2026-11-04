// Holmio — interfaz

import { ELEMENTOS, porZ, buscarExacto, sugerencias } from './elementos.js';
import { casoDelDia, msHastaManana } from './casos.js';
import { Partida, MAX_INTENTOS } from './partida.js';

const $ = (id) => document.getElementById(id);

// ---------- Almacenamiento (puede fallar en modo privado) ----------
const guardar = (clave, valor) => {
  try { localStorage.setItem(clave, JSON.stringify(valor)); } catch {}
};
const leer = (clave) => {
  try { return JSON.parse(localStorage.getItem(clave)); } catch { return null; }
};

// ---------- Partida ----------
const caso = casoDelDia();
const CLAVE = `holmio-caso-${caso.numero}`;
if (new URLSearchParams(location.search).has('reiniciar')) {
  try { localStorage.removeItem(CLAVE); } catch {}
}
const partida = new Partida(caso, leer(CLAVE) ?? {});
const persistir = () => guardar(CLAVE, partida.datos());

// ---------- Tabla ----------
const celdas = new Map();
function construirTabla() {
  const tabla = $('tabla');
  for (const el of ELEMENTOS) {
    const c = document.createElement('div');
    c.className = 'celda';
    c.style.gridRow = el.fila;
    c.style.gridColumn = el.col;
    c.textContent = el.simbolo;
    c.title = `${el.nombre} (${el.z})`;
    tabla.appendChild(c);
    celdas.set(el.z, c);
  }
}

function pintarTabla(candidatos) {
  const posibles = new Set(candidatos.map((el) => el.z));
  for (const [z, c] of celdas) {
    c.classList.remove('off', 'fallo', 'acierto', 'revelado');
    if (partida.intentos.includes(z)) {
      c.classList.add(z === partida.secreto.z ? 'acierto' : 'fallo');
    } else if (partida.perdida && z === partida.secreto.z) {
      c.classList.add('revelado');
    } else if (!posibles.has(z) || partida.terminada) {
      c.classList.add('off');
    }
  }
}

// ---------- Render general ----------
function render() {
  const resueltas = partida.pistasResueltas();
  const candidatos = partida.candidatos(resueltas);

  // Pistas recibidas
  const lista = $('pistas');
  lista.replaceChildren(
    ...resueltas.map((p) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="ico" aria-hidden="true">${p.icono}</span><span></span>`;
      li.lastChild.textContent = p.texto;
      return li;
    }),
  );

  pintarTabla(candidatos);

  // Estado
  const n = partida.intentos.length;
  const fase = partida.fase;
  $('estado-intento').textContent =
    fase === 'fin' ? (partida.ganada ? `Resuelto en ${n}` : 'Sin resolver') : `Acusación ${Math.min(n + (fase === 'acusar' ? 1 : 0), MAX_INTENTOS)} de ${MAX_INTENTOS}`;
  $('estado-quedan').textContent =
    fase === 'fin' ? '' : `${candidatos.length} sospechoso${candidatos.length === 1 ? '' : 's'}`;
  $('puntos').replaceChildren(
    ...Array.from({ length: MAX_INTENTOS }, (_, i) => {
      const b = document.createElement('b');
      const z = partida.intentos[i];
      if (z !== undefined) b.className = z === partida.secreto.z ? 'bien' : 'usado';
      else if (i === n && fase === 'acusar') b.className = 'ahora';
      return b;
    }),
  );

  // Panel inferior
  $('form-acusar').hidden = fase !== 'acusar';
  $('elegir').hidden = fase !== 'elegir';
  $('fin').hidden = fase !== 'fin';
  if (fase === 'elegir') renderElegir();
  if (fase === 'fin') renderFin();
}

function renderElegir() {
  const u = partida.ultimo;
  $('elegir-titulo').textContent = `${u.nombre} tiene coartada. Elige una pista:`;
  const opciones = partida.opciones();
  $('opciones').replaceChildren(
    ...opciones.map((o) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'opcion';
      b.innerHTML = `<span class="ico" aria-hidden="true">${o.icono}</span><span><strong></strong><span></span></span>`;
      b.querySelector('strong').textContent = o.nombre;
      b.querySelector('span > span').textContent = o.pregunta;
      b.addEventListener('click', () => {
        if (partida.elegirPista(o.tipo)) {
          persistir();
          render();
          enfocarEntrada();
        }
      });
      return b;
    }),
  );
  // Caso raro: no queda ninguna pista útil → se pasa directamente a acusar.
  if (opciones.length === 0) {
    $('elegir-titulo').textContent = `${u.nombre} tiene coartada. No quedan pistas nuevas.`;
    $('opciones').innerHTML = '';
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-principal btn-ancho';
    b.textContent = 'Seguir acusando';
    b.addEventListener('click', () => {
      partida.pistas.push({ tipo: null, desde: u.z });
      persistir();
      render();
    });
    $('opciones').append(b);
  }
}

let temporizador = null;
function renderFin() {
  const s = partida.secreto;
  const fin = $('fin');
  fin.classList.toggle('ganada', partida.ganada);
  $('fin-sello').textContent = partida.ganada ? 'CASO CERRADO' : 'SE HA FUGADO';
  $('fin-casilla').innerHTML = `<small>${s.z}</small>${s.simbolo}`;
  $('fin-titulo').textContent = partida.ganada
    ? `¡Bien visto! El culpable era: ${s.nombre}`
    : `El culpable era: ${s.nombre}`;
  $('fin-dato').textContent = caso.curiosidad;

  const tick = () => {
    const ms = msHastaManana();
    const t = Math.floor(ms / 1000);
    const p = (x) => String(x).padStart(2, '0');
    $('cuenta-atras').textContent = `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)}`;
  };
  tick();
  clearInterval(temporizador);
  temporizador = setInterval(tick, 1000);
}

// ---------- Entrada y autocompletado ----------
const entrada = $('entrada');
const aviso = $('aviso');

function enfocarEntrada() {
  // En móvil no abrimos el teclado solos: solo en pantallas con puntero fino.
  if (matchMedia('(pointer: fine)').matches) entrada.focus();
}

function renderSugerencias() {
  const lista = sugerencias(entrada.value, 6);
  const posibles = new Set(partida.candidatos().map((el) => el.z));
  $('sugerencias').replaceChildren(
    ...lista.map((el) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sug';
      b.setAttribute('role', 'option');
      if (partida.intentos.includes(el.z)) b.classList.add('ya');
      else if (!posibles.has(el.z)) b.classList.add('descartado');
      b.textContent = el.nombre;
      const sym = document.createElement('b');
      sym.textContent = el.simbolo;
      b.append(sym);
      // pointerdown evita que el input pierda el foco y se cierre el teclado.
      b.addEventListener('pointerdown', (e) => e.preventDefault());
      b.addEventListener('click', () => {
        entrada.value = el.nombre;
        renderSugerencias();
        entrada.focus();
      });
      return b;
    }),
  );
}

entrada.addEventListener('input', () => {
  aviso.textContent = '';
  renderSugerencias();
});

// Con el teclado abierto queda poca altura: desplazamos la página para que la tabla
// completa quede justo encima del panel de respuesta (el informe sube y sale de la vista).
function mostrarTablaSobreTeclado() {
  if (document.activeElement !== entrada) return;
  const tabla = document.querySelector('.tablero').getBoundingClientRect();
  const panel = $('panel').getBoundingClientRect();
  const sobra = tabla.bottom + 8 - panel.top;
  if (sobra > 0) window.scrollBy({ top: sobra });
}
entrada.addEventListener('focus', () => setTimeout(mostrarTablaSobreTeclado, 350));
window.visualViewport?.addEventListener('resize', mostrarTablaSobreTeclado);
window.addEventListener('resize', mostrarTablaSobreTeclado);

$('form-acusar').addEventListener('submit', (e) => {
  e.preventDefault();
  let el = buscarExacto(entrada.value);
  if (!el) {
    const lista = sugerencias(entrada.value, 2);
    if (lista.length === 1) el = lista[0];
  }
  if (!el) {
    aviso.textContent = entrada.value.trim()
      ? 'No reconozco ese elemento. Elige uno de la lista.'
      : 'Escribe el nombre o el símbolo de un elemento.';
    return;
  }
  const r = partida.acusar(el.z);
  if (r === 'repetido') {
    aviso.textContent = `${el.nombre} ya tiene coartada: no gastes otra acusación.`;
    return;
  }
  if (r !== 'ok') return;
  persistir();
  entrada.value = '';
  aviso.textContent = '';
  renderSugerencias();
  entrada.blur();
  render();
});

// ---------- Compartir ----------
function toast(texto) {
  const t = $('toast');
  t.textContent = texto;
  t.classList.add('visible');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('visible'), 2000);
}

$('btn-compartir').addEventListener('click', async () => {
  const url = location.origin + location.pathname;
  const texto = partida.textoCompartir(url);
  if (navigator.share && matchMedia('(pointer: coarse)').matches) {
    try { await navigator.share({ text: texto }); return; } catch (err) {
      if (err?.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(texto);
    toast('Resultado copiado');
  } catch {
    toast('No se pudo copiar el resultado');
  }
});

// ---------- Tema ----------
$('btn-tema').addEventListener('click', () => {
  const raiz = document.documentElement;
  const oscuroAhora =
    raiz.dataset.theme === 'dark' ||
    (!raiz.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  raiz.dataset.theme = oscuroAhora ? 'light' : 'dark';
  try { localStorage.setItem('holmio-tema', raiz.dataset.theme); } catch {}
});

// ---------- Ayuda ----------
$('btn-ayuda').addEventListener('click', () => $('ayuda').showModal());
if (!leer('holmio-visto-ayuda')) {
  $('ayuda').showModal();
  guardar('holmio-visto-ayuda', true);
}

// ---------- Inicio ----------
$('num-caso').textContent = `Caso nº ${caso.numero}`;
$('fecha-caso').textContent = new Date().toLocaleDateString('es-ES', {
  weekday: 'long', day: 'numeric', month: 'short',
});
$('informe-texto').textContent = caso.informe;
construirTabla();
render();

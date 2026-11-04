// Holmio — interfaz

import { ELEMENTOS, buscarExacto, sugerencias, quitarTildes } from './elementos.js';
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

// ---------- Iconos ----------
const icono = (id) => `<svg class="ico-svg" viewBox="0 0 24 24"><use href="#${id}"/></svg>`;

// Pistas de texto: amplían el informe del caso. El resto se muestran como icono
// sobre la casilla del elemento desde el que se pidieron.
const PISTAS_DE_TEXTO = new Set(['curiosidad', 'etimologia']);
// En la casilla, las direcciones usan una flecha sola (sin la casilla de referencia).
const iconoCelda = (p) => (p.svg.replace(/^i-(arriba|abajo|izquierda|derecha)$/, 'f-$1'));

function pintarTabla(candidatos, resueltas) {
  const posibles = new Set(candidatos.map((el) => el.z));
  const pistaDesde = new Map(
    resueltas.filter((p) => !PISTAS_DE_TEXTO.has(p.tipo)).map((p) => [p.desde, p]),
  );
  for (const [z, c] of celdas) {
    const el = ELEMENTOS[z - 1];
    const pista = pistaDesde.get(z);
    c.classList.remove('off', 'fallo', 'acierto', 'revelado', 'con-pista', 'negada');
    c.removeAttribute('role');
    c.removeAttribute('tabindex');
    c.dataset.pista = '';
    c.setAttribute('aria-label', `${el.nombre} (${el.z})`);

    if (pista) {
      c.innerHTML = icono(iconoCelda(pista));
      c.classList.add('con-pista');
      c.classList.toggle('negada', pista.negativa);
      c.dataset.pista = pista.texto;
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-label', `${el.nombre}: ${pista.texto}`);
    } else if (c.textContent !== el.simbolo) {
      c.textContent = el.simbolo;
    }

    if (partida.intentos.includes(z)) {
      c.classList.add(z === partida.secreto.z ? 'acierto' : 'fallo');
    } else if (partida.perdida && z === partida.secreto.z) {
      c.classList.add('revelado');
    } else if (!posibles.has(z) || partida.terminada) {
      c.classList.add('off');
    }
  }
}

// Tocar una casilla con pista muestra su texto.
function verPistaDeCelda(e) {
  const c = e.target.closest('.celda.con-pista');
  if (!c) return;
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  toast(c.dataset.pista, 3500);
}

function renderInforme(resueltas) {
  $('informe-extra').replaceChildren(
    ...resueltas
      .filter((p) => PISTAS_DE_TEXTO.has(p.tipo))
      .map((p) => {
        const parrafo = document.createElement('p');
        parrafo.className = 'informe-extra';
        parrafo.dataset.tipo = p.tipo;
        parrafo.innerHTML = `<span class="ico" aria-hidden="true">${icono(p.svg)}</span><span></span>`;
        parrafo.lastChild.textContent = p.texto;
        return parrafo;
      }),
  );
}

/** Tras elegir una pista: destaca dónde ha aparecido. */
function destacarPista(p) {
  if (!p) return;
  const objetivo = PISTAS_DE_TEXTO.has(p.tipo)
    ? $('informe-extra').querySelector(`[data-tipo="${p.tipo}"]`)
    : celdas.get(p.desde);
  objetivo?.classList.add('nueva');
  objetivo?.addEventListener('animationend', () => objetivo.classList.remove('nueva'), { once: true });
}

// ---------- Render general ----------
function render() {
  const resueltas = partida.pistasResueltas();
  const candidatos = partida.candidatos(resueltas);

  renderInforme(resueltas);
  pintarTabla(candidatos, resueltas);

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

  // Panel inferior (durante la elección de pista, el diálogo lo tapa todo)
  $('form-acusar').hidden = fase === 'fin';
  $('fin').hidden = fase !== 'fin';
  if (fase === 'fin') renderFin();
}

// ---------- Elegir pista: el juego se detiene, como al subir de nivel ----------
const dlgElegir = $('elegir');
const sinAnimaciones = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
dlgElegir.addEventListener('cancel', (e) => e.preventDefault()); // Esc no la cierra: hay que elegir

function abrirElegir() {
  if (partida.fase !== 'elegir' || dlgElegir.open) return;
  const u = partida.ultimo;
  const restantes = MAX_INTENTOS - partida.intentos.length;
  const opciones = partida.opciones();

  $('elegir-ficha').innerHTML = `<small>${u.z}</small>${u.simbolo}<span class="sello-mini">COARTADA</span>`;
  $('elegir-titulo').textContent = `${u.nombre} tiene coartada`;
  $('elegir-sub').innerHTML = opciones.length
    ? `Elige una pista · Te quedan <strong>${restantes}</strong> acusaci${restantes === 1 ? 'ón' : 'ones'}`
    : 'No queda ninguna pista que aporte algo nuevo.';

  const botones = opciones.map((o, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcion';
    b.style.setProperty('--i', i);
    b.innerHTML = `<span class="ico" aria-hidden="true">${icono(o.svg)}</span><span><strong></strong><span class="preg"></span></span>`;
    b.querySelector('strong').textContent = o.nombre;
    b.querySelector('.preg').textContent = o.pregunta;
    b.addEventListener('click', () => {
      if (!partida.elegirPista(o.tipo)) return;
      persistir();
      botones.forEach((x) => {
        x.disabled = true;
        x.classList.add(x === b ? 'elegida' : 'apartada');
      });
      setTimeout(() => cerrarElegir(), sinAnimaciones() ? 0 : 420);
    });
    return b;
  });

  // Caso raro: no queda ninguna pista útil → se sigue acusando sin pista.
  if (!opciones.length) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-principal seguir';
    b.textContent = 'Seguir acusando';
    b.addEventListener('click', () => {
      partida.pistas.push({ tipo: null, desde: u.z });
      persistir();
      cerrarElegir();
    });
    botones.push(b);
  }

  $('opciones').replaceChildren(...botones);
  dlgElegir.classList.remove('saliendo');
  dlgElegir.showModal();
  dlgElegir.focus();
}

function cerrarElegir() {
  dlgElegir.classList.add('saliendo');
  setTimeout(() => {
    dlgElegir.close();
    dlgElegir.classList.remove('saliendo');
    // Al volver a la partida, la tabla se apaga con transición y la pista nueva destella.
    render();
    destacarPista(partida.pistasResueltas().at(-1));
    enfocarEntrada();
  }, sinAnimaciones() ? 0 : 260);
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

// Desplegable de sugerencias (hacia arriba). `activa` es la opción resaltada, que es
// la que se elige con Intro; la 0 es la mejor coincidencia, la más cercana al campo.
const desplegable = $('sugerencias');
let lista = [];
let activa = -1;

function cerrarDesplegable() {
  lista = [];
  activa = -1;
  desplegable.hidden = true;
  desplegable.replaceChildren();
  entrada.setAttribute('aria-expanded', 'false');
  entrada.removeAttribute('aria-activedescendant');
}

function marcarActiva(i) {
  activa = i;
  [...desplegable.children].forEach((li, j) => {
    li.classList.toggle('activo', j === i);
    li.setAttribute('aria-selected', String(j === i));
  });
  if (i >= 0) entrada.setAttribute('aria-activedescendant', `sug-${i}`);
}

function elegirSugerencia(i) {
  entrada.value = lista[i].nombre;
  cerrarDesplegable();
  entrada.focus();
}

function renderSugerencias() {
  lista = sugerencias(entrada.value, 5);
  // Si lo escrito ya es exactamente la única sugerencia, no hace falta el desplegable.
  const yaElegido =
    lista.length === 1 && quitarTildes(lista[0].nombre) === quitarTildes(entrada.value);
  if (!lista.length || yaElegido) return cerrarDesplegable();

  const posibles = new Set(partida.candidatos().map((el) => el.z));
  desplegable.replaceChildren(
    ...lista.map(({ el, nombre, inicio, fin }, i) => {
      const li = document.createElement('li');
      li.id = `sug-${i}`;
      li.setAttribute('role', 'option');
      if (partida.intentos.includes(el.z)) li.classList.add('ya');
      else if (!posibles.has(el.z)) li.classList.add('descartado');

      const nom = document.createElement('span');
      nom.className = 'nombre';
      const coincide = document.createElement('b');
      coincide.textContent = nombre.slice(inicio, fin);
      nom.append(nombre.slice(0, inicio), coincide, nombre.slice(fin));
      li.append(nom);

      if (nombre !== el.nombre) {
        const alias = document.createElement('span');
        alias.className = 'alias';
        alias.textContent = `(${el.nombre})`;
        li.append(alias);
      }
      const sym = document.createElement('span');
      sym.className = 'sym';
      sym.textContent = el.simbolo;
      li.append(sym);

      // pointerdown evita que el campo pierda el foco y se cierre el teclado.
      li.addEventListener('pointerdown', (e) => e.preventDefault());
      li.addEventListener('click', () => elegirSugerencia(i));
      return li;
    }),
  );
  desplegable.hidden = false;
  entrada.setAttribute('aria-expanded', 'true');
  marcarActiva(0);
}

entrada.addEventListener('input', () => {
  aviso.textContent = '';
  renderSugerencias();
});
entrada.addEventListener('focus', () => {
  if (entrada.value) renderSugerencias();
});
entrada.addEventListener('blur', cerrarDesplegable);
entrada.addEventListener('keydown', (e) => {
  if (desplegable.hidden) return;
  // El desplegable crece hacia arriba: la flecha arriba se aleja del campo.
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    marcarActiva(Math.min(activa + 1, lista.length - 1));
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    marcarActiva(Math.max(activa - 1, 0));
  } else if (e.key === 'Escape') {
    cerrarDesplegable();
  }
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
  const el = buscarExacto(entrada.value);
  if (!el) {
    // Intro con el desplegable abierto: completa con la sugerencia resaltada.
    if (!desplegable.hidden && lista.length) return elegirSugerencia(Math.max(activa, 0));
    aviso.textContent = entrada.value.trim()
      ? 'No reconozco ese elemento. Elige uno de la lista.'
      : 'Escribe el nombre de un elemento.';
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
  cerrarDesplegable();
  entrada.blur();
  render();
  if (partida.fase === 'elegir') {
    // Primero se ve el fallo en la tabla; después se detiene el juego para elegir pista.
    celdas.get(el.z).classList.add('recien');
    setTimeout(abrirElegir, sinAnimaciones() ? 0 : 700);
  }
});

// ---------- Compartir ----------
function toast(texto, ms = 2000) {
  const t = $('toast');
  t.textContent = texto;
  t.classList.add('visible');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('visible'), ms);
}

$('tabla').addEventListener('click', verPistaDeCelda);
$('tabla').addEventListener('keydown', verPistaDeCelda);

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
// Si se cerró la página a mitad de elección, se vuelve a la pantalla de elegir.
if (!$('ayuda').open) abrirElegir();
else $('ayuda').addEventListener('close', abrirElegir, { once: true });

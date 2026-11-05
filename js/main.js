// Holmio — interfaz

import { ELEMENTOS, buscarExacto, sugerencias, quitarTildes } from './elementos.js';
import { casoDelDia, msHastaManana } from './casos.js';
import { Partida, MAX_INTENTOS } from './partida.js';
import { crearTutorial } from './tutorial.js';

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

// Todas las pistas dejan su icono sobre la casilla del elemento desde el que se pidieron.
// Las de texto, además, amplían el informe del caso; su bocadillo remite a él.
const PISTAS_DE_TEXTO = new Set(['curiosidad', 'etimologia']);
const BOCADILLO_TEXTO = {
  curiosidad: 'Al interrogarlo, reveló una curiosidad del culpable. La tienes en el informe.',
  etimologia: 'Al interrogarlo, reveló de dónde viene el nombre del culpable. Lo tienes en el informe.',
};
const textoBocadillo = (p) => BOCADILLO_TEXTO[p.tipo] ?? p.texto;
// En la casilla, las direcciones usan una flecha sola (sin la casilla de referencia).
const iconoCelda = (p) => (p.svg.replace(/^i-(arriba|abajo|izquierda|derecha)$/, 'f-$1'));

function pintarTabla(candidatos, resueltas) {
  const posibles = new Set(candidatos.map((el) => el.z));
  const pistaDesde = new Map(resueltas.map((p) => [p.desde, p]));
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
      c.dataset.pista = textoBocadillo(pista);
      c.dataset.tipo = pista.tipo;
      c.setAttribute('role', 'button');
      c.setAttribute('tabindex', '0');
      c.setAttribute('aria-label', `${el.nombre}: ${textoBocadillo(pista)}`);
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

// ---------- Bocadillo: tocar una casilla con pista muestra su texto encima ----------
const bocadillo = $('bocadillo');
let celdaBocadillo = null;

function ocultarBocadillo() {
  bocadillo.hidden = true;
  bocadillo.classList.remove('visible');
  celdaBocadillo = null;
  clearTimeout(ocultarBocadillo.t);
}

function mostrarBocadillo(celda, texto) {
  if (celdaBocadillo === celda) return ocultarBocadillo(); // segundo toque: se cierra
  celdaBocadillo = celda;
  bocadillo.textContent = texto;
  bocadillo.classList.remove('visible', 'abajo');
  bocadillo.style.left = '0px';
  bocadillo.style.top = '0px';
  bocadillo.hidden = false;

  const r = celda.getBoundingClientRect();
  const b = bocadillo.getBoundingClientRect();
  const margen = 8;
  const centro = r.left + r.width / 2;
  const left = Math.max(margen, Math.min(centro - b.width / 2, innerWidth - b.width - margen));
  let top = r.top - b.height - 9;
  if (top < margen) {
    top = r.bottom + 9; // sin sitio encima: debajo de la casilla
    bocadillo.classList.add('abajo');
  }
  bocadillo.style.left = `${left}px`;
  bocadillo.style.top = `${top}px`;
  bocadillo.style.setProperty('--flecha', `${centro - left}px`);
  void bocadillo.offsetWidth; // reinicia la animación
  bocadillo.classList.add('visible');
  clearTimeout(ocultarBocadillo.t);
  ocultarBocadillo.t = setTimeout(ocultarBocadillo, 4500);
}

function verPistaDeCelda(e) {
  const c = e.target.closest('.celda.con-pista');
  if (!c) return;
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
  e.preventDefault();
  mostrarBocadillo(c, c.dataset.pista);
  // Las pistas de texto, además, señalan su párrafo en el informe.
  if (PISTAS_DE_TEXTO.has(c.dataset.tipo)) {
    const parrafo = $('informe-extra').querySelector(`[data-tipo="${c.dataset.tipo}"]`);
    if (parrafo) {
      parrafo.scrollIntoView({ block: 'nearest', behavior: sinAnimaciones() ? 'auto' : 'smooth' });
      parrafo.classList.remove('nueva');
      void parrafo.offsetWidth;
      parrafo.classList.add('nueva');
    }
  }
}

// Se cierra al tocar fuera, al desplazar o al cambiar el tamaño.
document.addEventListener('pointerdown', (e) => {
  if (celdaBocadillo && !celdaBocadillo.contains(e.target)) ocultarBocadillo();
}, true);
window.addEventListener('resize', ocultarBocadillo);
// (el desplazamiento interno del informe no cuenta: lo provocamos al señalar un párrafo)
document.addEventListener('scroll', (e) => {
  if (!e.target.closest?.('.informe')) ocultarBocadillo();
}, true);

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
  const objetivos = [celdas.get(p.desde)];
  if (PISTAS_DE_TEXTO.has(p.tipo)) {
    objetivos.push($('informe-extra').querySelector(`[data-tipo="${p.tipo}"]`));
    // Si el informe ya no cabe, se desplaza por dentro hasta la pista nueva.
    const informe = document.querySelector('.informe');
    informe.scrollTo({ top: informe.scrollHeight, behavior: sinAnimaciones() ? 'auto' : 'smooth' });
  }
  for (const o of objetivos) {
    o?.classList.add('nueva');
    o?.addEventListener('animationend', () => o.classList.remove('nueva'), { once: true });
  }
}

// ---------- Render general ----------
function render() {
  const resueltas = partida.pistasResueltas();
  const candidatos = partida.candidatos(resueltas);

  renderInforme(resueltas);
  pintarTabla(candidatos, resueltas);

  // Acusaciones: seis fichas que se rellenan con el símbolo de cada acusado
  const n = partida.intentos.length;
  const fase = partida.fase;
  const fichas = $('fichas');
  const nuevas = n > (render.fichasPintadas ?? n); // se acaba de acusar: la ficha nueva salta
  render.fichasPintadas = n;
  fichas.setAttribute(
    'aria-label',
    fase === 'fin'
      ? (partida.ganada ? `Resuelto en ${n} acusaciones` : 'Sin resolver')
      : `Acusación ${Math.min(n + 1, MAX_INTENTOS)} de ${MAX_INTENTOS}`,
  );
  fichas.replaceChildren(
    ...Array.from({ length: MAX_INTENTOS }, (_, i) => {
      const li = document.createElement('li');
      li.dataset.n = i + 1;
      const z = partida.intentos[i];
      if (z !== undefined) {
        li.className = z === partida.secreto.z ? 'bien' : 'usado';
        li.textContent = ELEMENTOS[z - 1].simbolo;
        if (nuevas && i === n - 1) li.classList.add('nueva');
      } else if (i === n && fase !== 'fin') {
        li.className = 'ahora';
        li.textContent = '?';
      }
      return li;
    }),
  );
  $('sospechosos').hidden = fase === 'fin';
  $('sospechosos-num').textContent = candidatos.length;
  $('sospechosos').lastChild.textContent = candidatos.length === 1 ? 'sospechoso' : 'sospechosos';

  // Panel inferior (durante la elección de pista, el diálogo lo tapa todo)
  $('form-acusar').hidden = fase === 'fin';
  $('fin-barra').hidden = fase !== 'fin';
  if (fase === 'fin') renderFin();
}

// ---------- Elegir pista: el juego se detiene, como al subir de nivel ----------
const dlgElegir = $('elegir');
const sinAnimaciones = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
dlgElegir.addEventListener('cancel', (e) => e.preventDefault()); // Esc no la cierra: hay que elegir

function abrirElegir() {
  if (partida.fase !== 'elegir' || dlgElegir.open) return;
  const u = partida.ultimo;
  const opciones = partida.opciones();

  $('elegir-ficha').innerHTML = `<small>${u.z}</small>${u.simbolo}<span class="sello-mini">COARTADA</span>`;
  $('elegir-titulo').textContent = `${u.nombre} tiene coartada`;
  $('elegir-sub').textContent = opciones.length ? 'Elige una pista' : 'No queda ninguna pista que aporte algo nuevo';
  $('elegir-sub').classList.toggle('sin-pistas', !opciones.length);

  const botones = opciones.map((o, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'opcion';
    b.style.setProperty('--i', i);
    b.innerHTML = `<span class="ico" aria-hidden="true">${icono(o.svg)}</span><span><strong></strong><span class="preg"></span></span>`;
    b.querySelector('strong').textContent = o.nombre;
    b.querySelector('.preg').textContent = o.pregunta;
    b.addEventListener('click', async () => {
      if (!partida.elegirPista(o.tipo)) return;
      persistir();
      botones.forEach((x) => {
        x.disabled = true;
        x.classList.add(x === b ? 'elegida' : 'apartada');
      });
      await revelarPista(b, partida.pistasResueltas().at(-1));
      cerrarElegir();
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

const DIRECCIONES = new Set(['arriba', 'abajo', 'izquierda', 'derecha']);
const pausa = (ms) => new Promise((r) => setTimeout(r, sinAnimaciones() ? 0 : ms));

/**
 * Dentro de la tarjeta elegida, la pregunta se borra y la respuesta se escribe a máquina.
 * Las direcciones reciben además un sello SÍ / NO (y el icono se tacha si es «no»).
 * Un toque en cualquier parte acelera: completa el texto o pasa a la partida.
 */
async function revelarPista(boton, p) {
  let saltar = false;
  const alTocar = () => (saltar = true);
  dlgElegir.addEventListener('pointerdown', alTocar);

  await pausa(380); // efecto de seleccionado
  const preg = boton.querySelector('.preg');
  preg.classList.add('borrando');
  await pausa(180);
  preg.classList.remove('borrando');
  preg.classList.add('respuesta', 'escribiendo');
  preg.setAttribute('aria-live', 'polite');

  if (DIRECCIONES.has(p.tipo)) {
    const sello = document.createElement('span');
    sello.className = `veredicto ${p.negativa ? 'no' : 'si'}`;
    sello.textContent = p.negativa ? 'NO' : 'SÍ';
    boton.append(sello);
    if (p.negativa) boton.querySelector('.ico').classList.add('negada');
  }

  // Máquina de escribir
  for (let i = 1; i <= p.texto.length; i++) {
    if (saltar || sinAnimaciones()) {
      preg.textContent = p.texto;
      break;
    }
    preg.textContent = p.texto.slice(0, i);
    await new Promise((r) => setTimeout(r, 20));
  }
  preg.classList.remove('escribiendo');

  // Tiempo para leerla; un toque lo acorta.
  saltar = false;
  for (let t = 0; t < 1500 && !saltar && !sinAnimaciones(); t += 50) await pausa(50);
  dlgElegir.removeEventListener('pointerdown', alTocar);
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

// ---------- Resultado: misma puesta en escena que la elección de pista ----------
const dlgFin = $('fin');
let temporizador = null;

function renderFin() {
  const s = partida.secreto;
  const n = partida.intentos.length;
  dlgFin.classList.toggle('ganada', partida.ganada);
  dlgFin.classList.toggle('perdida', partida.perdida);
  $('fin-casilla').innerHTML =
    `<small>${s.z}</small>${s.simbolo}<span class="sello-fin">${partida.ganada ? 'CASO CERRADO' : 'SE HA FUGADO'}</span>`;
  $('fin-titulo').textContent = partida.ganada ? (n === 1 ? '¡A la primera!' : '¡Bien visto!') : 'Se te ha escapado';
  $('fin-sub').innerHTML = 'El culpable era <strong></strong>';
  $('fin-sub').querySelector('strong').textContent = s.nombre;
  // Las acusaciones usadas, con las mismas fichas que el contador de la partida
  const usadas = partida.intentos.map((z) => ELEMENTOS[z - 1]);
  $('fin-fichas').setAttribute('aria-label', `Acusaciones: ${usadas.map((el) => el.nombre).join(', ')}`);
  $('fin-fichas').replaceChildren(
    ...usadas.map((el, i) => {
      const li = document.createElement('li');
      li.dataset.n = i + 1;
      li.className = el.z === s.z ? 'bien' : 'usado';
      li.style.setProperty('--i', i);
      li.textContent = el.simbolo;
      return li;
    }),
  );
  $('fin-dato').innerHTML = `<span class="ico" aria-hidden="true">${icono('i-curiosidad')}</span><span></span>`;
  $('fin-dato').lastChild.textContent = caso.curiosidad;

  const tick = () => {
    const t = Math.floor(msHastaManana() / 1000);
    const p = (x) => String(x).padStart(2, '0');
    const texto = `${p(Math.floor(t / 3600))}:${p(Math.floor((t % 3600) / 60))}:${p(t % 60)}`;
    document.querySelectorAll('.cuenta-atras').forEach((el) => (el.textContent = texto));
  };
  tick();
  clearInterval(temporizador);
  temporizador = setInterval(tick, 1000);
}

function abrirFin() {
  if (partida.fase !== 'fin' || dlgFin.open) return;
  dlgFin.classList.remove('saliendo');
  dlgFin.showModal();
  dlgFin.focus();
}

function cerrarFin() {
  dlgFin.classList.add('saliendo');
  setTimeout(() => {
    dlgFin.close();
    dlgFin.classList.remove('saliendo');
  }, sinAnimaciones() ? 0 : 260);
}

dlgFin.addEventListener('cancel', (e) => {
  e.preventDefault();
  cerrarFin();
});
$('btn-ver-tabla').addEventListener('click', cerrarFin);
$('btn-ver-resultado').addEventListener('click', abrirFin);

/** Al cargar: si la partida estaba a medias de algo, se vuelve a esa pantalla. */
function abrirSegunFase() {
  if (partida.fase === 'elegir') abrirElegir();
  else if (partida.fase === 'fin') abrirFin();
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
  } else if (partida.fase === 'fin') {
    // Primero se ve el acierto (o el culpable revelado) en la tabla; después, el resultado.
    const celda = celdas.get(partida.ganada ? el.z : partida.secreto.z);
    const clase = partida.ganada ? 'nueva' : 'recien';
    celda.classList.add(clase);
    celda.addEventListener('animationend', () => celda.classList.remove(clase), { once: true });
    setTimeout(abrirFin, sinAnimaciones() ? 0 : 900);
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
  // El aviso va en el propio botón: el diálogo tapa cualquier aviso flotante.
  const boton = $('btn-compartir');
  try {
    await navigator.clipboard.writeText(texto);
    boton.textContent = '¡Copiado! Pégalo donde quieras';
  } catch {
    boton.textContent = 'No se pudo copiar';
  }
  clearTimeout(boton.t);
  boton.t = setTimeout(() => (boton.textContent = 'Compartir resultado'), 2500);
});

// ---------- Tema ----------
const esNoche = () => document.documentElement.dataset.theme === 'dark';
function pintarInterruptorTema() {
  $('menu-tema').setAttribute('aria-checked', String(esNoche()));
}
$('menu-tema').addEventListener('click', () => {
  document.documentElement.dataset.theme = esNoche() ? 'light' : 'dark';
  try { localStorage.setItem('holmio-tema', document.documentElement.dataset.theme); } catch {}
  pintarInterruptorTema();
});

// ---------- Ayuda: «Cómo se juega» en diapositivas ----------
const tutorial = crearTutorial($('ayuda'));

// ---------- Menú lateral ----------
const menu = $('menu');

function estadoCasoDelDia() {
  const n = partida.intentos.length;
  if (partida.ganada) return `Nº ${caso.numero} · Resuelto en ${n}/${MAX_INTENTOS}`;
  if (partida.perdida) return `Nº ${caso.numero} · Sin resolver`;
  if (n === 0) return `Nº ${caso.numero} · Sin empezar`;
  return `Nº ${caso.numero} · En curso, ${n}/${MAX_INTENTOS} acusaciones`;
}

function abrirMenu() {
  $('menu-hoy-estado').textContent = estadoCasoDelDia();
  pintarInterruptorTema();
  menu.classList.remove('cerrando');
  menu.showModal();
  menu.querySelector('.menu-cerrar').focus();
}

/** Cierra el menú deslizándolo; `despues` se ejecuta cuando ya no está. */
function cerrarMenu(despues) {
  if (!menu.open) return despues?.();
  menu.classList.add('cerrando');
  setTimeout(() => {
    menu.close();
    menu.classList.remove('cerrando');
    despues?.();
  }, sinAnimaciones() ? 0 : 220);
}

$('btn-menu').addEventListener('click', abrirMenu);
menu.querySelector('.menu-cerrar').addEventListener('click', () => cerrarMenu());
menu.addEventListener('cancel', (e) => {
  e.preventDefault();
  cerrarMenu();
});
// Tocar fuera del panel (en el fondo oscurecido) lo cierra.
menu.addEventListener('click', (e) => {
  if (e.target !== menu) return;
  const r = menu.getBoundingClientRect();
  const dentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!dentro) cerrarMenu();
});
// Deslizar hacia la derecha también lo cierra.
let arrastreMenu = null;
menu.addEventListener('pointerdown', (e) => (arrastreMenu = { x: e.clientX, y: e.clientY }));
menu.addEventListener('pointerup', (e) => {
  if (!arrastreMenu) return;
  const dx = e.clientX - arrastreMenu.x;
  const dy = e.clientY - arrastreMenu.y;
  arrastreMenu = null;
  if (dx > 60 && Math.abs(dx) > Math.abs(dy)) cerrarMenu();
});

$('menu-hoy').addEventListener('click', () => cerrarMenu());
$('menu-ayuda').addEventListener('click', () => cerrarMenu(() => tutorial.abrir()));
$('menu-acerca').addEventListener('click', () => cerrarMenu(() => {
  $('acerca').showModal();
  $('acerca').focus();
}));

if (!leer('holmio-visto-ayuda')) {
  tutorial.abrir();
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
// Si se cerró la página a mitad de elección (o con la partida terminada), se vuelve a esa pantalla.
if (!$('ayuda').open) abrirSegunFase();
else $('ayuda').addEventListener('close', abrirSegunFase, { once: true });

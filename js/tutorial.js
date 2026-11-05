// «Cómo se juega»: tutorial en diapositivas, cada una con una escena animada
// construida con piezas en miniatura del propio juego (se adaptan al tema día/noche).
// Se navega deslizando, con las flechas, con los puntos o con el teclado.

import { ELEMENTOS } from './elementos.js';

const sinAnimaciones = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const svg = (id) => `<svg class="ico-svg" viewBox="0 0 24 24"><use href="#${id}"/></svg>`;
const porSimbolo = (s) => ELEMENTOS.find((el) => el.simbolo === s);

/** Pausa cancelable. Sin animaciones, no espera (la escena salta a su estado final). */
function esperar(ms, señal) {
  return new Promise((resolver, rechazar) => {
    if (señal.aborted) return rechazar(new DOMException('fin', 'AbortError'));
    const t = setTimeout(resolver, sinAnimaciones() ? 0 : ms);
    señal.addEventListener('abort', () => {
      clearTimeout(t);
      rechazar(new DOMException('fin', 'AbortError'));
    }, { once: true });
  });
}

async function escribir(el, texto, señal, ms = 45) {
  if (sinAnimaciones()) return void (el.textContent = texto);
  for (let i = 1; i <= texto.length; i++) {
    el.textContent = texto.slice(0, i);
    await esperar(ms, señal);
  }
}

/** Repite la escena en bucle (una sola vez si no hay animaciones). */
async function enBucle(señal, paso) {
  do await paso(); while (!sinAnimaciones() && !señal.aborted);
}

// ---------- Piezas en miniatura ----------

function miniTabla() {
  const tabla = document.createElement('div');
  tabla.className = 'mini-tabla';
  const celdas = new Map();
  for (const el of ELEMENTOS) {
    const c = document.createElement('div');
    c.className = 'mini-celda';
    c.style.gridRow = el.fila;
    c.style.gridColumn = el.col;
    c.textContent = el.simbolo;
    tabla.append(c);
    celdas.set(el.simbolo, c);
  }
  const reiniciar = () => celdas.forEach((c, s) => {
    c.className = 'mini-celda';
    c.textContent = s;
  });
  const marcar = (s, clase, icono) => {
    const c = celdas.get(s);
    c.classList.add(clase);
    if (icono) c.innerHTML = svg(icono);
    return c;
  };
  return { tabla, celdas, reiniciar, marcar };
}

// Mano con el dedo índice (pantallas táctiles) o flecha de ratón (con puntero fino).
// La punta del dedo / de la flecha marca el punto exacto del toque.
const SVG_MANO = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 2.5a2 2 0 0 0-2 2V13l-1.3-1.3a1.8 1.8 0 0 0-2.6 2.5l4.4 5A6 6 0 0 0 12 21.5h2.5a5.5 5.5 0 0 0 5.5-5.5v-4.5a1.6 1.6 0 0 0-3.2-.9 1.6 1.6 0 0 0-3-.6A1.5 1.5 0 0 0 11 10V4.5a2 2 0 0 0-2-2z"/><path class="pliegue" d="M13.8 10v3M16.8 10.6v3"/></svg>`;
const SVG_CURSOR = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.5v15.5l4.2-4.1 2.9 6.6 2.6-1.1-2.9-6.5h5.9z"/></svg>`;

function dedo() {
  const d = document.createElement('span');
  const tactil = matchMedia('(pointer: coarse)').matches;
  d.className = `dedo ${tactil ? 'mano' : 'cursor'}`;
  d.innerHTML = `<span class="dedo-onda"></span>${tactil ? SVG_MANO : SVG_CURSOR}`;
  return d;
}

/** Lleva la mano (o el cursor) a un elemento de la escena y simula un toque. */
async function tocar(d, objetivo, escena, señal) {
  const e = escena.getBoundingClientRect();
  const r = objetivo.getBoundingClientRect();
  d.style.left = `${r.left - e.left + r.width / 2}px`;
  d.style.top = `${r.top - e.top + r.height / 2}px`;
  d.classList.add('visible');
  await esperar(550, señal);
  d.classList.add('toque');
  await esperar(420, señal);
  d.classList.remove('toque');
}

// ---------- Diapositivas ----------

const DIAPOSITIVAS = [
  {
    titulo: 'Un culpable al día',
    texto: 'Cada día, <strong>uno de los 118 elementos</strong> es el culpable. Tu primera pista es el informe del caso.',
    montar(escena) {
      const informe = document.createElement('div');
      informe.className = 'mini-informe';
      informe.innerHTML = '<span class="mini-etiqueta">Informe del caso</span><p></p>';
      const { tabla } = miniTabla();
      const lupa = document.createElement('span');
      lupa.className = 'mini-lupa';
      lupa.innerHTML = svg('i-lupa');
      escena.append(informe, tabla, lupa);
      const p = informe.querySelector('p');
      return (señal) => enBucle(señal, async () => {
        p.textContent = '';
        await esperar(400, señal);
        await escribir(p, 'Dos hermanos lo aislaron en 1783 en un seminario de Bergara…', señal, 40);
        await esperar(2600, señal);
      });
    },
  },
  {
    titulo: 'Acusa por su nombre',
    texto: 'Escribe su nombre y elígelo en la lista. Tienes <strong>6 acusaciones</strong>: cada ficha es una.',
    montar(escena) {
      escena.classList.add('escena-panel');
      escena.innerHTML = `
        <div class="mini-panel">
          <ol class="mini-fichas">${'<li></li>'.repeat(6)}</ol>
          <div class="mini-entrada">
            <ul class="mini-desplegable"><li><b>Hie</b>rro <i>Fe</i></li></ul>
            <span class="mini-campo"></span><span class="mini-boton">Acusar</span>
          </div>
        </div>`;
      const d = dedo();
      escena.append(d);
      const fichas = [...escena.querySelectorAll('.mini-fichas li')];
      const campo = escena.querySelector('.mini-campo');
      const lista = escena.querySelector('.mini-desplegable');
      const boton = escena.querySelector('.mini-boton');
      return (señal) => enBucle(señal, async () => {
        fichas.forEach((f, i) => {
          f.className = i === 0 ? 'ahora' : '';
          f.textContent = i === 0 ? '?' : '';
        });
        campo.textContent = '';
        lista.classList.remove('abierto');
        d.classList.remove('visible');
        await esperar(500, señal);
        await escribir(campo, 'hie', señal, 180);
        lista.classList.add('abierto');
        await esperar(400, señal);
        await tocar(d, lista.firstElementChild, escena, señal);
        lista.classList.remove('abierto');
        campo.textContent = 'Hierro';
        await esperar(350, señal);
        await tocar(d, boton, escena, señal);
        campo.textContent = '';
        d.classList.remove('visible');
        fichas[0].className = 'usado nueva';
        fichas[0].textContent = 'Fe';
        fichas[1].className = 'ahora';
        fichas[1].textContent = '?';
        await esperar(2400, señal);
      });
    },
  },
  {
    titulo: 'Elige una pista',
    texto: 'Si fallas, el acusado tiene coartada y te ofrece <strong>3 pistas</strong>. Elige una: cada tipo solo se usa una vez.',
    montar(escena) {
      escena.classList.add('escena-oscura');
      const opciones = [['i-abajo', 'Abajo'], ['i-estado', 'Estado'], ['i-curiosidad', 'Curiosidad']];
      escena.innerHTML = `
        <p class="mini-titulo">Hierro tiene coartada</p>
        <div class="mini-opciones">${opciones.map(([i, n]) => `
          <div class="mini-opcion"><span class="mini-ico">${svg(i)}</span>
            <span class="mini-texto"><strong>${n}</strong><span class="mini-resp"></span></span></div>`).join('')}
        </div>`;
      const d = dedo();
      escena.append(d);
      const tarjetas = [...escena.querySelectorAll('.mini-opcion')];
      return (señal) => enBucle(señal, async () => {
        tarjetas.forEach((t) => {
          t.className = 'mini-opcion';
          t.querySelector('.mini-resp').textContent = '';
          t.querySelector('.veredicto')?.remove();
        });
        d.classList.remove('visible');
        await esperar(300, señal);
        for (const t of tarjetas) {
          t.classList.add('entra');
          await esperar(140, señal);
        }
        await esperar(700, señal);
        await tocar(d, tarjetas[0], escena, señal);
        d.classList.remove('visible');
        tarjetas.forEach((t, i) => t.classList.add(i === 0 ? 'elegida' : 'apartada'));
        await esperar(400, señal);
        const sello = document.createElement('span');
        sello.className = 'veredicto si';
        sello.textContent = 'SÍ';
        tarjetas[0].append(sello);
        await escribir(tarjetas[0].querySelector('.mini-resp'), 'Está más abajo que Hierro', señal, 35);
        await esperar(2400, señal);
      });
    },
  },
  {
    titulo: 'Pregunta desde el sitio adecuado',
    texto: 'Arriba, abajo, izquierda, derecha y número atómico se miden <strong>desde tu última acusación</strong>.',
    nota: 'Izquierda y derecha usan la tabla larga: el bloque f va entre los grupos 2 y 3.',
    montar(escena) {
      const t = miniTabla();
      escena.append(t.tabla);
      return (señal) => enBucle(señal, async () => {
        t.reiniciar();
        await esperar(600, señal);
        t.marcar('Fe', 'fallo').classList.add('salta');
        await esperar(700, señal);
        t.marcar('Fe', 'con-icono', 'f-abajo');
        await esperar(500, señal);
        // «Está más abajo que el hierro»: se apagan los periodos 1 a 4, fila a fila
        for (let periodo = 1; periodo <= 4; periodo++) {
          ELEMENTOS.filter((el) => el.periodo === periodo && el.simbolo !== 'Fe')
            .forEach((el) => t.celdas.get(el.simbolo).classList.add('off'));
          await esperar(220, señal);
        }
        await esperar(2600, señal);
      });
    },
  },
  {
    titulo: 'Sigue el rastro',
    texto: 'La tabla <strong>apaga a quien tiene coartada</strong> y cada pista deja su icono en la casilla. Tócalo para releerla.',
    montar(escena) {
      const t = miniTabla();
      const bocadillo = document.createElement('span');
      bocadillo.className = 'mini-bocadillo';
      bocadillo.textContent = 'Está más a la izquierda que Platino';
      const d = dedo();
      escena.append(t.tabla, bocadillo, d);
      const pt = porSimbolo('Pt');
      const posible = (el) => el.periodo > 4 && el.col32 < pt.col32;
      return (señal) => enBucle(señal, async () => {
        t.reiniciar();
        bocadillo.classList.remove('visible');
        d.classList.remove('visible');
        ELEMENTOS.forEach((el) => { if (!posible(el)) t.celdas.get(el.simbolo).classList.add('off'); });
        t.marcar('Fe', 'fallo', 'f-abajo');
        const celdaPt = t.marcar('Pt', 'fallo', 'f-izquierda');
        await esperar(900, señal);
        await tocar(d, celdaPt, escena, señal);
        const e = escena.getBoundingClientRect();
        const r = celdaPt.getBoundingClientRect();
        bocadillo.style.left = `${r.left - e.left + r.width / 2}px`;
        bocadillo.style.top = `${r.top - e.top}px`;
        bocadillo.classList.add('visible');
        await esperar(500, señal);
        d.classList.remove('visible');
        await esperar(2600, señal);
      });
    },
  },
  {
    titulo: 'Tu turno, detective',
    clase: 'diapo-final',
    texto: '118 sospechosos. Un solo culpable. <strong>Ninguna coartada dura para siempre.</strong>',
    montar(escena) {
      // El sello de Holmio (img/sello.svg) cae sobre la mesa como un tampón
      escena.classList.add('escena-oscura', 'escena-final');
      escena.innerHTML = '<span class="sello-holmio" role="img" aria-label="Sello de Holmio"></span>';
      const sello = escena.querySelector('.sello-holmio');
      // Una sola vez cada vez que se llega a la diapositiva (sin bucle)
      return async (señal) => {
        sello.classList.remove('estampado');
        escena.classList.remove('golpe');
        void sello.offsetWidth; // reinicia la animación si se vuelve a la diapositiva
        await esperar(400, señal);
        sello.classList.add('estampado');
        await esperar(290, señal); // instante del impacto
        escena.classList.add('golpe');
      };
    },
  },
];

// ---------- Carrusel ----------

export function crearTutorial(dialogo) {
  const pista = dialogo.querySelector('.diapos-pista');
  const puntos = dialogo.querySelector('.diapos-puntos');
  const anterior = dialogo.querySelector('.diapo-anterior');
  const siguiente = dialogo.querySelector('.diapo-siguiente');
  const pie = dialogo.querySelector('.diapos-pie');
  const abrirCaso = dialogo.querySelector('.diapos-abrir');
  const total = DIAPOSITIVAS.length;

  const animaciones = DIAPOSITIVAS.map((d, i) => {
    const s = document.createElement('section');
    s.className = `diapo ${d.clase ?? ''}`;
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'diapositiva');
    s.setAttribute('aria-label', `${i + 1} de ${total}: ${d.titulo}`);
    s.innerHTML = `<div class="escena" aria-hidden="true"></div><h3></h3><p>${d.texto}</p>${d.nota ? `<p class="nota">${d.nota}</p>` : ''}`;
    s.querySelector('h3').textContent = d.titulo;
    pista.append(s);
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
    b.addEventListener('click', () => ir(i));
    puntos.append(b);
    return d.montar(s.querySelector('.escena'));
  });

  let actual = 0;
  let control = null;

  function ir(i) {
    actual = Math.max(0, Math.min(total - 1, i));
    pista.style.transform = `translateX(${-actual * 100}%)`;
    [...pista.children].forEach((s, j) => (s.inert = j !== actual));
    [...puntos.children].forEach((p, j) => p.setAttribute('aria-current', String(j === actual)));
    // Sin flecha izquierda en la primera ni derecha en la última; en la última, el botón noir.
    const primera = actual === 0;
    const ultima = actual === total - 1;
    anterior.classList.toggle('oculta', primera);
    anterior.inert = primera;
    siguiente.classList.toggle('oculta', ultima);
    siguiente.inert = ultima;
    pie.classList.toggle('final', ultima);
    abrirCaso.inert = !ultima;
    puntos.inert = ultima;
    control?.abort();
    control = new AbortController();
    animaciones[actual](control.signal).catch(() => {});
  }

  function cerrar() {
    control?.abort();
    dialogo.close();
  }

  anterior.addEventListener('click', () => ir(actual - 1));
  siguiente.addEventListener('click', () => ir(actual + 1));
  abrirCaso.addEventListener('click', cerrar);
  dialogo.querySelector('.diapos-saltar').addEventListener('click', cerrar);
  dialogo.addEventListener('close', () => control?.abort());
  dialogo.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') ir(actual + 1);
    if (e.key === 'ArrowLeft') ir(actual - 1);
  });

  // Deslizar con el dedo: la pista sigue al dedo y, al soltar, pasa de diapositiva si se movió bastante.
  const marco = dialogo.querySelector('.diapos');
  let inicio = null;
  marco.addEventListener('pointerdown', (e) => {
    inicio = { x: e.clientX, y: e.clientY, dx: 0, horizontal: null };
  });
  marco.addEventListener('pointermove', (e) => {
    if (!inicio) return;
    const dx = e.clientX - inicio.x;
    const dy = e.clientY - inicio.y;
    if (inicio.horizontal === null && Math.hypot(dx, dy) > 8) {
      inicio.horizontal = Math.abs(dx) > Math.abs(dy);
      if (inicio.horizontal) {
        marco.setPointerCapture(e.pointerId);
        pista.classList.add('arrastrando');
      }
    }
    if (inicio.horizontal) {
      inicio.dx = dx;
      pista.style.transform = `translateX(calc(${-actual * 100}% + ${dx}px))`;
    }
  });
  const soltar = () => {
    if (!inicio) return;
    const { dx, horizontal } = inicio;
    inicio = null;
    pista.classList.remove('arrastrando');
    if (horizontal && dx < -45 && actual < total - 1) ir(actual + 1);
    else if (horizontal && dx > 45 && actual > 0) ir(actual - 1);
    else pista.style.transform = `translateX(${-actual * 100}%)`; // vuelve a su sitio sin reiniciar la escena
  };
  marco.addEventListener('pointerup', soltar);
  marco.addEventListener('pointercancel', soltar);

  return {
    abrir() {
      dialogo.showModal();
      // El foco va al propio diálogo (no a «Saltar», el primer botón): las flechas
      // del teclado siguen funcionando y no aparece ningún botón resaltado.
      dialogo.focus();
      ir(0);
    },
  };
}

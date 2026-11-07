// Calendario de casos. Los culpables y sus textos van codificados en casos-datos.js, para que
// nadie se destripe un caso por accidente al curiosear el código. No es seguridad: quien
// quiera puede descodificarlos. Se generan con herramientas/casos.py.

import { CASOS_CODIFICADOS, ORDENES_SIGUIENTES } from './casos-datos.js';

function descodificar(texto, indice) {
  let x = (67 * (indice + 1)) >>> 0;
  const bytes = Uint8Array.from(atob(texto), (c) => {
    x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
    return c.charCodeAt(0) ^ (x >>> 24);
  });
  return JSON.parse(new TextDecoder().decode(bytes));
}

// Fecha del Caso nº 1: el día del lanzamiento.
export const FECHA_CASO_1 = '2026-11-07';

const DIA_MS = 86_400_000;

/** Fecha local en formato AAAA-MM-DD. */
export function fechaLocal(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Número de caso para una fecha local (1 = FECHA_CASO_1). */
export function numeroDeCaso(fecha = fechaLocal()) {
  const [a, m, d] = fecha.split('-').map(Number);
  const [a1, m1, d1] = FECHA_CASO_1.split('-').map(Number);
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(a1, m1 - 1, d1)) / DIA_MS) + 1;
}

/**
 * Caso por número (1, 2, 3…). El primer ciclo va en el orden de la lista; cada ciclo
 * siguiente tiene el suyo, para que no se pueda predecir quién sale cada día.
 */
export function casoPorNumero(numero) {
  const total = CASOS_CODIFICADOS.length;
  const vuelta = Math.floor((numero - 1) / total);
  const posicion = (numero - 1) % total;
  const indice = vuelta === 0 ? posicion : ORDENES_SIGUIENTES[(vuelta - 1) % ORDENES_SIGUIENTES.length][posicion];
  return { numero, ...descodificar(CASOS_CODIFICADOS[indice], indice) };
}

/** Fecha (local, a medianoche) en la que se publicó el caso `numero`. */
export function fechaDeCaso(numero) {
  const [a, m, d] = FECHA_CASO_1.split('-').map(Number);
  return new Date(a, m - 1, d + numero - 1);
}

/** Número del caso de hoy. */
export function numeroDeHoy() {
  return Math.max(1, numeroDeCaso());
}

/** Caso del día. */
export function casoDelDia() {
  return casoPorNumero(numeroDeHoy());
}

/** Milisegundos hasta la próxima medianoche local. */
export function msHastaManana(ahora = new Date()) {
  const m = new Date(ahora);
  m.setHours(24, 0, 0, 0);
  return m - ahora;
}

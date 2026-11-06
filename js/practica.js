// Práctica libre: casos al azar entre los 118 elementos, sin informe escrito.
// Así funciona con todos los elementos y nunca destripa un caso del día que aún no ha
// salido. Sin informe tampoco hay etimología ni curiosidad: la partida se juega con las
// pistas de datos, y Partida ya deja fuera las que no tienen texto.

import { ELEMENTOS } from './elementos.js';

const MEMORIA = 30; // no se repite ninguno de los últimos elementos jugados

export const INFORME_PRACTICA = 'Sin informe. Este sospechoso no ha dejado rastro: solo te quedan las pistas.';

/** Sortea un caso nuevo. Devuelve { z, semilla, recientes }, listo para guardar. */
export function sortearCaso(recientes = []) {
  const libres = ELEMENTOS.filter((el) => !recientes.includes(el.z));
  const { z } = libres[Math.floor(Math.random() * libres.length)];
  return {
    z,
    // Hace de número de caso: fija las pistas ofrecidas aunque se recargue la página
    semilla: Math.floor(Math.random() * 1e9),
    recientes: [...recientes, z].slice(-MEMORIA),
  };
}

/** El caso que entiende Partida a partir de lo sorteado. */
export const casoDePractica = ({ z, semilla }) => ({ numero: semilla, z, informe: INFORME_PRACTICA });

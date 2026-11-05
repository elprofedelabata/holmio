// ⚠️ TEMPORAL — solo para ver los estilos del archivo con casos en todos los estados.
// Rellena partidas de ejemplo (cerradas en 1–6 acusaciones, fugadas y en curso) en los
// casos anteriores a hoy que aún no se hayan jugado. Para quitarlo: borrar este archivo,
// su import en main.js y poner FECHA_CASO_1 en su fecha real.

import { casoPorNumero } from './casos.js';

const MARCA = 'holmio-demo-archivo';
// Acusaciones falsas: se usan las que no sean el culpable de ese caso
const SOSPECHOSOS = [26, 78, 1, 8, 79, 47, 11, 6];
const PISTAS = ['bloque', 'tipo', 'radiactivo', 'numero', 'curiosidad'];

function partidaDeEjemplo(numero) {
  const secreto = casoPorNumero(numero).z;
  const fallos = SOSPECHOSOS.filter((z) => z !== secreto);
  const patron = numero % 7; // reparte los estados a lo largo del calendario
  let intentos;
  if (patron === 0 || patron === 4) return null; // pendiente: se deja sin jugar
  if (patron === 3) intentos = fallos.slice(0, 6); // fugado
  else if (patron === 5) intentos = fallos.slice(0, 1 + (numero % 3)); // en curso
  else intentos = [...fallos.slice(0, (numero * 5) % 6), secreto]; // cerrado en 1–6
  const pistas = intentos
    .filter((z) => z !== secreto)
    .slice(0, 5)
    .map((desde, i) => ({ tipo: PISTAS[i], desde }));
  return { intentos, pistas };
}

export function sembrarArchivoDeEjemplo(numeroHoy) {
  try {
    const sembrados = JSON.parse(localStorage.getItem(MARCA) ?? '[]');
    for (let n = 1; n < numeroHoy; n++) {
      const clave = `holmio-caso-${n}`;
      if (localStorage.getItem(clave) || sembrados.includes(n)) continue;
      const datos = partidaDeEjemplo(n);
      sembrados.push(n);
      if (datos) localStorage.setItem(clave, JSON.stringify(datos));
    }
    localStorage.setItem(MARCA, JSON.stringify(sembrados));
  } catch {}
}

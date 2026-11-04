// Tipos de pista adicional. Cada tipo se recibe como mucho una vez por partida.
//
// Cada tipo define:
//   nombre             → para la tarjeta de elección
//   icono              → emoji, solo para el texto de compartir
//   svg                → id del icono SVG en index.html (i-<clave>), se añade abajo
//   pregunta(ultimo)   → qué averiguarás si la eliges
//   disponible(s)      → si tiene sentido para este elemento secreto
//   resolver(s, u)     → { texto, filtro?, negativa? }
//                        filtro(el) = true si `el` sigue siendo posible;
//                        negativa = la respuesta es «no» (se marca el icono tachado)
// s = elemento secreto, u = último elemento acusado (para las pistas relativas).

import { TIPOS, ESTADOS } from './elementos.js';

const cmp = (a, b) => Math.sign(a - b);

/**
 * Pista de dirección: pregunta de sí o no respecto al último acusado.
 * Vertical = periodo; horizontal = columna en la tabla larga de 32 columnas.
 * El «no» incluye la misma fila/columna, y así se explica en el texto.
 */
function direccion({ icono, nombre, eje, signo, frase, siNo }) {
  const valor = (el) => (eje === 'periodo' ? el.periodo : el.col32);
  const cumple = (el, u) => cmp(valor(el), valor(u)) === signo;
  return {
    icono,
    nombre,
    pregunta: (u) => `¿Está ${frase} que ${u.simbolo}?`,
    disponible: () => true,
    resolver(s, u) {
      const si = cumple(s, u);
      const texto = si ? `Está ${frase} que ${u.nombre}` : `No está ${frase} que ${u.nombre} (${siNo})`;
      return { texto, filtro: (el) => cumple(el, u) === si, negativa: !si };
    },
  };
}

export const TIPOS_PISTA = {
  arriba: direccion({
    icono: '⬆️', nombre: 'Arriba', eje: 'periodo', signo: -1,
    frase: 'más arriba', siNo: 'mismo periodo o más abajo',
  }),
  abajo: direccion({
    icono: '⬇️', nombre: 'Abajo', eje: 'periodo', signo: 1,
    frase: 'más abajo', siNo: 'mismo periodo o más arriba',
  }),
  izquierda: direccion({
    icono: '⬅️', nombre: 'Izquierda', eje: 'col32', signo: -1,
    frase: 'más a la izquierda', siNo: 'misma columna o más a la derecha',
  }),
  derecha: direccion({
    icono: '➡️', nombre: 'Derecha', eje: 'col32', signo: 1,
    frase: 'más a la derecha', siNo: 'misma columna o más a la izquierda',
  }),
  numero: {
    icono: '#️⃣',
    nombre: 'Número atómico',
    pregunta: (u) => `¿Mayor o menor que el de ${u.simbolo} (${u.z})?`,
    disponible: () => true,
    resolver(s, u) {
      const c = cmp(s.z, u.z);
      const texto = `Su número atómico es ${c > 0 ? 'mayor' : 'menor'} que el de ${u.nombre} (${u.z})`;
      return { texto, filtro: (el) => cmp(el.z, u.z) === c };
    },
  },
  bloque: {
    icono: '🧱',
    nombre: 'Bloque',
    pregunta: () => '¿En qué bloque está: s, p, d o f?',
    disponible: () => true,
    resolver: (s) => ({ texto: `Es del bloque ${s.bloque}`, filtro: (el) => el.bloque === s.bloque }),
  },
  tipo: {
    icono: '🔩',
    nombre: 'Familia',
    pregunta: () => '¿Metal, no metal, gas noble…?',
    disponible: () => true,
    resolver: (s) => ({ texto: `Es un ${TIPOS[s.tipo]}`, filtro: (el) => el.tipo === s.tipo }),
  },
  estado: {
    icono: '🌡️',
    nombre: 'Estado',
    pregunta: () => '¿Sólido, líquido o gas a 25 °C?',
    disponible: (s) => s.estado !== null,
    resolver: (s) => ({
      texto: `A 25 °C es ${s.estado === 'g' ? 'un gas' : ESTADOS[s.estado]}`,
      // Los elementos de estado desconocido no se descartan.
      filtro: (el) => el.estado === null || el.estado === s.estado,
    }),
  },
  radiactivo: {
    icono: '☢️',
    nombre: 'Radiactividad',
    pregunta: () => '¿Tiene algún isótopo estable?',
    disponible: () => true,
    resolver: (s) => ({
      texto: s.radiactivo ? 'Todos sus isótopos son radiactivos' : 'Tiene al menos un isótopo estable',
      filtro: (el) => el.radiactivo === s.radiactivo,
    }),
  },
  etimologia: {
    icono: '🔤',
    nombre: 'Etimología',
    pregunta: () => '¿De dónde viene su nombre?',
    disponible: (s, caso) => Boolean(caso.etimologia),
    resolver: (s, u, caso) => ({ texto: caso.etimologia }),
  },
  curiosidad: {
    icono: '💡',
    nombre: 'Curiosidad',
    pregunta: () => 'Un dato más del expediente',
    disponible: (s, caso) => Boolean(caso.curiosidad),
    resolver: (s, u, caso) => ({ texto: caso.curiosidad }),
  },
};

for (const [clave, def] of Object.entries(TIPOS_PISTA)) def.svg = `i-${clave}`;

// --- Azar determinista -------------------------------------------------------

function hash(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Baraja las claves de TIPOS_PISTA con una semilla. */
export function barajar(semilla) {
  const rnd = mulberry32(hash(semilla));
  const lista = Object.keys(TIPOS_PISTA);
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

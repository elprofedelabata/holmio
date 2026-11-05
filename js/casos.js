// Casos del prototipo (pistas provisionales, pendientes de revisar).
// En la versión final esto será un calendario fecha → caso, y se ofuscará.

export const CASOS = [
  {
    z: 74, // Wolframio
    informe:
      'Dos hermanos lo aislaron en 1783 en un seminario de Bergara. Su símbolo delata un nombre que en inglés casi nadie usa.',
    etimologia: 'Su otro nombre viene del sueco y significa «piedra pesada».',
    curiosidad: 'Es el metal con el punto de fusión más alto: unos 3422 °C.',
  },
  {
    z: 31, // Galio
    informe:
      'Mendeléiev describió sus propiedades años antes de que nadie lo viera. Su descubridor le puso el nombre de su país… o, según las malas lenguas, el suyo propio.',
    etimologia: 'Su nombre viene de Gallia, el nombre latino de Francia.',
    curiosidad: 'Se funde en la palma de la mano: su punto de fusión ronda los 30 °C.',
  },
  {
    z: 2, // Helio
    informe:
      'Se detectó primero fuera de la Tierra, durante un eclipse de 1868. Aquí no se encontró hasta casi tres décadas después.',
    etimologia: 'Su nombre viene del dios griego del Sol.',
    curiosidad: 'Es el único elemento que no se solidifica a presión normal, por mucho que se enfríe.',
  },
  {
    z: 15, // Fósforo
    informe:
      'Un alquimista de Hamburgo lo encontró en 1669 buscando la piedra filosofal… hirviendo cubos y cubos de orina.',
    etimologia: 'En griego, su nombre significa «portador de luz».',
    curiosidad: 'Una de sus formas brilla en la oscuridad al reaccionar lentamente con el oxígeno del aire.',
  },
  {
    z: 80, // Mercurio
    informe:
      'En el siglo XIX, muchos sombrereros acababan con temblores y delirios por respirar sus vapores mientras trabajaban el fieltro.',
    etimologia: 'Su símbolo viene del griego hydrárgyros, «plata líquida».',
    curiosidad: 'Almadén (Ciudad Real) fue durante siglos la mayor mina de este elemento del mundo.',
  },
  {
    z: 60, // Neodimio
    informe:
      'Está en casi todos los auriculares y en los motores de muchos coches eléctricos: con él se fabrican los imanes permanentes más potentes.',
    etimologia:
      'Su nombre significa «gemelo nuevo»: durante años se confundió con su hermano dentro de una mezcla llamada didimio.',
    curiosidad:
      'Lo separó en 1885 Carl Auer von Welsbach, el mismo que inventó la camisa incandescente de las lámparas de gas.',
  },
];

// Fecha del Caso nº 1 (provisional para el prototipo).
export const FECHA_CASO_1 = '2026-11-01';

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

/** Caso por número (1, 2, 3…). En el prototipo, los casos de prueba se repiten en bucle. */
export function casoPorNumero(numero) {
  return { numero, ...CASOS[(numero - 1) % CASOS.length] };
}

/** Fecha (local, a medianoche) en la que se publicó el caso `numero`. */
export function fechaDeCaso(numero) {
  const [a, m, d] = FECHA_CASO_1.split('-').map(Number);
  return new Date(a, m - 1, d + numero - 1);
}

/** Número del caso de hoy. En el prototipo, ?caso=N lo fuerza (para probar). */
export function numeroDeHoy() {
  const forzado = Number(new URLSearchParams(location.search).get('caso'));
  return forzado >= 1 ? Math.floor(forzado) : Math.max(1, numeroDeCaso());
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

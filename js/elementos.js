// Datos de los 118 elementos y su posición en la tabla.
//
// Disposición: Lu y Lr en el grupo 3; el bloque f son La–Yb y Ac–No (14 + 14).
// - Tabla visible: 18 columnas, con el bloque f en dos filas aparte (filas 9 y 10).
// - Tabla larga (32 columnas): se usa para las pistas horizontales, para que el
//   bloque f quede en su sitio, entre los grupos 2 y 3.

// Formato: "Símbolo|Nombre|otros nombres aceptados|tipo|estado a 25 °C"
// tipo:   al alcalino · at alcalinotérreo · tr transición · la lantánido · ac actínido
//         om otro metal · md metaloide · nm no metal · ha halógeno · gn gas noble
// estado: s sólido · l líquido · g gas · ? desconocido (nunca se ha obtenido una muestra visible)
const CRUDO = `
H|Hidrógeno||nm|g
He|Helio||gn|g
Li|Litio||al|s
Be|Berilio||at|s
B|Boro||md|s
C|Carbono||nm|s
N|Nitrógeno||nm|g
O|Oxígeno||nm|g
F|Flúor||ha|g
Ne|Neón||gn|g
Na|Sodio||al|s
Mg|Magnesio||at|s
Al|Aluminio||om|s
Si|Silicio||md|s
P|Fósforo||nm|s
S|Azufre||nm|s
Cl|Cloro||ha|g
Ar|Argón||gn|g
K|Potasio||al|s
Ca|Calcio||at|s
Sc|Escandio||tr|s
Ti|Titanio||tr|s
V|Vanadio||tr|s
Cr|Cromo||tr|s
Mn|Manganeso||tr|s
Fe|Hierro||tr|s
Co|Cobalto||tr|s
Ni|Níquel||tr|s
Cu|Cobre||tr|s
Zn|Zinc|Cinc|tr|s
Ga|Galio||om|s
Ge|Germanio||md|s
As|Arsénico||md|s
Se|Selenio||nm|s
Br|Bromo||ha|l
Kr|Kriptón|Criptón|gn|g
Rb|Rubidio||al|s
Sr|Estroncio||at|s
Y|Itrio||tr|s
Zr|Circonio|Zirconio|tr|s
Nb|Niobio||tr|s
Mo|Molibdeno||tr|s
Tc|Tecnecio||tr|s
Ru|Rutenio||tr|s
Rh|Rodio||tr|s
Pd|Paladio||tr|s
Ag|Plata||tr|s
Cd|Cadmio||tr|s
In|Indio||om|s
Sn|Estaño||om|s
Sb|Antimonio||md|s
Te|Telurio|Teluro|md|s
I|Yodo|Iodo|ha|s
Xe|Xenón||gn|g
Cs|Cesio||al|s
Ba|Bario||at|s
La|Lantano||la|s
Ce|Cerio||la|s
Pr|Praseodimio||la|s
Nd|Neodimio||la|s
Pm|Prometio||la|s
Sm|Samario||la|s
Eu|Europio||la|s
Gd|Gadolinio||la|s
Tb|Terbio||la|s
Dy|Disprosio||la|s
Ho|Holmio||la|s
Er|Erbio||la|s
Tm|Tulio||la|s
Yb|Iterbio||la|s
Lu|Lutecio||la|s
Hf|Hafnio||tr|s
Ta|Tantalio|Tántalo|tr|s
W|Wolframio|Tungsteno|tr|s
Re|Renio||tr|s
Os|Osmio||tr|s
Ir|Iridio||tr|s
Pt|Platino||tr|s
Au|Oro||tr|s
Hg|Mercurio||tr|l
Tl|Talio||om|s
Pb|Plomo||om|s
Bi|Bismuto||om|s
Po|Polonio||om|s
At|Astato||ha|s
Rn|Radón||gn|g
Fr|Francio||al|s
Ra|Radio||at|s
Ac|Actinio||ac|s
Th|Torio||ac|s
Pa|Protactinio||ac|s
U|Uranio||ac|s
Np|Neptunio||ac|s
Pu|Plutonio||ac|s
Am|Americio||ac|s
Cm|Curio||ac|s
Bk|Berkelio||ac|s
Cf|Californio||ac|s
Es|Einstenio||ac|s
Fm|Fermio||ac|?
Md|Mendelevio||ac|?
No|Nobelio||ac|?
Lr|Lawrencio|Laurencio|ac|?
Rf|Rutherfordio||tr|?
Db|Dubnio||tr|?
Sg|Seaborgio||tr|?
Bh|Bohrio||tr|?
Hs|Hasio|Hassio|tr|?
Mt|Meitnerio||tr|?
Ds|Darmstatio||tr|?
Rg|Roentgenio||tr|?
Cn|Copernicio||tr|?
Nh|Nihonio||om|?
Fl|Flerovio||om|?
Mc|Moscovio||om|?
Lv|Livermorio||om|?
Ts|Teneso||ha|?
Og|Oganesón||gn|?
`;

export const TIPOS = {
  al: 'metal alcalino',
  at: 'metal alcalinotérreo',
  tr: 'metal de transición',
  la: 'lantánido',
  ac: 'actínido',
  om: 'metal del bloque p',
  md: 'metaloide',
  nm: 'no metal',
  ha: 'halógeno',
  gn: 'gas noble',
};

export const ESTADOS = { s: 'sólido', l: 'líquido', g: 'gas' };

// Sin isótopos estables: Tc, Pm y todos desde el bismuto (Z ≥ 83).
// El bismuto‑209 es radiactivo, aunque con una semivida de ~2·10¹⁹ años.
const esRadiactivo = (z) => z === 43 || z === 61 || z >= 83;

/** Grupo (1–18) o null para el bloque f, y periodo. */
function grupoYPeriodo(z) {
  if (z === 1) return { grupo: 1, periodo: 1 };
  if (z === 2) return { grupo: 18, periodo: 1 };
  if (z <= 18) {
    const periodo = z <= 10 ? 2 : 3;
    const i = z - (periodo === 2 ? 2 : 10); // 1..8 dentro del periodo
    return { grupo: i <= 2 ? i : i + 10, periodo };
  }
  if (z <= 54) {
    const periodo = z <= 36 ? 4 : 5;
    return { grupo: z - (periodo === 4 ? 18 : 36), periodo };
  }
  const periodo = z <= 86 ? 6 : 7;
  const i = z - (periodo === 6 ? 54 : 86); // 1..32 dentro del periodo
  if (i <= 2) return { grupo: i, periodo };
  if (i <= 16) return { grupo: null, periodo, f: i - 3 }; // La–Yb / Ac–No
  return { grupo: i - 14, periodo }; // Lu/Lr → grupo 3 … Rn/Og → grupo 18
}

export const quitarTildes = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export const ELEMENTOS = CRUDO.trim().split('\n').map((linea, i) => {
  const [simbolo, nombre, otros, tipo, estado] = linea.split('|');
  const z = i + 1;
  const { grupo, periodo, f } = grupoYPeriodo(z);
  const bloque =
    grupo === null ? 'f' : z === 2 || grupo <= 2 ? 's' : grupo <= 12 ? 'd' : 'p';
  return {
    z,
    simbolo,
    nombre,
    nombres: [nombre, ...(otros ? otros.split(',') : [])],
    tipo,
    estado: estado === '?' ? null : estado,
    radiactivo: esRadiactivo(z),
    grupo,
    periodo,
    bloque,
    // Columna en la tabla larga de 32 columnas.
    col32: grupo === null ? 3 + f : grupo <= 2 ? grupo : grupo + 14,
    // Celda en la tabla visible de 18 columnas.
    fila: grupo === null ? periodo + 3 : periodo,
    col: grupo === null ? 4 + f : grupo,
  };
});

export const porZ = (z) => ELEMENTOS[z - 1];

const indiceBusqueda = ELEMENTOS.flatMap((el) => [
  ...el.nombres.map((n) => ({ clave: quitarTildes(n), el, tipo: 'nombre' })),
  { clave: quitarTildes(el.simbolo), el, tipo: 'simbolo' },
]);

/** Busca un elemento exacto por nombre (sin tildes) o símbolo. */
export function buscarExacto(texto) {
  const q = quitarTildes(texto);
  if (!q) return null;
  return indiceBusqueda.find((e) => e.clave === q)?.el ?? null;
}

/** Sugerencias para el autocompletado: símbolo exacto primero, luego nombres que empiezan por el texto. */
export function sugerencias(texto, max = 5) {
  const q = quitarTildes(texto);
  if (!q) return [];
  const vistos = new Set();
  const out = [];
  const add = (el) => {
    if (!vistos.has(el.z) && out.length < max) {
      vistos.add(el.z);
      out.push(el);
    }
  };
  indiceBusqueda.filter((e) => e.tipo === 'simbolo' && e.clave === q).forEach((e) => add(e.el));
  indiceBusqueda.filter((e) => e.tipo === 'nombre' && e.clave.startsWith(q)).forEach((e) => add(e.el));
  if (q.length >= 3) {
    indiceBusqueda.filter((e) => e.tipo === 'nombre' && e.clave.includes(q)).forEach((e) => add(e.el));
  }
  return out;
}

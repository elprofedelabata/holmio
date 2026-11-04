// Estado y reglas de una partida. Sin nada de interfaz.

import { ELEMENTOS, porZ } from './elementos.js';
import { TIPOS_PISTA, barajar } from './pistas.js';

export const MAX_INTENTOS = 6;
export const OPCIONES_POR_TURNO = 3;

export class Partida {
  /**
   * @param caso   { numero, z, informe, etimologia, curiosidad }
   * @param datos  estado guardado { intentos: [z], pistas: [{ tipo, desde }] }
   */
  constructor(caso, datos = {}) {
    this.caso = caso;
    this.secreto = porZ(caso.z);
    this.intentos = [...(datos.intentos ?? [])];
    this.pistas = [...(datos.pistas ?? [])];
  }

  datos() {
    return { intentos: this.intentos, pistas: this.pistas };
  }

  get ganada() {
    return this.intentos.includes(this.secreto.z);
  }

  get perdida() {
    return !this.ganada && this.intentos.length >= MAX_INTENTOS;
  }

  get terminada() {
    return this.ganada || this.perdida;
  }

  get ultimo() {
    return this.intentos.length ? porZ(this.intentos.at(-1)) : null;
  }

  /** 'acusar' | 'elegir' | 'fin' */
  get fase() {
    if (this.terminada) return 'fin';
    return this.intentos.length > this.pistas.length ? 'elegir' : 'acusar';
  }

  /** Pistas recibidas, ya resueltas: [{ tipo, icono, texto, filtro, desde }] */
  pistasResueltas() {
    // tipo null = no quedaba ninguna pista útil y se siguió sin pista.
    return this.pistas.filter((p) => p.tipo).map(({ tipo, desde }) => {
      const def = TIPOS_PISTA[tipo];
      const { texto, filtro } = def.resolver(this.secreto, porZ(desde), this.caso);
      return { tipo, icono: def.icono, texto, filtro, desde };
    });
  }

  /** Elementos aún compatibles con todas las pistas y que no se han acusado. */
  candidatos(resueltas = this.pistasResueltas()) {
    return ELEMENTOS.filter(
      (el) => !this.intentos.includes(el.z) && resueltas.every((p) => !p.filtro || p.filtro(el)),
    );
  }

  /** Tipos de pista que se ofrecen ahora mismo (como mucho 3). */
  opciones() {
    if (this.fase !== 'elegir') return [];
    const usados = new Set(this.pistas.map((p) => p.tipo));
    const u = this.ultimo;
    const quedan = this.candidatos();
    const util = (tipo) => {
      const def = TIPOS_PISTA[tipo];
      if (usados.has(tipo) || !def.disponible(this.secreto, this.caso)) return false;
      const { filtro } = def.resolver(this.secreto, u, this.caso);
      // Las pistas de texto siempre aportan; las que filtran, solo si descartan algo.
      return !filtro || quedan.some((el) => !filtro(el));
    };
    return barajar(`${this.caso.numero}-${this.intentos.length}`)
      .filter(util)
      .slice(0, OPCIONES_POR_TURNO)
      .map((tipo) => ({ tipo, ...TIPOS_PISTA[tipo], pregunta: TIPOS_PISTA[tipo].pregunta(u) }));
  }

  /** Devuelve 'ok' | 'repetido' | 'fase'. */
  acusar(z) {
    if (this.fase !== 'acusar') return 'fase';
    if (this.intentos.includes(z)) return 'repetido';
    this.intentos.push(z);
    return 'ok';
  }

  elegirPista(tipo) {
    if (this.fase !== 'elegir') return false;
    if (!this.opciones().some((o) => o.tipo === tipo)) return false;
    this.pistas.push({ tipo, desde: this.ultimo.z });
    return true;
  }

  /** Texto para compartir, sin desvelar la solución. */
  textoCompartir(url) {
    const marcador = this.ganada ? `${this.intentos.length}/${MAX_INTENTOS}` : `X/${MAX_INTENTOS}`;
    const lineas = this.intentos.map((z, i) => {
      if (z === this.secreto.z) return '✅';
      const pista = this.pistas[i];
      return pista?.tipo ? `❌ ${TIPOS_PISTA[pista.tipo].icono}` : '❌';
    });
    return [`🔎 Holmio · Caso nº ${this.caso.numero} · ${marcador}`, ...lineas, url].join('\n');
  }
}

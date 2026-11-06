// La imagen para compartir: el dossier del caso, dibujado en un lienzo en el propio móvil.
// Nunca muestra al culpable, solo las fichas con la pista elegida tras cada fallo.
// Va siempre en los colores de día: es un objeto, no cambia con el tema de quien juega.

const LADO = 1080;
const C = {
  papel: '#efe6d2', hoja: '#f8f2e4', tinta: '#1a1d27', suave: '#6b6455', linea: '#d6c9ac',
  acento: '#a66d0c', lacre: '#b9412f', verde: '#5b9a73', crema: '#fff8ea',
  carpeta: '#dcc392', carpetaBorde: '#c2a56e', postit: '#f5e27a', boli: '#22346e',
};
const MAQUINA = '"Special Elite", "Courier New", monospace';
const MANO = '"Caveat", cursive';
const SANS = '"IBM Plex Sans", sans-serif';
const CLIP = 'M13 9v22a5 5 0 0 1-10 0V7a4 4 0 0 1 8 0v20a2 2 0 0 1-4 0V11';
const ACIERTO = 'M5 12.5l4.5 4.5L19 7.5';
const FALLO = 'M6.5 6.5l11 11M17.5 6.5l-11 11';
// Cada ficha muestra un trozo distinto de la textura de desgaste
const DESGASTE = [[-82, -46], [-194, -142], [-24, -226], [-120, -278], [-260, -90], [-50, -160]];

const cargar = (src) => new Promise((ok, mal) => {
  const im = new Image();
  im.onload = () => ok(im);
  im.onerror = mal;
  im.src = src;
});
const svgComoImagen = (svg) => cargar(`data:image/svg+xml,${encodeURIComponent(svg)}`);

/** Un icono del sprite como imagen (con los símbolos de los que dependa). */
function iconoDelSprite(id, color) {
  const simbolos = new Map();
  const reunir = (sid) => {
    const el = document.getElementById(sid);
    if (!el || simbolos.has(sid)) return;
    simbolos.set(sid, el.outerHTML);
    el.querySelectorAll('use').forEach((u) => reunir(u.getAttribute('href').slice(1)));
  };
  reunir(id);
  return svgComoImagen(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="${color}" color="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><defs>${[...simbolos.values()].join('')}</defs><use href="#${id}" width="24" height="24"/></svg>`,
  );
}

/** El logo necesita tamaño propio: algunos navegadores no dibujan un SVG sin él. */
async function cargarLogo() {
  const svg = await (await fetch('img/logo-largo.svg')).text();
  return svgComoImagen(svg.replace('<svg ', '<svg width="871" height="226" '));
}

function redondeado(ctx, x, y, w, h, r) {
  const [a, b, c, d] = Array.isArray(r) ? r : [r, r, r, r];
  ctx.beginPath();
  ctx.moveTo(x + a, y);
  ctx.arcTo(x + w, y, x + w, y + h, b);
  ctx.arcTo(x + w, y + h, x, y + h, c);
  ctx.arcTo(x, y + h, x, y, d);
  ctx.arcTo(x, y, x + w, y, a);
  ctx.closePath();
}

/** Rellena el trazado actual con un color y el grano de papel encima. */
function rellenarPapel(ctx, color, grano) {
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = grano;
  ctx.fill();
}

function conSombra(ctx, color, y, desenfoque, dibujar) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowOffsetY = y;
  ctx.shadowBlur = desenfoque;
  dibujar();
  ctx.restore();
}

function girado(ctx, cx, cy, grados, dibujar) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((grados * Math.PI) / 180);
  dibujar();
  ctx.restore();
}

/** Escribe en una línea, reduciendo la letra solo si no cabe. */
function escribirLinea(ctx, texto, x, y, maximo, tamano, familia, peso = 400) {
  let t = tamano;
  do {
    ctx.font = `${peso} ${t}px ${familia}`;
    t -= 1;
  } while (ctx.measureText(texto).width > maximo && t > 20);
  ctx.fillText(texto, x, y);
}

function dibujarTrazo(ctx, d, x, y, escala, color, grosor) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(escala, escala);
  ctx.strokeStyle = color;
  ctx.lineWidth = grosor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(new Path2D(d));
  ctx.restore();
}

function dibujarFicha(ctx, x, y, t, relleno, desgaste, i) {
  const [dx, dy] = DESGASTE[i % DESGASTE.length];
  ctx.save();
  redondeado(ctx, x, y, t, t, 18);
  ctx.clip();
  ctx.fillStyle = relleno;
  ctx.fillRect(x, y, t, t);
  ctx.translate(x + dx, y + dy);
  ctx.fillStyle = desgaste;
  ctx.fillRect(-dx, -dy, t, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // El centro queda limpio: la pieza se gasta por los bordes, como en la app
  const limpio = ctx.createRadialGradient(x + t / 2, y + t / 2, 0, x + t / 2, y + t / 2, t / 2);
  limpio.addColorStop(0.62, relleno);
  limpio.addColorStop(1, `${relleno}00`);
  ctx.fillStyle = limpio;
  ctx.fillRect(x, y, t, t);
  ctx.restore();
}

/**
 * @param numero  número de caso
 * @param fecha   fecha ya escrita, como en el post-it
 * @param ganada  si se resolvió
 * @param fichas  [{ acierto, icono }], una por acusación
 * @param url     dirección del juego, sin https://
 * @returns       File PNG, listo para compartir
 */
export async function crearImagen({ numero, fecha, ganada, fichas, url }) {
  await Promise.all([
    document.fonts.load(`400 40px ${MAQUINA}`),
    document.fonts.load(`600 50px ${MANO}`),
    document.fonts.load(`500 30px ${SANS}`),
  ]);
  const [logo, granoImg, desgasteImg, iconos] = await Promise.all([
    cargarLogo(),
    cargar('img/grano-dia.png'),
    cargar('img/desgaste-dia.png'),
    Promise.all(fichas.map((f) => (f.icono ? iconoDelSprite(f.icono, C.crema) : null))),
  ]);

  const lienzo = document.createElement('canvas');
  lienzo.width = lienzo.height = LADO;
  const ctx = lienzo.getContext('2d');
  const grano = ctx.createPattern(granoImg, 'repeat');
  const desgaste = ctx.createPattern(desgasteImg, 'repeat');

  // Fondo y logo
  ctx.fillStyle = C.papel;
  ctx.fillRect(0, 0, LADO, LADO);
  ctx.fillStyle = grano;
  ctx.fillRect(0, 0, LADO, LADO);
  ctx.drawImage(logo, (LADO - 293) / 2, 34, 293, 76);

  // La nota del detective, a boli, justo encima del dossier
  const nota = ganada ? 'Seguí las pistas hasta dar con el culpable.' : 'Seguí las pistas, pero el culpable se me escapó.';
  ctx.textAlign = 'center';
  ctx.fillStyle = C.boli;
  escribirLinea(ctx, nota, LADO / 2, 176, LADO - 112, 56, MANO, 600);
  ctx.textAlign = 'left';

  // Carpeta con su pestaña
  const X = 56;
  const ANCHO = LADO - 2 * X;
  const PESTANA_Y = 206;
  const CARPETA_Y = 264;
  const CARPETA_ALTO = 502;
  ctx.font = `400 44px ${MAQUINA}`;
  const pestanaAncho = ctx.measureText(`Caso nº ${numero}`).width + 88;
  conSombra(ctx, 'rgba(0, 0, 0, .3)', 8, 18, () => {
    redondeado(ctx, X, CARPETA_Y, ANCHO, CARPETA_ALTO, [0, 26, 26, 26]);
    ctx.fillStyle = C.carpeta;
    ctx.fill();
  });
  redondeado(ctx, X, CARPETA_Y, ANCHO, CARPETA_ALTO, [0, 26, 26, 26]);
  rellenarPapel(ctx, C.carpeta, grano);
  ctx.strokeStyle = C.carpetaBorde;
  ctx.lineWidth = 2;
  ctx.stroke();
  redondeado(ctx, X, PESTANA_Y, pestanaAncho, CARPETA_Y - PESTANA_Y + 3, [20, 20, 0, 0]);
  rellenarPapel(ctx, C.carpeta, grano);
  ctx.beginPath();
  ctx.moveTo(X, CARPETA_Y + 2);
  ctx.lineTo(X, PESTANA_Y + 20);
  ctx.arcTo(X, PESTANA_Y, X + 20, PESTANA_Y, 20);
  ctx.lineTo(X + pestanaAncho - 20, PESTANA_Y);
  ctx.arcTo(X + pestanaAncho, PESTANA_Y, X + pestanaAncho, PESTANA_Y + 20, 20);
  ctx.lineTo(X + pestanaAncho, CARPETA_Y);
  ctx.stroke();
  ctx.fillStyle = C.tinta;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`Caso nº ${numero}`, X + 44, PESTANA_Y + 44);

  // Hojas: una algo torcida debajo y el informe encima
  const HX = X + 24;
  const HY = CARPETA_Y + 24;
  const HW = ANCHO - 48;
  const HH = CARPETA_ALTO - 50;
  girado(ctx, HX + HW / 2, HY + HH / 2, 0.7, () => {
    conSombra(ctx, 'rgba(0, 0, 0, .3)', 2, 5, () => {
      ctx.fillStyle = C.hoja;
      ctx.fillRect(-HW / 2 + 6, -HH / 2 + 8, HW - 6, HH - 2);
    });
  });
  conSombra(ctx, 'rgba(0, 0, 0, .3)', 2, 5, () => {
    ctx.fillStyle = C.hoja;
    ctx.fillRect(HX, HY, HW, HH);
  });

  const TX = HX + 36;
  const TW = HW - 72;
  ctx.fillStyle = C.acento;
  ctx.font = `400 33px ${MAQUINA}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
  ctx.fillText('INFORME DEL CASO', TX, HY + 56);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  ctx.fillStyle = C.linea;
  ctx.fillRect(TX, HY + 74, TW, 2);

  const n = fichas.length;
  const frase = ganada ? `Culpable identificado en ${n} de 6.` : 'El culpable se ha fugado.';
  ctx.fillStyle = C.tinta;
  escribirLinea(ctx, frase, TX, HY + 136, TW, 44, MAQUINA);

  // Fichas: las usadas y las que sobraron
  const T = 124;
  const HUECO = (TW - 6 * T) / 5;
  const FY = HY + 168;
  for (let i = 0; i < 6; i++) {
    const x = TX + i * (T + HUECO);
    const f = fichas[i];
    if (!f) {
      redondeado(ctx, x + 2, FY + 2, T - 4, T - 4, 18);
      ctx.save();
      ctx.setLineDash([12, 9]);
      ctx.strokeStyle = C.linea;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      continue;
    }
    dibujarFicha(ctx, x, FY, T, f.acierto ? C.verde : C.lacre, desgaste, i);
    if (iconos[i]) ctx.drawImage(iconos[i], x + 26, FY + 26, 72, 72);
    else dibujarTrazo(ctx, f.acierto ? ACIERTO : FALLO, x + 26, FY + 26, 3, C.crema, 2.4 / 1);
  }

  // Sello estampado
  const sello = ganada ? 'CASO CERRADO' : 'SE HA FUGADO';
  const color = ganada ? C.verde : C.lacre;
  girado(ctx, TX + TW - 208, HY + 372, -7, () => {
    ctx.font = `400 48px ${MAQUINA}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = '6px';
    const ancho = ctx.measureText(sello).width + 54;
    redondeado(ctx, -ancho / 2, -42, ancho, 84, 12);
    ctx.strokeStyle = color;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sello, 0, 4);
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
  });
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  // Post-it con la fecha y el clip que lo sujeta
  ctx.font = `600 52px ${MANO}`;
  const postitAncho = ctx.measureText(fecha).width + 92;
  const postitX = X + ANCHO - postitAncho - 18;
  girado(ctx, postitX + postitAncho / 2, PESTANA_Y + 36, -2.2, () => {
    conSombra(ctx, 'rgba(0, 0, 0, .45)', 6, 10, () => {
      ctx.fillStyle = C.postit;
      ctx.fillRect(-postitAncho / 2, -33, postitAncho, 66);
    });
    ctx.fillStyle = C.boli;
    ctx.textBaseline = 'middle';
    ctx.fillText(fecha, -postitAncho / 2 + 22, 2);
    ctx.textBaseline = 'alphabetic';
  });
  dibujarTrazo(ctx, CLIP, postitX + postitAncho - 52, PESTANA_Y - 4, 2.2, C.suave, 1.5);

  // Enganche y dirección
  ctx.textAlign = 'center';
  ctx.fillStyle = C.tinta;
  ctx.font = `400 42px ${MAQUINA}`;
  ctx.fillText('118 sospechosos. Un solo culpable.', LADO / 2, 838);
  ctx.fillStyle = C.lacre;
  ctx.fillText('¿Aceptas el caso?', LADO / 2, 896);
  ctx.fillStyle = C.suave;
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(url, LADO / 2, 996);

  const blob = await new Promise((ok) => lienzo.toBlob(ok, 'image/png'));
  return new File([blob], `holmio-caso-${numero}.png`, { type: 'image/png' });
}

"""Genera los logos de Holmio a partir del sello (img/sello.png).

Uso:
    python herramientas/logo.py

Produce:
    img/logo-largo.svg  «HOLMIO» con la primera O convertida en lupa
    img/logo-corto.svg  monograma «Ho» con la lupa algo separada de la H
    img/favicon.svg     logo corto sobre cuadrado color tinta
    herramientas/logo-simbolos.html  <symbol> listos para pegar en index.html

Cómo:
- Las letras H, L, M, I salen del arco «HOLMIO» del sello: se aíslan por ángulo,
  se giran hasta quedar derechas y se limpian (sin poros), igual que el monograma.
- La lupa sale del monograma central (relleno por inundación desde el mango).
- Todo se compone en una imagen de dos capas (letras y lupa) y cada capa se
  traza por separado con potrace, para poder pintarlas de colores distintos.
"""

import math

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from vectorizar import trazar  # misma carpeta

ORIGEN = "img/sello.png"
UMBRAL = 70

# Letras del arco superior (ángulos en grados, medidos desde el centro; -90 = arriba)
ARCO = {"H": (-146, -128), "L": (-107, -92), "M": (-89, -70), "I": (-68, -57)}
BANDA = (402, 548)  # radios entre los que está el texto del arco
SEMILLA_LUPA = (700, 860)  # un píxel del mango de la lupa central
CENTRO_LENTE = (789, 626)  # centro de la lente de la lupa central (px del sello)
RADIO_LENTE = 142  # radio exterior del aro
ALTURA_BAJO_H = 800  # por debajo de esta y solo hay mango
ANCHO_MANGO = 30  # medio grosor del mango (con holgura)
RADIO_CENTRO = 338  # dentro de este radio solo está el monograma


def mascara(img):
    a = np.asarray(img.convert("RGB")).astype(int)
    return np.clip(a[..., 0] - a[..., 2], 0, 255) > UMBRAL


def limpiar(m):
    """Rellena poros y quita motas (devuelve imagen L 0/255)."""
    im = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    im = im.point(lambda v: 255 if v > 110 else 0)
    im = im.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
    im = im.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    return np.asarray(im) > 127


def recortar(m):
    ys, xs = np.nonzero(m)
    return m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def pieza_principal(m):
    """Se queda con la pieza conectada que cruza la fila central (quita motas sueltas)."""
    fila = m.shape[0] // 2
    xs = np.nonzero(m[fila])[0]
    if not len(xs):
        return m
    # .copy(): una imagen creada con fromarray puede ser de solo lectura y floodfill no la cambiaría
    im = Image.fromarray((m * 255).astype(np.uint8)).copy()
    ImageDraw.floodfill(im, (int(xs[0]), fila), 128)
    return recortar(np.asarray(im) == 128)


def letra_del_arco(tinta, cx, cy, a0, a1):
    h, w = tinta.shape
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.hypot(xx - cx, yy - cy)
    ang = np.degrees(np.arctan2(yy - cy, xx - cx))
    sel = tinta & (r > BANDA[0]) & (r < BANDA[1]) & (ang > a0 - 1.5) & (ang < a1 + 1.5)
    im = Image.fromarray((sel * 255).astype(np.uint8))
    # Girar alrededor del centro del sello hasta que la letra quede arriba y derecha
    centro = (a0 + a1) / 2
    im = im.rotate(centro + 90, resample=Image.BICUBIC, center=(cx, cy))
    return pieza_principal(limpiar(recortar(np.asarray(im) > 127)))


def h_y_lupa_centrales(tinta, cx, cy):
    """Separa la H y la lupa del monograma central, en el mismo marco (misma posición).

    Al limpiar los poros, la H y el aro de la lupa llegan a tocarse, así que se separan
    por geometría: la lupa es todo lo que está cerca del centro de la lente o del mango.
    """
    h, w = tinta.shape
    yy, xx = np.mgrid[0:h, 0:w]
    dentro = limpiar(tinta & (np.hypot(xx - cx, yy - cy) < RADIO_CENTRO))
    lx, ly = CENTRO_LENTE
    d_lente = np.hypot(xx - lx, yy - ly)
    # Extremo del mango: lo más bajo del monograma (por debajo de la H solo está el mango)
    ys, xs = np.nonzero(dentro & (yy > ALTURA_BAJO_H))
    ex, ey = xs.mean(), ys.max()
    # Distancia de cada píxel al segmento centro de la lente → extremo del mango
    vx, vy = ex - lx, ey - ly
    largo2 = vx * vx + vy * vy
    t = np.clip(((xx - lx) * vx + (yy - ly) * vy) / largo2, 0, 1)
    d_mango = np.hypot(xx - (lx + t * vx), yy - (ly + t * vy))
    lupa = dentro & ((d_lente < RADIO_LENTE + 8) | ((d_mango < ANCHO_MANGO) & (d_lente > RADIO_LENTE - 10)))
    lupa |= dentro & (yy > ALTURA_BAJO_H)  # por debajo de la H todo es mango
    return dentro & ~lupa, lupa


def escalar(m, alto):
    im = Image.fromarray((m * 255).astype(np.uint8))
    ancho = round(m.shape[1] * alto / m.shape[0])
    return np.asarray(im.resize((ancho, alto), Image.LANCZOS)) > 127


def svg(w, h, capas):
    paths = "".join(f'<path {attrs} fill-rule="evenodd" d="{d}"/>' for d, attrs in capas)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">{paths}</svg>\n'


def componer_largo(letras, lupa):
    """HOLMIO: H, lupa (como O), L, M, I y otra lupa no: la última O es una O del arco."""
    alto = max(m.shape[0] for m in letras.values())
    letras = {k: escalar(m, alto) for k, m in letras.items()}
    # La lente de la lupa del tamaño de una O (un 5 % mayor, como el rebase óptico)
    ys, xs = np.nonzero(lupa)
    ancho_lente = xs.max() - xs.min()
    factor = alto * 1.05 / ancho_lente
    lupa = escalar(lupa, round(lupa.shape[0] * factor))
    hueco = round(alto * 0.16)
    piezas = [("letras", letras["H"], 0), ("lupa", lupa, -round(alto * 0.025)),
              ("letras", letras["L"], 0), ("letras", letras["M"], 0),
              ("letras", letras["I"], 0), ("letras", letras["O"], 0)]
    ancho = sum(p[1].shape[1] for p in piezas) + hueco * (len(piezas) - 1)
    margen = round(alto * 0.06)
    total_alto = max(alto, lupa.shape[0] - round(alto * 0.025)) + 2 * margen
    capa = {"letras": np.zeros((total_alto, ancho + 2 * margen), bool),
            "lupa": np.zeros((total_alto, ancho + 2 * margen), bool)}
    x = margen
    for tipo, m, dy in piezas:
        y = margen + dy
        capa[tipo][y:y + m.shape[0], x:x + m.shape[1]] |= m
        x += m.shape[1] + hueco
    return capa


def main():
    img = Image.open(ORIGEN)
    tinta = mascara(img)
    h, w = tinta.shape
    cx, cy = w / 2, h / 2

    letras = {k: letra_del_arco(tinta, cx, cy, *ang) for k, ang in ARCO.items()}
    letras["O"] = letra_del_arco(tinta, cx, cy, -52, -38)
    h_central, lupa_marco = h_y_lupa_centrales(tinta, cx, cy)
    lupa = recortar(lupa_marco)

    # --- Logo largo ---
    capa = componer_largo(letras, lupa)
    alto, ancho = capa["letras"].shape
    d_letras, _ = trazar(Image.fromarray((capa["letras"] * 255).astype(np.uint8)), 6)
    d_lupa, _ = trazar(Image.fromarray((capa["lupa"] * 255).astype(np.uint8)), 6)
    largo = [(d_letras, 'fill="#1a1d27"'), (d_lupa, 'fill="#b9412f"')]
    open("img/logo-largo.svg", "w", encoding="utf-8").write(svg(ancho, alto, largo))

    # --- Logo corto: H central + lupa en su posición original, separadas un poco ---
    ys, xs = np.nonzero(h_central | lupa_marco)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    hh, lm = h_central[y0:y1, x0:x1], lupa_marco[y0:y1, x0:x1]
    sep = round((y1 - y0) * 0.06)  # desplazamiento de la lupa hacia la derecha
    margen = round((y1 - y0) * 0.06)
    hc, wc = (y1 - y0) + 2 * margen, (x1 - x0) + sep + 2 * margen
    ch = np.zeros((hc, wc), bool)
    cl = np.zeros_like(ch)
    ch[margen:margen + hh.shape[0], margen:margen + hh.shape[1]] = hh
    cl[margen:margen + lm.shape[0], margen + sep:margen + sep + lm.shape[1]] = lm
    d_h, _ = trazar(Image.fromarray((ch * 255).astype(np.uint8)), 6)
    d_l, _ = trazar(Image.fromarray((cl * 255).astype(np.uint8)), 6)
    corto = [(d_h, 'fill="#1a1d27"'), (d_l, 'fill="#b9412f"')]
    open("img/logo-corto.svg", "w", encoding="utf-8").write(svg(wc, hc, corto))

    # --- Favicon: logo corto en colores de noche sobre cuadrado tinta ---
    lado = max(wc, hc)
    esc = 76 / lado
    off_x, off_y = (100 - wc * esc) / 2, (100 - hc * esc) / 2
    fav = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
        '<rect width="100" height="100" rx="22" fill="#141821"/>'
        f'<g transform="translate({off_x:.2f} {off_y:.2f}) scale({esc:.5f})">'
        f'<path fill="#ece3cf" fill-rule="evenodd" d="{d_h}"/>'
        f'<path fill="#e0664f" fill-rule="evenodd" d="{d_l}"/></g></svg>\n'
    )
    open("img/favicon.svg", "w", encoding="utf-8").write(fav)

    # --- Símbolos para index.html (colores por CSS: H con el texto, lupa en lacre) ---
    simbolos = (
        f'<symbol id="logo-largo" viewBox="0 0 {ancho} {alto}">'
        f'<path fill="currentColor" fill-rule="evenodd" d="{d_letras}"/>'
        f'<path style="fill: var(--lacre)" fill-rule="evenodd" d="{d_lupa}"/></symbol>\n'
        f'<symbol id="logo-corto" viewBox="0 0 {wc} {hc}">'
        f'<path fill="currentColor" fill-rule="evenodd" d="{d_h}"/>'
        f'<path style="fill: var(--lacre)" fill-rule="evenodd" d="{d_l}"/></symbol>\n'
    )
    open("herramientas/logo-simbolos.html", "w", encoding="utf-8").write(simbolos)
    print(f"logo largo {ancho}×{alto}, logo corto {wc}×{hc}")


if __name__ == "__main__":
    main()

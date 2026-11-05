"""Vectoriza una imagen de tampón (tinta sobre papel) a un SVG de un solo color.

Uso:
    python herramientas/vectorizar.py ENTRADA.png SALIDA.svg [--limpio] [--escala 0.5]
        [--motas 4] [--umbral 70]

- La tinta se separa del papel por el canal «rojo menos azul» (la tinta es rojiza,
  el papel crema casi neutro), así que funciona con cualquier color de papel claro.
- --limpio rellena los poros de la textura y quita las motas sueltas: menos nodos,
  archivo mucho más ligero, aspecto de sello «nuevo».
- --escala reduce la imagen antes de trazar (menos detalle, menos peso).
- --motas descarta manchas de menos de N píxeles (parámetro turdsize de potrace).
- El SVG usa fill="currentColor": toma el color del texto donde se coloque, así que
  se puede teñir por CSS según el tema.

Requiere: pillow, numpy, potracer  (pip install --user potracer)
"""

import argparse

import numpy as np
import potrace
from PIL import Image, ImageFilter


def mascara_de_tinta(img, umbral, limpio):
    """Devuelve una imagen L (255 = tinta) a partir de la diferencia rojo − azul."""
    a = np.asarray(img.convert("RGB")).astype(int)
    diferencia = np.clip(a[..., 0] - a[..., 2], 0, 255).astype(np.uint8)
    m = Image.fromarray(diferencia)
    if limpio:
        # Cierre (rellena poros) y apertura (quita motas), con un suavizado previo
        m = m.filter(ImageFilter.GaussianBlur(1.2))
        m = m.point(lambda v: 255 if v > umbral else 0)
        m = m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.MinFilter(5))
        m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    else:
        m = m.point(lambda v: 255 if v > umbral else 0)
    return m


def numero(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def xy(p):
    """potracer devuelve puntos con .x y .y."""
    return p.x, p.y


def trazar(mascara, motas):
    # potracer traza los píxeles a False: la tinta va en False y el papel en True
    bm = potrace.Bitmap(np.asarray(mascara) <= 127)
    caminos = bm.trace(turdsize=motas, alphamax=1.0, opticurve=True, opttolerance=0.4)
    partes = []
    for curva in caminos:
        x, y = xy(curva.start_point)
        d = [f"M{numero(x)} {numero(y)}"]
        for seg in curva:
            if seg.is_corner:
                cx, cy = xy(seg.c)
                ex, ey = xy(seg.end_point)
                d.append(f"L{numero(cx)} {numero(cy)} {numero(ex)} {numero(ey)}")
            else:
                (x1, y1), (x2, y2), (ex, ey) = xy(seg.c1), xy(seg.c2), xy(seg.end_point)
                d.append(f"C{numero(x1)} {numero(y1)} {numero(x2)} {numero(y2)} {numero(ex)} {numero(ey)}")
        d.append("Z")
        partes.append("".join(d))
    return "".join(partes), len(caminos)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("salida")
    p.add_argument("--limpio", action="store_true")
    p.add_argument("--escala", type=float, default=1.0)
    p.add_argument("--motas", type=int, default=4)
    p.add_argument("--umbral", type=int, default=70)
    args = p.parse_args()

    img = Image.open(args.entrada)
    if args.escala != 1.0:
        img = img.resize((round(img.width * args.escala), round(img.height * args.escala)), Image.LANCZOS)
    mascara = mascara_de_tinta(img, args.umbral, args.limpio)
    d, n = trazar(mascara, args.motas)
    w, h = mascara.size
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">'
        f'<path fill="currentColor" fill-rule="evenodd" d="{d}"/></svg>\n'
    )
    with open(args.salida, "w", encoding="utf-8") as f:
        f.write(svg)
    print(f"{args.salida}: {w}×{h}, {n} trazados, {len(svg) / 1024:.0f} KB")


if __name__ == "__main__":
    main()

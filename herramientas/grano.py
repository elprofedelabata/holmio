"""Genera el grano de papel del fondo (img/grano-dia.png e img/grano-noche.png).

Uso:
    python herramientas/grano.py

Son losetas que se repiten sin costuras: el ruido se filtra en el dominio de la
frecuencia (FFT), que por naturaleza es periódico. Cada PNG es un solo color con
transparencia variable, así que se superpone a cualquier color de fondo. La
transparencia se cuantiza a unos pocos niveles para que el archivo pese poco.

Para ajustar la intensidad, cambia «fuerza» en LOSETAS.
"""

import numpy as np
from PIL import Image

LADO = 320  # px de la loseta (el CSS la muestra a la mitad: nítida en móviles)
NIVELES = 4  # niveles de transparencia
SEMILLA = 67  # número atómico del holmio

# color del grano y opacidad máxima (0–255)
LOSETAS = {
    "img/grano-dia.png": {"color": (92, 70, 40), "fuerza": 13},
    "img/grano-noche.png": {"color": (236, 227, 207), "fuerza": 7},
}


def ruido_filtrado(rng, escala_x, escala_y):
    """Ruido periódico con grano del tamaño indicado (en píxeles), normalizado."""
    blanco = rng.standard_normal((LADO, LADO))
    fy = np.fft.fftfreq(LADO)[:, None]
    fx = np.fft.fftfreq(LADO)[None, :]
    filtro = np.exp(-2 * (np.pi ** 2) * ((fx * escala_x) ** 2 + (fy * escala_y) ** 2))
    n = np.real(np.fft.ifft2(np.fft.fft2(blanco) * filtro))
    return (n - n.mean()) / n.std()


def mapa_de_grano():
    rng = np.random.default_rng(SEMILLA)
    fino = ruido_filtrado(rng, 0.8, 0.8)  # poro del papel
    fibra_h = ruido_filtrado(rng, 7, 0.8)  # fibras alargadas, en dos direcciones
    fibra_v = ruido_filtrado(rng, 0.8, 7)
    n = fino + 0.45 * fibra_h + 0.45 * fibra_v
    n /= n.std()
    # Solo la parte positiva: motas sobre el papel, sin oscurecer todo por igual
    return np.clip(n / 2.6, 0, 1)


def guardar(ruta, mapa, color, fuerza):
    indices = np.minimum((mapa * NIVELES).astype(np.uint8), NIVELES - 1)
    im = Image.fromarray(indices, mode="P")
    im.putpalette(list(color) * NIVELES)
    alfas = bytes(round(fuerza * i / (NIVELES - 1)) for i in range(NIVELES))
    im.save(ruta, transparency=alfas, optimize=True)


def main():
    mapa = mapa_de_grano()
    for ruta, ajustes in LOSETAS.items():
        guardar(ruta, mapa, ajustes["color"], ajustes["fuerza"])
        print(ruta)


if __name__ == "__main__":
    main()

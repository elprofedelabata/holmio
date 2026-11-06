"""Genera las texturas de Holmio: el grano de papel y el desgaste de la tinta.

- img/grano-dia.png, img/grano-noche.png: grano sutil para el fondo general.
- img/desgaste-dia.png, img/desgaste-noche.png: saltaduras y rozaduras agresivas
  para los elementos con relleno sólido, como tinta gastada.

Uso:
    python herramientas/grano.py

Son losetas que se repiten sin costuras: el ruido se filtra en el dominio de la
frecuencia (FFT), que por naturaleza es periódico. Cada PNG es un solo color con
transparencia variable, así que se superpone a cualquier color de fondo. La
transparencia se cuantiza a unos pocos niveles para que el archivo pese poco.

En el desgaste el color de la loseta es el del fondo de la página: al pintarla
sobre un relleno parece que la tinta se ha ido y asoma el papel.

Para ajustar la intensidad, cambia «fuerza» en LOSETAS o COBERTURA.
"""

import numpy as np
from PIL import Image, ImageDraw

LADO = 320  # px de la loseta (el CSS la muestra a la mitad: nítida en móviles)
NIVELES = 4  # niveles de transparencia
SEMILLA = 67  # número atómico del holmio

# color del grano y opacidad máxima (0–255)
LOSETAS = {
    "img/grano-dia.png": {"color": (92, 70, 40), "fuerza": 22},
    "img/grano-noche.png": {"color": (236, 227, 207), "fuerza": 7},
}

# color del papel que asoma; COBERTURA es la parte de la superficie gastada (0–1)
DESGASTE = {
    "img/desgaste-dia.png": {"color": (239, 230, 210)},
    "img/desgaste-noche.png": {"color": (20, 24, 33)},
}
COBERTURA = 0.13
ALFAS_DESGASTE = (0, 120, 235)
RAYAS = 14  # rozaduras largas y finas


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


def rayas(rng):
    """Rozaduras finas. Se dibujan también desplazadas para que crucen el borde sin costura."""
    im = Image.new("L", (LADO, LADO), 0)
    d = ImageDraw.Draw(im)
    for _ in range(RAYAS):
        x, y = rng.uniform(0, LADO, 2)
        angulo = rng.normal(-0.6, 0.35)
        largo = rng.uniform(30, 110)
        dx, dy = largo * np.cos(angulo), largo * np.sin(angulo)
        for ox in (-LADO, 0, LADO):
            for oy in (-LADO, 0, LADO):
                d.line((x + ox, y + oy, x + dx + ox, y + dy + oy), fill=255, width=1)
    return np.asarray(im) > 0


def mapa_de_desgaste():
    """Niveles 0, 1 y 2: sin desgaste, tinta rozada y tinta saltada."""
    rng = np.random.default_rng(SEMILLA + 1)
    zonas = ruido_filtrado(rng, 15, 15)  # dónde se gasta más: rodales, no por igual
    saltaduras = ruido_filtrado(rng, 1.3, 1.3)
    n = saltaduras + 1.1 * zonas
    corte = np.quantile(n, 1 - COBERTURA)
    borde = np.quantile(n, 1 - COBERTURA * 1.7)
    niveles = (n > borde).astype(np.uint8) + (n > corte).astype(np.uint8)
    # Las rozaduras se rompen con ruido para que no parezcan líneas de regla
    roza = rayas(rng) & (ruido_filtrado(rng, 2, 2) > -0.2)
    return np.maximum(niveles, roza.astype(np.uint8))


def guardar_desgaste(ruta, niveles, color):
    im = Image.fromarray(niveles, mode="P")
    im.putpalette(list(color) * len(ALFAS_DESGASTE))
    im.save(ruta, transparency=bytes(ALFAS_DESGASTE), optimize=True)


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
    niveles = mapa_de_desgaste()
    for ruta, ajustes in DESGASTE.items():
        guardar_desgaste(ruta, niveles, ajustes["color"])
        print(ruta)


if __name__ == "__main__":
    main()

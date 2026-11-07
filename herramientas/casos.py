"""Codifica los casos del calendario y sus órdenes (genera js/casos-datos.js).

Uso:
    python herramientas/casos.py

Lee contenido/casos.json, que tiene los casos en claro y en orden de calendario y no se
sube al repositorio. La codificación solo evita destripes por accidente al curiosear el
código: no es seguridad. js/casos.js hace la operación inversa al jugar.

El primer ciclo sigue el orden de casos.json. Los siguientes usan órdenes barajados aquí,
siempre iguales gracias a la semilla, para que nadie pueda predecir al culpable por lo
que salió hace 118 días. No cambies SEMILLA ni VUELTAS tras el lanzamiento: cambiarían
los casos ya previstos, y con ellos el archivo de los jugadores.
"""

import base64
import json
import random
import re

ORIGEN = "contenido/casos.json"
ELEMENTOS = "js/elementos.js"
DESTINO = "js/casos-datos.js"
SEMILLA = 67  # número atómico del holmio
VUELTAS = 9  # ciclos con orden propio tras el primero: unos tres años en total
MIN_REPETICION = 30  # días mínimos antes de que un culpable vuelva a salir
MIN_DESPLAZAMIENTO = 15  # un caso nunca sale cerca de su posición del ciclo anterior
SEMANA = 7


def codificar(caso, indice):
    datos = json.dumps(caso, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    x = (SEMILLA * (indice + 1)) & 0xFFFFFFFF
    salida = bytearray()
    for byte in datos:
        x = (x * 1664525 + 1013904223) & 0xFFFFFFFF
        salida.append(byte ^ (x >> 24))
    return base64.b64encode(bytes(salida)).decode("ascii")


def tipos_por_z():
    with open(ELEMENTOS, encoding="utf-8") as f:
        crudo = re.search(r"const CRUDO = `\n(.*?)\n`", f.read(), re.S).group(1)
    return {z: linea.split("|")[3] for z, linea in enumerate(crudo.split("\n"), start=1)}


def sin_rachas(secuencia, posicion, tipo):
    """Sin dos del mismo tipo seguidos ni tres en una semana (salvo metales de transición)."""
    ver = lambda i: secuencia[i] if 0 <= i < len(secuencia) else None
    if tipo in (ver(posicion - 1), ver(posicion + 1)):
        return False
    if tipo == "tr":
        return True
    for inicio in range(posicion - SEMANA + 1, posicion + 1):
        semana = [ver(i) for i in range(inicio, inicio + SEMANA) if i != posicion]
        if semana.count(tipo) >= 2:
            return False
    return True


def respeta_distancia(indice, posicion, otro, total, otro_va_despues=False):
    """Distancia con la posición del mismo caso en el ciclo anterior o en el siguiente."""
    otra = indice if otro_va_despues else otro.index(indice)
    hueco = total - posicion + otra if otro_va_despues else total - otra + posicion
    return abs(posicion - otra) >= MIN_DESPLAZAMIENTO and hueco >= MIN_REPETICION


def enlace_limpio(fin, inicio, tipo):
    """El paso de un ciclo al siguiente tampoco crea rachas."""
    secuencia = [tipo(i) for i in fin[-(SEMANA - 1):] + inicio[:SEMANA - 1]]
    return all(sin_rachas(secuencia, n, t) for n, t in enumerate(secuencia))


def nuevo_orden(anterior, casos, tipos, rng, siguiente=None):
    """Baraja un ciclo teniendo en cuenta cómo acabó el anterior. None si se atasca.

    `siguiente` es el orden con el que debe enlazar por detrás, si ya está decidido.
    """
    total = len(casos)
    tipo = lambda indice: tipos[casos[indice]["z"]]
    cola = [tipo(i) for i in anterior[-(SEMANA - 1):]]
    secuencia = cola + [None] * total  # para vigilar también el paso entre ciclos
    orden = [None] * total

    def colocar(indice, posicion):
        if not respeta_distancia(indice, posicion, anterior, total):
            return False
        if siguiente and not respeta_distancia(siguiente[0][indice], posicion, siguiente[1], total, True):
            return False
        if not sin_rachas(secuencia, posicion + len(cola), tipo(indice)):
            return False
        orden[posicion] = indice
        secuencia[posicion + len(cola)] = tipo(indice)
        return True

    # Los superpesados, repartidos a lo largo del ciclo
    pesados = [i for i, c in enumerate(casos) if c["z"] > 103]
    rng.shuffle(pesados)
    paso = total / len(pesados)
    for n in range(len(pesados)):
        posicion = round(paso / 2 + n * paso)
        candidato = next((i for i in pesados if colocar(i, posicion)), None)
        if candidato is None:
            return None
        pesados.remove(candidato)

    resto = [i for i, c in enumerate(casos) if c["z"] <= 103]
    rng.shuffle(resto)
    for posicion in range(total):
        if orden[posicion] is not None:
            continue
        candidato = next((i for i in resto if colocar(i, posicion)), None)
        if candidato is None:
            return None
        resto.remove(candidato)
    return orden


def generar_ordenes(casos):
    rng = random.Random(SEMILLA)
    tipos = tipos_por_z()
    total = len(casos)
    ordenes = []
    anterior = list(range(total))
    tipo = lambda indice: tipos[casos[indice]["z"]]
    while len(ordenes) < VUELTAS:
        # El último enlaza de nuevo con el primero de estos órdenes
        ultimo = len(ordenes) == VUELTAS - 1
        siguiente = None
        if ultimo:
            siguiente = ({i: p for p, i in enumerate(ordenes[0])}, ordenes[0])
        orden = nuevo_orden(anterior, casos, tipos, rng, siguiente)
        if orden is None or (ultimo and not enlace_limpio(orden, ordenes[0], tipo)):
            continue
        ordenes.append(orden)
        anterior = orden
    return ordenes


def main():
    with open(ORIGEN, encoding="utf-8") as f:
        casos = json.load(f)
    ordenes = generar_ordenes(casos)
    lineas = ",\n".join(f"  '{codificar(c, i)}'" for i, c in enumerate(casos))
    filas = ",\n".join(f"  [{', '.join(map(str, o))}]" for o in ordenes)
    with open(DESTINO, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generado con herramientas/casos.py. No editar a mano.\n")
        f.write(f"export const CASOS_CODIFICADOS = [\n{lineas},\n];\n\n")
        f.write("// Orden de cada ciclo tras el primero: posiciones de la lista anterior.\n")
        f.write(f"export const ORDENES_SIGUIENTES = [\n{filas},\n];\n")
    print(f"{len(casos)} casos y {len(ordenes)} órdenes en {DESTINO}")


if __name__ == "__main__":
    main()

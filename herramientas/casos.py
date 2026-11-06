"""Codifica los casos del calendario (genera js/casos-datos.js).

Uso:
    python herramientas/casos.py

Lee contenido/casos.json, que tiene los casos en claro y en orden de calendario y no se
sube al repositorio. La codificación solo evita destripes por accidente al curiosear el
código: no es seguridad. js/casos.js hace la operación inversa al jugar.
"""

import base64
import json

ORIGEN = "contenido/casos.json"
DESTINO = "js/casos-datos.js"
SEMILLA = 67  # número atómico del holmio


def codificar(caso, indice):
    datos = json.dumps(caso, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    x = (SEMILLA * (indice + 1)) & 0xFFFFFFFF
    salida = bytearray()
    for byte in datos:
        x = (x * 1664525 + 1013904223) & 0xFFFFFFFF
        salida.append(byte ^ (x >> 24))
    return base64.b64encode(bytes(salida)).decode("ascii")


def main():
    with open(ORIGEN, encoding="utf-8") as f:
        casos = json.load(f)
    lineas = ",\n".join(f"  '{codificar(c, i)}'" for i, c in enumerate(casos))
    with open(DESTINO, "w", encoding="utf-8", newline="\n") as f:
        f.write("// Generado con herramientas/casos.py. No editar a mano.\n")
        f.write(f"export const CASOS_CODIFICADOS = [\n{lineas},\n];\n")
    print(f"{len(casos)} casos en {DESTINO}")


if __name__ == "__main__":
    main()

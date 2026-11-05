# Documento de diseño — Holmio

> Estado: borrador v0.2 · 2026-11-04
> Las secciones marcadas con 🟡 están **pendientes de decidir**.

---

## 1. Concepto

Juego de reto diario al estilo Wordle: cada día hay **un elemento químico secreto**, el mismo para todo el mundo. El jugador recibe una **pista principal** rebuscada (pensada para que acertar a la primera sea difícil pero posible) y tiene **6 intentos** para adivinarlo. Tras cada fallo **elige una pista adicional** entre tres opciones, y la tabla periódica se va **sombreando** automáticamente para mostrar qué elementos quedan descartados.

**Pilares:**
1. **La pista principal premia el conocimiento.** Quien sabe química o historia de la ciencia puede acertar a la primera.
2. **Las pistas adicionales premian la estrategia.** Qué pista pedir y desde qué intento pedirla importa.
3. **La tabla enseña.** Las pistas de posición, bloque, tipo, etc. refuerzan cómo está organizada la tabla periódica.

## 2. Público y plataforma

- **Público general**, en español.
- **Web**, publicada en **GitHub Pages**.
- **Pensada primero para móvil**; en escritorio funciona igual con más espacio.

## 3. Identidad: nombre, temática y estilo

### 3.1 Nombre: **Holmio**
- El holmio es un elemento real (**Ho**, número atómico **67**) y el nombre **suena a Holmes**: química + detective en una palabra corta y en español.
- Curiosidad para la pantalla «Acerca de»: debe su nombre a *Holmia*, el nombre latino de Estocolmo. Lo descubrieron Soret y Delafontaine en 1878, y Cleve lo identificó de forma independiente poco después.
- **Disponibilidad** (comprobado el 2026-11-04):
  - No se ha encontrado ningún juego ni app llamado «Holmio».
  - Existe una empresa llamada HOLMIO (energía, Lima, Perú). Es de otro sector; no debería ser un problema, pero probablemente ocupa `holmio.com`.
  - En GitHub, el usuario `holmio` ya existe (cuenta personal), así que `holmio.github.io` no está disponible. Opciones: `<usuario>.github.io/holmio` o un dominio propio.
  - La organización `holmio-juego` está libre en GitHub → `holmio-juego.github.io` sería posible.
  - 🟡 Comprobar en un registrador si `holmio.es` / `holmio.app` / `juegaholmio.com`… están libres, si se quiere dominio propio.
- **Variantes descartadas** (comprobado el 2026-11-04):
  - *Holmium*: nombre en inglés y muy usado (librerías, un desarrollador en itch.io, un malware); la organización de GitHub está ocupada.
  - *Holmia*: usuario de GitHub ocupado; hay una empresa británica con ese nombre.
  - *Holmica* / *Holmico*: libres, pero sin tilde se pronuncian *hol‑MI‑ca*, así que se pierde el eco de «química»; además, pierden la gracia de ser un elemento real.
  - **Decisión: Holmio.**

### 3.2 Temática: detective
Cada día hay un **caso** y un **elemento culpable**. La tabla periódica es el **tablero de sospechosos**.

| Concepto del juego | Nombre en Holmio |
|---|---|
| Reto del día | **Caso nº 12** |
| Pista principal | **Informe del caso** |
| Pistas a elegir | **Pistas** (líneas de investigación) |
| Intento | **Acusación** |
| Casillas descartadas | **Sospechosos con coartada** |
| Acertar | **«Caso cerrado»** |
| Fallar los 6 intentos | **«Se ha fugado: era el Wolframio»** |

- El tono es de humor ligero, sin pasarse: la temática viste los textos, pero las reglas se explican claras.
- Se evitan los clichés literales de Sherlock Holmes (gorra, pipa, silueta).

### 3.3 Logo
**Idea central:** el símbolo **Ho** con la **o minúscula dibujada como una lupa** (aro = lente, mango en diagonal ↘). En dos caracteres se leen el elemento, el detective y el nombre.

| Versión | Uso | Composición |
|---|---|---|
| **Icono** | App, pantalla de inicio, redes | Casilla de elemento cuadrada con esquinas suaves. **67** pequeño arriba a la izquierda, **Ho-lupa** grande en el centro. El **mango sale de la casilla** por la esquina inferior derecha, rompiendo el marco. |
| **Logotipo** | Cabecera del juego | **HOLMIO** en mayúsculas; la **primera O** es la misma lupa del icono. Lema opcional: «Un elemento. Un caso. Cada día.» |
| **Favicon** | 16–32 px | Solo **Ho-lupa**, sin casilla ni número. |
| **Una tinta** | Sellos, impresión | Cualquiera de las anteriores en un solo color. |

**Reglas del logo:**
- Letras dibujadas a medida sobre una base **monoespaciada con remates (slab serif)**: aire de máquina de escribir, pero con trazos limpios que aguanten tamaños pequeños.
- El **grosor del aro** de la lupa es el mismo que el del **trazo de la H**.
- Máximo **dos colores** en el icono.
- No escribir «Holmio» dentro del icono (ilegible a tamaño pequeño).

**Piezas derivadas:**
- Sello circular **«CASO CERRADO»** (ligeramente torcido, lupa en el centro) al acertar.
- Sello **«SE HA FUGADO»** al perder.
- Animación de carga: la lupa recorriendo la tabla.
- **Día especial:** cuando la solución sea el propio holmio, mensaje propio («El culpable estaba en el logo desde el principio»).

### 3.4 Temas de color
Dos temas **igual de cuidados**. **Por defecto, modo día**, sea cual sea el tema del sistema; el botón de la cabecera cambia a modo noche y la elección se recuerda.

**Modo noche — «el despacho»**

| Rol | Color | Hex |
|---|---|---|
| Fondo | Tinta noche | `#141821` |
| Tarjetas | Expediente | `#1c212d` |
| Texto | Papel | `#ece3cf` |
| Acento (lupa, etiquetas, botón) | Lámpara ámbar | `#e7ad45` |
| Intento / alerta | Lacre | `#e0664f` |

**Modo día — «el expediente»** *(a pulir 🟡: acercarlo más a papel manila)*

| Rol | Color | Hex |
|---|---|---|
| Fondo | Papel | `#efe6d2` |
| Tarjetas | Folio | `#f8f2e4` |
| Texto | Tinta | `#1a1d27` |
| Acento | Ámbar oscuro | `#a66d0c` |
| Intento / alerta (lupa del logo) | Lacre | `#b9412f` |

**Logo en cada tema:** casilla en el color de fondo, «H» y «67» en el color de texto, lupa en **ámbar** (noche) o **lacre** (día), con un pequeño arco de brillo en la lente.

### 3.5 Tipografías
- **Special Elite** (máquina de escribir): solo para títulos y el texto del informe del caso. No para la interfaz.
- **IBM Plex Sans**: interfaz y textos.
- **IBM Plex Mono**: símbolos de la tabla.

### 3.6 Reglas visuales de la tabla
- **No se colorea por familias.** El color se reserva para el **estado** de cada casilla; con los colores de las familias, el sombreado se perdería.
- Tres estados, distinguibles también **sin depender del color**:
  - **Candidata:** clara y con borde.
  - **Descartada:** apagada, sin borde.
  - **Intento:** relleno sólido (lacre).
- Símbolos legibles a 7–10 px (peso semibold).

Referencia visual: [maqueta de identidad](exploracion/identidad.html) (dirección A, con el nombre provisional antiguo).

## 4. Flujo de una partida

1. Se muestra el **informe del caso** (pista principal) y la tabla periódica completa (sin sombrear).
2. El jugador **escribe** el nombre de un elemento con ayuda del autocompletado y envía su **acusación**.
3. **Si acierta**, gana y se muestra la pantalla de resultado.
4. **Si falla**:
   - El elemento respondido se marca en la tabla (en rojo lacre, con una pequeña sacudida).
   - **El juego se detiene**, como al subir de nivel en un *roguelike*: la pantalla se oscurece casi a negro y aparece la ficha del elemento con el sello **«COARTADA»**, el texto «*X tiene coartada*», «**ELIGE UNA PISTA**» destacado en ámbar y **3 tarjetas de pista** que entran escalonadas.
   - Hay que **elegir 1** para continuar (no se puede cerrar sin elegir).
   - Al elegir, la tarjeta se destaca y las otras desaparecen. **Dentro de la tarjeta se revela la respuesta**: la pregunta se borra y la respuesta se escribe a máquina (con cursor). En las pistas de dirección, además, se estampa un sello **SÍ** (verde) o **NO** (rojo) y, si es «no», el icono se tacha. Tras un momento para leerla (un toque lo acelera) se vuelve a la partida: la tabla se sombrea con una transición y la pista aparece donde le toca (ver abajo).
   - **Dónde se ven las pistas** (no hay lista de pistas):
     - **Todas** colocan **su icono sobre la casilla del elemento acusado** desde el que se pidieron, en lugar del símbolo (con un pequeño «salto» al aparecer). En las direcciones se ve la flecha; si la respuesta es «no», la flecha sale tachada.
     - Las pistas de **texto** (curiosidad y etimología), además, **amplían el informe del caso**, cada una en un párrafo con su icono.
     - **Tocar esa casilla** abre un **bocadillo encima de la propia casilla** (o debajo, si no cabe) con el texto de la pista. Se cierra con otro toque, tocando fuera o a los pocos segundos.
     - En las pistas de texto el bocadillo remite al informe («*Al interrogarlo, reveló una curiosidad del culpable. La tienes en el informe.*») y el párrafo correspondiente destella.
   - La pista se aplica respecto a su **último intento** (cuando es relativa).
5. Se repite hasta acertar o agotar los **6 intentos** (1 inicial + 5 tras pistas).
6. Al terminar, tras un instante para ver la tabla, aparece la **pantalla de resultado** con la misma puesta en escena que la elección de pista (fondo casi negro, todo centrado):
   - ficha grande del culpable con el sello **«CASO CERRADO»** (verde) o **«SE HA FUGADO»** (rojo);
   - «¡Bien visto!» / «¡A la primera!» / «Se te ha escapado» y «El culpable era *X*»;
   - debajo, **las fichas de las acusaciones usadas** (como el contador de la partida: lacre las fallidas, verde la acertada), que entran una a una;
   - una **curiosidad** del elemento;
   - **Compartir resultado**, **Ver la tabla** (cierra la pantalla para ver el tablero final) y la cuenta atrás para el próximo caso.
   - Con la pantalla cerrada, el panel inferior muestra la cuenta atrás y un botón **«Ver resultado»** para volver a abrirla. Al recargar la página con la partida terminada, la pantalla se abre sola.

**Reglas de entrada:**
- Solo se aceptan elementos válidos (los 118).
- Repetir un elemento ya respondido **no consume intento** (se avisa).
- Responder un elemento ya sombreado **sí** se permite y **sí** consume intento (el sombreado es una ayuda, no una restricción).

## 5. Sistema de pistas

### 5.1 Pista principal
- Una por elemento y día, escrita a mano.
- Debe ser **rebuscada**: difícil acertar a la primera, pero justa (con la información correcta en la cabeza, se puede deducir).
- No debe contener el nombre, el símbolo ni datos que lo regalen de forma directa.

### 5.2 Pistas adicionales
- Existe un **pool de 8–10 tipos** de pista (ver §6).
- Tras cada fallo se ofrecen **3 tipos al azar**, de entre los que:
  - **no se han usado** ya en la partida (cada tipo se puede recibir **una sola vez**), y
  - **aportan información nueva** (no se ofrece una pista que no descartaría ninguna casilla todavía no sombreada).
- Si quedan menos de 3 tipos útiles, se ofrecen los que haya.
- **Azar determinista:** la selección se genera con una semilla basada en *fecha + número de intento*, de modo que dos jugadores en la misma situación ven las mismas opciones. (Como el filtro de "útiles" depende de los intentos previos, jugadores con partidas distintas pueden ver ofertas distintas; es aceptable).
- Las pistas **relativas** se calculan respecto al **último intento** del jugador. Esto crea la estrategia principal: responder elementos "céntricos" antes de pedir una pista de posición.

## 6. Catálogo de tipos de pista *(provisional 🟡)*

| Icono | Tipo | Ejemplo | Relativa al intento | Origen del dato |
|---|---|---|---|---|
| ⬆️ | Arriba | "¿Está más arriba que Fe?" → "Sí" / "No (mismo periodo o más abajo)" | Sí | Calculado |
| ⬇️ | Abajo | "¿Está más abajo que Fe?" → "Sí" / "No (mismo periodo o más arriba)" | Sí | Calculado |
| ⬅️ | Izquierda | "¿Está más a la izquierda que Fe?" → "Sí" / "No (misma columna o más a la derecha)" | Sí | Calculado |
| ➡️ | Derecha | "¿Está más a la derecha que Fe?" → "Sí" / "No (misma columna o más a la izquierda)" | Sí | Calculado |
| 🧱 | Bloque | "Bloque d" | No | Calculado |
| 🔩 | Tipo de elemento | Metal / no metal / metaloide / gas noble… | No | Calculado |
| 🌡️ | Estado a 25 °C | Sólido / líquido / gas | No | Calculado |
| 📅 | Época de descubrimiento | "Descubierto en el siglo XVIII" | No | Dato por elemento |
| ☢️ | Radiactividad | "Todos sus isótopos son radiactivos" / "Tiene isótopos estables" | No | Calculado |
| 🔥 | Punto de fusión | "Funde a mayor temperatura que el Hierro" | Sí | Dato por elemento |
| ⚡ | Electronegatividad | "Es más electronegativo que el Hierro" | Sí | Dato por elemento |
| #️⃣ | Número atómico | "Su número atómico es menor que el del Hierro" | Sí | Calculado — ⚠️ posiblemente demasiado potente |
| 🔤 | Etimología | "Su nombre viene de la palabra griega para *violeta*" | No | **Escrito a mano** |
| 💡 | Curiosidad extra | Otra pista rebuscada | No | **Escrito a mano** |

**Notas:**
- **Iconos:** en la interfaz cada pista usa un **icono SVG propio** (trazo fino, color de acento): flechas que salen de una casilla tenue (tu última acusación), una Z en una casilla (número atómico), la silueta de la tabla (bloque), un matraz (familia), un termómetro (estado), el trébol radiactivo, un libro abierto (etimología) y una bombilla (curiosidad). Los **emojis** de la tabla solo se usan en el **texto de compartir**, que es texto plano.
- Si la respuesta a una pista de dirección es **«no»**, la flecha aparece **atenuada y tachada** sobre la casilla.
- Las cuatro pistas de **dirección** son preguntas de **sí o no** sobre el último acusado. Al ser cuatro tipos distintos (cada uno usable una vez), dan más juego que dos pistas de eje completo: hay que decidir qué dirección preguntar y desde qué elemento. Una dirección imposible desde el último acusado (p. ej., «arriba» desde el periodo 1) no se ofrece, porque no descartaría nada.
- Las pistas **comparativas** (🔥 ⚡ #️⃣) no se ofrecen si falta el dato para el elemento secreto o para el último intento (p. ej., elementos superpesados sin punto de fusión medido).
- Las pistas **escritas a mano** (🔤 💡) no "sombrean" la tabla: aportan información que el jugador interpreta.
- 🟡 Decidir la lista final (8–10 tipos) tras probar el prototipo.

## 7. Reglas de posición *(pendiente 🟡)*

Implementado así en el prototipo (pendiente de confirmar tras probarlo):
- **Arriba / abajo** = comparar el **periodo** (fila). Los lantánidos son periodo 6 y los actínidos periodo 7, aunque se dibujen debajo.
- **Izquierda / derecha** = comparar la columna en la **tabla larga de 32 columnas**, para que lantánidos y actínidos tengan una posición coherente (entre los grupos 2 y 3).
- **Lu y Lr en el grupo 3**; el bloque f son La–Yb y Ac–No.
- Explicado en la pantalla "¿Cómo se juega?".

## 8. Sombreado automático

- Cada pista que se pueda calcular (posición, bloque, tipo, estado, radiactividad, comparativas) **sombrea automáticamente** las casillas incompatibles.
- Los elementos ya respondidos se marcan de forma distinta (p. ej., con la flecha o el icono de la pista obtenida desde ellos).
- Las casillas compatibles se mantienen destacadas: de un vistazo se ve "lo que queda".
- Estados y colores: ver §3.6.

## 9. Entrada de la respuesta

- **Siempre por texto**, con **autocompletado**. La tabla **no** es pulsable para responder.
- Solo se acepta el **nombre** (y nombres alternativos: "tungsteno", "cinc"…). **No se busca por símbolo**.
- No distingue **mayúsculas ni tildes** ("fosforo" = "fósforo").
- Las sugerencias salen en un **desplegable hacia arriba**, con la mejor coincidencia pegada al campo y las **letras buscadas en negrita**. Primero los nombres que empiezan por lo escrito y, desde 3 letras, los que lo contienen.
- Tocar una sugerencia **completa el campo**, no acusa: hay que pulsar «Acusar» (evita acusaciones accidentales).
- Los elementos ya sombreados se muestran **atenuados** en el desplegable y los ya acusados, **tachados**; no se ocultan.

## 10. Interfaz (móvil primero)

- La tabla es un **mapa visual**, no un control táctil: puede ser pequeña.
- **Tabla estándar de 18 columnas** + bloque f debajo, **ajustada al ancho** de la pantalla (≈19 px por casilla en 375 px; solo símbolo, letra 10–11 px).
- **Ampliación opcional** (tocar o pellizcar) para ver detalles; el arrastre solo dentro del modo ampliado.
- Distribución vertical: **informe del caso** arriba → **tabla centrada en el hueco libre** → **panel inferior** (al alcance del pulgar) con las **acusaciones** y el **campo de respuesta**.
- **Contador de acusaciones:** seis **fichas con forma de casilla de elemento** (numeradas 1–6 en la esquina). Vacías con borde discontinuo; la actual con «?» y un latido en ámbar; las usadas muestran el **símbolo del acusado** en lacre, o el del culpable en verde si se acierta. A la derecha, el número de **sospechosos** que quedan. Con el teclado abierto en pantallas bajas, las fichas se ocultan para dejar sitio a la tabla. La app ocupa justo la pantalla: si el informe crece, la tabla baja la mitad de lo que crece; si el informe no cabe, se desplaza por dentro.
- ⚠️ **Teclado abierto:** ocupa ~la mitad de la pantalla. Mientras se escribe, deben seguir visibles al menos la tabla y, si es posible, la pista. Es el principal riesgo de diseño: **validar con el prototipo**.
- Selector de las 3 pistas: tarjetas grandes y pulsables (aquí sí hacen falta zonas táctiles cómodas).
- Temas noche/día: ver §3.4.
- **Barra superior:** logo a la izquierda y **un solo botón de menú (☰)** a la derecha.
- **Menú lateral** (entra por la derecha; sigue el tema día/noche, con letra de máquina y el color de acento). Se cierra con ✕, tocando fuera, deslizando a la derecha o con Esc.
  - **Jugar:** *Caso del día*, *Archivo de casos* y *Práctica libre* (estas dos, de momento atenuadas y sin función). Cada opción es solo icono (grande, sin recuadro, en el color de acento) y título en una línea.
  - **Utilidades:** *Cómo se juega*, interruptor de *Modo noche* y *Acerca de Holmio* (qué es, origen del nombre y enlace al código).
  - Cuando existan el archivo y la práctica, se ofrecerán también en la **pantalla de resultado** y en el **panel inferior** al terminar el caso del día, que es cuando el jugador se queda con ganas.
- **Ayuda («Cómo se juega»):** se abre la primera vez y desde el menú. Sobre fondo casi negro, un **carrusel de 6 diapositivas** que se navega **deslizando**, con las **flechas** (chevrones pequeños y discretos, sin círculo, en el margen del diálogo a media altura; sin flecha izquierda en la primera ni derecha en la última), con los **puntos** o con el teclado. «Saltar» arriba. En la última diapositiva los puntos dejan paso a un botón **noir** «Abrir el caso» (tinta, doble filete ámbar, letra de máquina y un barrido de luz de lámpara). Cada diapositiva tiene una **escena animada** hecha con piezas en miniatura del propio juego (se adaptan al tema) y un texto corto:
  1. *Un culpable al día*: el informe se escribe a máquina y una lupa recorre la tabla.
  2. *Acusa por su nombre*: se escribe «hie», se elige Hierro en el desplegable, se acusa y la ficha se rellena.
  3. *Elige una pista*: tres tarjetas entran, se elige «Abajo», sello SÍ y la respuesta se escribe.
  4. *Pregunta desde el sitio adecuado*: Fe recibe la flecha ↓ y se apagan los periodos 1–4.
  5. *Sigue el rastro*: tabla con pistas; un toque en Pt abre su bocadillo.
  6. *Tu turno, detective*: aparece la marca HOLMIO y cae el sello «CASO ABIERTO». Cierra con la frase: «118 sospechosos. Un solo culpable. **Ninguna coartada dura para siempre.**»
  En pantalla, una mano señala los toques en dispositivos táctiles y una flecha de ratón en el ordenador.
  Cabe sin desplazar desde 600 px de alto.

## 11. Reto diario

- Un elemento por día, el **mismo para todos**.
- El día cambia a **medianoche hora local** del jugador (como Wordle).
- **Número de caso** = días transcurridos desde la fecha de lanzamiento (#1, #2…).
- El orden viene de un **calendario predefinido** (fecha → elemento), no de un aleatorio puro, para:
  - evitar rachas raras (dos gases nobles seguidos, tres lantánidos en una semana),
  - poder repetir elementos en ciclos posteriores con **pistas principales nuevas**.
- Con 118 elementos, el ciclo se repite cada ~4 meses. 🟡 Decidir si los superpesados (Z > 103) aparecen con menos frecuencia.

## 12. Compartir

Texto copiado al portapapeles (o hoja de compartir nativa del móvil), sin desvelar la solución:

```
🔎 Holmio · Caso nº 12 · 4/6
❌ ↕️
❌ 🧱
❌ 💡
✅
https://…
```

- Cada línea = una acusación; el icono indica la pista elegida tras ese fallo.
- Si no se acierta: `X/6`.

## 13. Estadísticas

Guardadas en `localStorage` (sin cuentas ni servidor):
- Partidas jugadas, % de casos resueltos, racha actual y racha máxima.
- Distribución de intentos (1–6).
- Estado de la partida del día (para poder cerrar y volver).

## 14. Contenido

Por elemento hacen falta:

| Dato | Origen |
|---|---|
| Número atómico, símbolo, nombre (es), periodo, grupo, bloque, tipo, estado a 25 °C, radiactividad | Tabla de datos (una vez) |
| Año/siglo de descubrimiento, punto de fusión, electronegatividad | Tabla de datos (una vez) |
| Pista principal / informe del caso (una o varias para distintos ciclos) | **Escrita a mano** |
| Etimología | **Escrita a mano** |
| Curiosidad(es) extra | **Escrita a mano** |

- Todas las pistas escritas se **revisan** antes de publicarse (un dato falso arruina el reto del día).
- Formato: archivos JSON (datos de elementos + pistas + calendario).

## 15. Técnica

- **Sitio estático** alojado en **GitHub Pages**. Sin servidor ni base de datos.
- 🟡 Propuesta: **HTML + CSS + JavaScript (módulos ES) sin paso de compilación**. Es lo más sencillo de publicar en GitHub Pages; se puede pasar a Vite/TypeScript más adelante si el proyecto crece.
- Toda la lógica en el cliente. La solución está en el JS y quien quiera hacer trampas puede; se asume, igual que en Wordle.

## 16. Decisiones pendientes

- [x] Nombre del juego → **Holmio** (§3.1).
- [x] Temática y estilo → **detective**, modo noche + modo día (§3).
- [ ] Dominio propio o URL de GitHub Pages (§3.1).
- [ ] Pulir la paleta del modo día (§3.4).
- [ ] Dibujar el logo según §3.3.
- [ ] Lista final de tipos de pista (§6), y si se incluye la de número atómico.
- [ ] Reglas exactas de posición y colocación de La/Ac–Lu/Lr (§7).
- [x] Comportamiento del autocompletado (§9).
- [ ] Disposición de la interfaz con el teclado abierto (§10).
- [ ] Frecuencia de los superpesados en el calendario (§11).
- [ ] Stack técnico definitivo (§15).

## 17. Plan de trabajo

1. **Prototipo móvil mínimo** con ~5 elementos de prueba y pistas provisionales, ya con la identidad de Holmio: tabla ajustada al ancho, entrada con autocompletado, oferta de 3 pistas, sombreado, temas noche/día y compartir. Objetivo: comprobar la jugabilidad y la interfaz con el teclado abierto.
2. **Ajustes** de reglas y lista de pistas a partir de las pruebas.
3. **Datos de los 118 elementos** (la parte que se calcula).
4. **Contenido escrito** (pistas principales, etimologías, curiosidades) y revisión.
5. **Logo definitivo**, calendario, pantalla "¿Cómo se juega?", estadísticas y pulido.
6. **Publicación** en GitHub Pages.

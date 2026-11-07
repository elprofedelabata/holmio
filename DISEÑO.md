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

**Logo actual (implementado):** todo sale del sello generado (`img/sello.png`) con `herramientas/logo.py` (y `herramientas/vectorizar.py`). Colores: **letras en tinta** (color del texto del tema) y **lupa en lacre**.
- **Logo largo** `img/logo-largo.svg`: «HOLMIO» con las letras H, L, M, I y O sacadas del arco del sello (enderezadas y limpias) y la **primera O convertida en la lupa**, con el mango bajando como un descendente. Se usa en la **cabecera** y en el **menú**.
- **Logo corto** `img/logo-corto.svg`: el monograma «Ho» del centro del sello, con la lupa algo separada de la H. Se usa en el **favicon** (`img/favicon.svg`: H clara y lupa lacre sobre cuadrado color tinta) y en el futuro icono de la app.
- Versiones monocromas de un solo color: `img/monograma.svg` / `img/monograma-limpio.svg`.
- Sello completo: `img/sello.svg` / `img/sello-limpio.svg` (última diapositiva del tutorial; pendiente: imagen para compartir en redes).

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

**Modo día — «el expediente»** 

| Rol | Color | Hex |
|---|---|---|
| Fondo | Papel | `#efe6d2` |
| Tarjetas | Folio | `#f8f2e4` |
| Texto | Tinta | `#1a1d27` |
| Acento | Ámbar oscuro | `#a66d0c` |
| Intento / alerta (lupa del logo) | Lacre | `#b9412f` |

**Logo en cada tema:** casilla en el color de fondo, «H» y «67» en el color de texto, lupa en **ámbar** (noche) o **lacre** (día), con un pequeño arco de brillo en la lente.

**Grano de papel:** el fondo general lleva un grano sutil, en los dos temas, para que parezca papel y no un color plano. Es una loseta PNG semitransparente (`img/grano-dia.png`, `img/grano-noche.png`, generadas con `herramientas/grano.py`) que se repite sin costuras y va en la variable `--grano`. Solo en los fondos de pantalla (`body`, pantalla de carga, cabecera del archivo, panel inferior, menú, tutorial, Acerca de y velos de pista y resultado): **las casillas, tarjetas y textos siguen planos** para no perder legibilidad. La loseta del tema se pide en el `<head>`, antes que el CSS, para que la pantalla de carga salga con papel desde el principio. Regla: se percibe como papel, pero no compite con la tabla. El modo día necesita más fuerza (22) que el noche (7), porque sobre un fondo claro la misma variación se nota mucho menos. Sin madera ni otras texturas figurativas.

**Desgaste de la tinta:** los rellenos sólidos (casillas y fichas de fallo y acierto, casos del archivo y su leyenda; **los botones no**) llevan saltaduras y rozaduras agresivas del color del papel, como tinta gastada (`img/desgaste-dia.png`, `img/desgaste-noche.png`, generadas con el mismo `herramientas/grano.py`). Va en el fondo del elemento, nunca sobre el texto, y un degradado del color del relleno limpia el centro: **la pieza se gasta por los bordes y lo escrito se sigue leyendo**. Cada pieza muestra un trozo distinto de la loseta para que no se repita el dibujo. De noche va más suave, porque el contraste entre relleno claro y fondo oscuro lo hace resaltar mucho más.

**El dossier:** el informe del caso es una hoja mecanografiada dentro de una carpeta de cartulina (manila de día, marrón oscuro de noche), con otra hoja torcida debajo. La pestaña de la carpeta lleva el número de caso, y la fecha va escrita a boli (Caveat, tinta azul) en un post-it amarillo sujeto a la carpeta con un clip. Las pistas de texto se añaden a la misma hoja, que hace scroll por dentro si no cabe.

**Botones principales:** relleno liso con un filete interior fino y letra de máquina (Special Elite), de la misma familia que el botón noir del tutorial. **Todos los botones llevan icono y miden lo que su contenido**, sin ocupar todo el ancho.

**Hover noir** (solo con ratón; en el móvil se quedaría pegado, así que allí la pieza se apaga un instante al pulsarla):
- **Botones rellenos:** se levantan un poco, como un sello antes de caer, y al pulsar bajan. El mazo de «Acusar» se alza.
- **Casos y casillas con pista:** se acercan «bajo la lupa», con un aro en lacre.
- **Botones de contorno y tarjetas de pista:** se encienden con la luz ámbar.
- **Menú y sugerencias:** se marca la pestaña del expediente en lacre.
- **Cerrar, flechas y enlaces:** cambian a lacre o ámbar, y la X gira.

### 3.5 Tipografías
- **Special Elite** (máquina de escribir): solo para títulos y el texto del informe del caso. No para la interfaz.
- **IBM Plex Sans**: interfaz y textos.
- **IBM Plex Mono**: símbolos de la tabla.
- **Caveat** (manuscrita): solo para lo que el detective escribe a mano, como la fecha del post-it.

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
   - **El juego se detiene**, como al subir de nivel en un *roguelike*: la pantalla se cubre con un **velo translúcido y desenfocado** (papel en modo día, casi negro en modo noche) que deja intuir el juego debajo y aparece la ficha del elemento con el sello **«COARTADA»**, el texto «*X tiene coartada*», «**ELIGE UNA PISTA**» destacado en ámbar y **3 tarjetas de pista** que entran escalonadas.
   - Hay que **elegir 1** para continuar (no se puede cerrar sin elegir).
   - Al elegir, la tarjeta se destaca y las otras desaparecen. **Dentro de la tarjeta se revela la respuesta**: la pregunta se borra y la respuesta se escribe a máquina (con cursor). En las pistas de dirección, además, se estampa un sello **SÍ** (verde) o **NO** (rojo) y, si es «no», el icono se tacha. Tras un momento para leerla (un toque lo acelera) se vuelve a la partida: la tabla se sombrea con una transición y la pista aparece donde le toca (ver abajo).
   - **Dónde se ven las pistas** (no hay lista de pistas):
     - **Todas** colocan **su icono sobre la casilla del elemento acusado** desde el que se pidieron, en lugar del símbolo (con un pequeño «salto» al aparecer). En las direcciones se ve la flecha; si la respuesta es «no», la flecha sale tachada.
     - Las pistas de **texto** (curiosidad y etimología), además, **amplían el informe del caso**, cada una en un párrafo con su icono.
     - **Tocar esa casilla** abre un **bocadillo encima de la propia casilla** (o debajo, si no cabe) con el texto de la pista. Se cierra con otro toque, tocando fuera o a los pocos segundos.
     - En las pistas de texto el bocadillo remite al informe («*Al interrogarlo, reveló una curiosidad del culpable. La tienes en el informe.*») y el párrafo correspondiente destella.
   - La pista se aplica respecto a su **último intento** (cuando es relativa).
5. Se repite hasta acertar o agotar los **6 intentos** (1 inicial + 5 tras pistas).
6. Al terminar, tras un instante para ver la tabla, aparece la **pantalla de resultado** a pantalla completa y centrada. **Sigue el tema:** de día, un velo de papel con tinta oscura; de noche, casi negro. En ambos, el velo es **translúcido y desenfocado**, para que se note que está por encima del juego.
   - ficha grande del culpable con el sello **«CASO CERRADO»** (verde) o **«SE HA FUGADO»** (rojo);
   - «¡Bien visto!» / «¡A la primera!» / «Se te ha escapado» y «El culpable era *X*»;
   - debajo, **las fichas de las acusaciones usadas** (como el contador de la partida: lacre las fallidas, verde la acertada), que entran una a una;
   - una **curiosidad** del elemento;
   - **Compartir resultado**, **Ver la tabla** (cierra la pantalla para ver el tablero final) y, **solo en el caso del día**, la cuenta atrás para el próximo caso.
   - Se cierra también con una **✕** arriba a la derecha, tocando fuera del contenido o con Esc.
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

## 6. Catálogo de tipos de pista

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
- **Lista final: 11 tipos** (`js/pistas.js`): arriba, abajo, izquierda, derecha, número atómico, bloque, tipo, estado, radiactividad, etimología y curiosidad. Época, punto de fusión y electronegatividad se quedaron fuera.

## 7. Reglas de posición

Reglas del juego:
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
- **Pantalla de carga:** tapa el juego desde la primera pintura con el **logo largo cayendo como un tampón** y una barra fina en lacre. Se quita (fundido) cuando la tabla está montada y las **fuentes cargadas**, con un mínimo de 0,9 s para ver el logo y un máximo de 4 s de espera a las fuentes. Solo entonces se abren el tutorial (primera visita) o la pantalla que tocara (elegir pista o resultado). Los módulos JS se precargan en paralelo (`modulepreload`).
- **Barra superior:** logo a la izquierda y **un solo botón de menú (☰)** a la derecha.
- **Menú lateral** (entra por la derecha; sigue el tema día/noche, con letra de máquina y el color de acento). Se cierra con ✕, tocando fuera, deslizando a la derecha o con Esc.
  - **Modos de juego** (sin rótulo de sección): *Caso del día*, *Archivo de casos* (§11.1) y *Práctica libre* (§11.2). El menú marca dónde estás. Cada opción es solo icono (grande, sin recuadro, en el color de acento) y título en una línea.
  - **Utilidades:** *Cómo se juega* (icono de interrogación en un círculo), interruptor de *Modo noche*, *Acerca de Holmio* (qué es, origen del nombre y créditos de El profe de la bata, con logo, enlace a elprofedelabata.es y copyright) y *Borrar todos los datos*, que pide confirmación («¿Quemar el expediente?»), borra casos, tema y tutorial visto y recarga la página.
  - Al terminar el caso del día, la **pantalla de resultado** y el **panel inferior** ofrecen **Practicar**, que es cuando el jugador se queda con ganas. Lleva a la práctica en curso o sortea un caso nuevo. No aparece en los casos antiguos del archivo.
- **Escritorio (desde 960 px):** cabecera arriba, a la izquierda el dossier con las fichas y el contador debajo, a la derecha la tabla, alineada arriba con el dossier, y abajo el campo de acusar centrado. La tabla se limita también por la altura para que quepa sin desplazarse, y el archivo reparte los meses en columnas.
- **Teclado abierto (móvil):** mientras se escribe se ocultan la tabla y las fichas, y quedan solo el dossier y el campo, con el informe a la vista. La tabla vuelve al acusar o al cerrar el teclado. En ordenador no cambia nada.
- **Ayuda («Cómo se juega»):** se abre la primera vez y desde el menú. Sobre fondo casi negro, un **carrusel de 6 diapositivas** que se navega **deslizando**, con las **flechas** (chevrones pequeños y discretos, sin círculo, en el margen del diálogo a media altura; sin flecha izquierda en la primera ni derecha en la última), con los **puntos** o con el teclado. «Saltar» arriba. En la última diapositiva los puntos dejan paso a un botón **noir** «Abrir el caso» (tinta, doble filete ámbar, letra de máquina y un barrido de luz de lámpara). Cada diapositiva tiene una **escena animada** hecha con piezas en miniatura del propio juego (se adaptan al tema) y un texto corto:
  1. *Un culpable al día*: el informe se escribe a máquina y una lupa recorre la tabla.
  2. *Acusa por su nombre*: se escribe «hie», se elige Hierro en el desplegable, se acusa y la ficha se rellena.
  3. *Elige una pista*: tres tarjetas entran, se elige «Abajo», sello SÍ y la respuesta se escribe.
  4. *Pregunta desde el sitio adecuado*: Fe recibe la flecha ↓ y se apagan los periodos 1–4.
  5. *Sigue el rastro*: tabla con pistas; un toque en Pt abre su bocadillo.
  6. *Tu turno, detective*: el **sello de Holmio** (`img/sello.svg`, con textura) cae sobre la mesa como un tampón y la mesa tiembla con el golpe. Se reproduce **una sola vez** cada vez que se llega a la diapositiva (sin bucle). Cierra con la frase: «118 sospechosos. Un solo culpable. **Ninguna coartada dura para siempre.**»
  En pantalla, una mano señala los toques en dispositivos táctiles y una flecha de ratón en el ordenador.
  Cabe sin desplazar desde 600 px de alto.

## 11. Reto diario

- Un elemento por día, el **mismo para todos**.
- El día cambia a **medianoche hora local** del jugador (como Wordle).
- **Número de caso** = días transcurridos desde la fecha de lanzamiento (#1, #2…).
- El orden viene de un **calendario predefinido** (fecha → elemento), no de un aleatorio puro, para:
  - evitar rachas raras (dos gases nobles seguidos, tres lantánidos en una semana),
  - poder repetir elementos en ciclos posteriores con **pistas principales nuevas**.
- Con 118 elementos, el ciclo se repite cada ~4 meses (el segundo empieza el 5 de marzo de 2027). **Cada ciclo tiene un orden distinto** para que nadie pueda predecir al culpable: los textos se repiten, pero un caso nunca sale a menos de 15 posiciones de donde salió en el ciclo anterior ni a menos de 30 días de su última aparición. Hay 10 órdenes (unos tres años) y después se reutilizan los 9 últimos. Se generan con semilla fija en `herramientas/casos.py`: no cambiarlos tras el lanzamiento.
- 🟡 Pendiente: informes nuevos para que los ciclos siguientes no repitan el mismo texto.
- **Orden del primer ciclo**: nunca dos del mismo tipo seguidos ni más de dos de un tipo (salvo metales de transición) en una semana. Los elementos sintéticos no salen el primer mes, y los superpesados (Z > 103) aparecen uno cada seis días a partir del caso 30. El **caso nº 67 es el holmio**, como el número del sello.

### 11.1 Archivo de casos

- Pantalla mínima: el título **«Archivo de casos»** con una **minileyenda de colores** debajo (Cerrado · Fugado · En curso · Pendiente · Hoy), ambos **fijos arriba** al desplazar, y un **calendario por meses** (más estrecho que la pantalla, con aire a los lados), **de más antiguo a más reciente**; se abre desplazado del todo hacia abajo para que se vea el caso de hoy (semanas de lunes a domingo). Sin resumen, filtros ni botón de volver: se navega con el menú (☰).
- Cada día con caso es una **casilla de elemento** con **«?»** en el centro si no está terminado o el **símbolo del culpable** si ya lo está. El **día del mes va siempre abajo a la derecha**, también en los días sin caso, para que no se confunda con un número atómico.
- Colores según el estado: pendiente (casilla clara), en curso (borde ámbar discontinuo), **cerrado** (verde salvia, más suave), **fugado** (lacre). El caso de **hoy** lleva un contorno ámbar que late.
- Los días sin caso (antes del primero o en el futuro) muestran solo el número, apagado. **Nunca se puede abrir un caso futuro.**
- Al tocar un caso **terminado** (cerrado o fugado) se abre su **pantalla de resultado encima del archivo**; «Ver la tabla» lleva a la pantalla de ese caso; la ✕, tocar fuera o Esc dejan en el archivo. Al tocar uno **pendiente o en curso** se juega en la pantalla normal, con «**Archivo · Caso nº 9**» y su fecha en la línea bajo el logo. No cuenta para la racha (cuando exista), pero queda guardado.
- **Direcciones propias:** caso del día (sin #), `#archivo` y `#caso-N`. El botón «atrás» del móvil funciona y un caso del archivo se comparte con su enlace directo.

### 11.2 Práctica libre

Partidas sin límite para quien se queda con ganas tras el caso del día (`#practica`, lógica en `js/practica.js`).

- **Explicación:** la primera vez que se entra, una pantalla previa cuenta en qué consiste (sospechoso al azar, mismas reglas, sin límite) y abre el primer caso. Se recuerda con `holmio-visto-practica`.
- **Sin informe:** cada partida sortea uno de los 118 elementos y se juega solo con las pistas de datos. Funciona con todos los elementos sin escribir contenido y nunca destripa un caso del día que aún no ha salido. Sin texto escrito no se ofrecen etimología ni curiosidad.
- **Dificultad:** simulación de 7.080 partidas por estrategia, acusando a un candidato al azar: 56 % de victorias eligiendo pistas al azar y 82 % eligiendo la que más descarta. Elegir bien la pista es la habilidad que se practica.
- **Dossier:** la pestaña dice «Práctica» y el post-it, «sin fecha».
- **Resultado:** sin cuenta atrás, sin compartir y sin dato curioso. El botón principal es **Otro caso**; también está en el panel inferior si se vuelve a la tabla.
- **Guardado:** una sola partida en `holmio-practica`, separada de los casos: no entra en el archivo ni en las estadísticas. Se retoma si quedó a medias; una terminada no se retoma, se sortea otra.
- **Repeticiones:** no sale ninguno de los últimos 30 elementos jugados.
- **Más adelante:** cuando haya contenido, se podrán añadir los informes de casos ya publicados.

## 12. Compartir

**Imagen del dossier** (`js/imagen.js`): cuadrada, 1080 × 1080, dibujada en un lienzo en el propio dispositivo, siempre en colores de día. Lleva el logo, una nota a boli sobre el dossier («Seguí las pistas hasta dar con el culpable.» o «Seguí las pistas, pero el culpable se me escapó.»), la carpeta con el número de caso, el post-it con la fecha, la frase del resultado en una línea («Culpable identificado en 4 de 6.» o «El culpable se ha fugado.»), las seis fichas con la pista elegida tras cada fallo, el sello estampado, el enganche («118 sospechosos. Un solo culpable. ¿Aceptas el caso?») y la dirección del juego.

- **Nunca muestra al culpable** ni la tabla marcada: la posición lo delataría.
- Se prepara al abrir el resultado, porque el navegador solo deja compartir justo tras pulsar.
- **Móvil:** hoja de compartir con la imagen y el texto. **Ordenador:** imagen al portapapeles. Si algo no se admite, se comparte solo el texto.

El texto, que acompaña a la imagen o la sustituye:

```
🔎 ¡Caso cerrado! He resuelto el caso nº 12 de Holmio en 4 de 6 acusaciones.

❌❌❌✅

118 sospechosos. Un solo culpable. ¿Aceptas el caso?
Pruébalo en https://…
```

- Cada emoji es una acusación, todas en una sola línea. No se indica qué pista se eligió.
- A la primera: «He resuelto el caso nº 12 de Holmio a la primera.»
- Si no se acierta: «Se me ha fugado el culpable del caso nº 12 de Holmio.»

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

- **Los 118 casos están escritos** (informe, etimología y curiosidad), contrastados con fuentes y revisados. El borrador, con sus fuentes, está en `contenido/`, fuera del repositorio para no duplicar soluciones.
- Todas las pistas escritas se **revisan** antes de publicarse (un dato falso arruina el reto del día).
- Formato: archivos JSON (datos de elementos + pistas + calendario).

## 15. Técnica

- **Sitio estático** alojado en **GitHub Pages**. Sin servidor ni base de datos.
- **HTML + CSS + JavaScript (módulos ES) sin paso de compilación**. Es lo más sencillo de publicar en GitHub Pages; se puede pasar a Vite/TypeScript más adelante si el proyecto crece.
- Toda la lógica en el cliente. Los casos van codificados en `js/casos-datos.js` (se generan con `herramientas/casos.py` desde `contenido/casos.json`, que no se sube): evita destripes por accidente, pero quien quiera hacer trampas puede; se asume, igual que en Wordle.
- Instalable en el móvil (`manifest.webmanifest`) y con vista previa al compartir el enlace (`img/compartir.png`). Si cambia la dirección, hay que actualizar las etiquetas `og:` de `index.html`.

## 16. Decisiones pendientes

- [x] Nombre del juego → **Holmio** (§3.1).
- [x] Temática y estilo → **detective**, modo noche + modo día (§3).
- [x] Dirección: **holmio.elprofedelabata.es**, un subdominio de la web de El profe de la bata servido por GitHub Pages (§3.1).
- [x] Pulir la paleta del modo día (§3.4).
- [x] Dibujar el logo según §3.3.
- [x] Lista final de tipos de pista (§6), y si se incluye la de número atómico.
- [x] Reglas exactas de posición y colocación de La/Ac–Lu/Lr (§7).
- [x] Comportamiento del autocompletado (§9).
- [x] Disposición de la interfaz con el teclado abierto (§10).
- [x] Frecuencia de los superpesados en el calendario (§11): uno cada seis días desde el caso 30.
- [x] Stack técnico definitivo (§15).
- [x] Fecha de lanzamiento: **7 de noviembre de 2026** (Caso nº 1).

## 17. Plan de trabajo

1. **Prototipo móvil mínimo** con ~5 elementos de prueba y pistas provisionales, ya con la identidad de Holmio: tabla ajustada al ancho, entrada con autocompletado, oferta de 3 pistas, sombreado, temas noche/día y compartir. Objetivo: comprobar la jugabilidad y la interfaz con el teclado abierto.
2. **Ajustes** de reglas y lista de pistas a partir de las pruebas.
3. **Datos de los 118 elementos** (la parte que se calcula).
4. **Contenido escrito** (pistas principales, etimologías, curiosidades) y revisión.
5. **Logo definitivo**, calendario, pantalla "¿Cómo se juega?", estadísticas y pulido.
6. **Publicación** en GitHub Pages.

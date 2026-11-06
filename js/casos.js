// Los 118 casos, en el orden en que salen en el calendario: el caso nº 1 es el primero.
// El orden evita rachas raras (dos del mismo tipo seguidos, tres lantánidos en una semana),
// deja los sintéticos para después del primer mes y reserva el caso nº 67 para el holmio.

export const CASOS = [
  {
    z: 21, // Escandio
    informe: 'Mendeléiev lo predijo como «eka-boro». Nilson lo encontró en 1879, y hoy refuerza aleaciones de aluminio.',
    etimologia: 'Su nombre viene de Scandia, el nombre latino de Escandinavia.',
    curiosidad: 'Los soviéticos lo usaron en aleaciones de aluminio para sus cazas MiG.',
  },
  {
    z: 31, // Galio
    informe: 'Mendeléiev describió sus propiedades años antes de que nadie lo viera. Su descubridor le puso el nombre de su país… o, según las malas lenguas, el suyo propio.',
    etimologia: 'Su nombre viene de Gallia, el nombre latino de Francia.',
    curiosidad: 'Se funde en la palma de la mano: su punto de fusión ronda los 30 °C.',
  },
  {
    z: 72, // Hafnio
    informe: 'Coster y Hevesy lo identificaron hacia 1922 en Copenhague, escondido en minerales de otro elemento casi idéntico.',
    etimologia: 'Su nombre viene de Hafnia, el nombre latino de Copenhague.',
    curiosidad: 'Se usa en las barras de control de submarinos nucleares.',
  },
  {
    z: 36, // Kriptón
    informe: 'Ramsay y Travers lo hallaron en 1898 en los restos de aire líquido. Entre 1960 y 1983, su luz sirvió para definir el metro.',
    etimologia: 'Su nombre viene del griego kryptós, «oculto».',
    curiosidad: 'El planeta natal de Superman se llama casi igual que este gas.',
  },
  {
    z: 44, // Rutenio
    informe: 'Claus lo aisló en 1844 en Kazán, a partir de residuos del platino.',
    etimologia: 'Su nombre viene de Ruthenia, el nombre latino de Rusia.',
    curiosidad: 'Un catalizador suyo, el de Grubbs, le valió un Nobel a su inventor.',
  },
  {
    z: 49, // Indio
    informe: 'Reich y Richter lo hallaron en 1863. Reich era daltónico, así que Richter tuvo que mirar el color por él.',
    etimologia: 'Su nombre viene del color de su línea espectral, entre el azul y el violeta.',
    curiosidad: 'Un óxido suyo con estaño recubre las pantallas planas: es transparente y conduce.',
  },
  {
    z: 1, // Hidrógeno
    informe: 'Cavendish lo describió en 1766 como «aire inflamable». Es lo más abundante del universo y, aun así, aquí casi nunca anda solo.',
    etimologia: 'Su nombre significa «generador de agua».',
    curiosidad: 'El dirigible Hindenburg iba lleno de este gas cuando ardió en Nueva Jersey en 1937.',
  },
  {
    z: 57, // Lantano
    informe: 'Mosander lo encontró hacia 1839 como impureza en una sal de otro elemento.',
    etimologia: 'Su nombre viene del griego lanthánein, «estar oculto».',
    curiosidad: 'Da nombre a toda una serie de 15 elementos de la tabla.',
  },
  {
    z: 12, // Magnesio
    informe: 'Arde con una luz blanca tan intensa que los primeros fotógrafos lo usaban como flash.',
    etimologia: 'Su nombre viene de Magnesia, una comarca de Tesalia, en Grecia.',
    curiosidad: 'Ocupa el centro de cada molécula de clorofila.',
  },
  {
    z: 59, // Praseodimio
    informe: 'En 1885, Auer von Welsbach partió en dos una sustancia que parecía un solo elemento. Este le dio las sales verdes.',
    etimologia: 'Su nombre significa «gemelo verde».',
    curiosidad: 'Va en las gafas que protegen a los sopladores de vidrio.',
  },
  {
    z: 40, // Circonio
    informe: 'Klaproth lo identificó en 1789 en una gema. Hoy envuelve el combustible de las centrales nucleares.',
    etimologia: 'Su nombre viene del persa zargun, «color de oro».',
    curiosidad: 'Su óxido cúbico imita al diamante en muchas joyas baratas.',
  },
  {
    z: 16, // Azufre
    informe: 'Se conoce desde la Antigüedad y la tradición le atribuye el olor del infierno. Los huevos podridos deben su peste a un compuesto suyo.',
    etimologia: 'En latín se llamaba sulphur, y en inglés antiguo, «piedra que arde».',
    curiosidad: 'Ío, una luna de Júpiter, debe sus tonos amarillos a este elemento.',
  },
  {
    z: 28, // Níquel
    informe: 'Cronstedt lo aisló en 1751 de un mineral que parecía de cobre, pero no daba ni una gota.',
    etimologia: 'Su nombre viene de Nickel, un duende travieso de las minas alemanas.',
    curiosidad: 'Las monedas de 1 y 2 euros lo llevan, y a algunas personas les da alergia.',
  },
  {
    z: 2, // Helio
    informe: 'Se detectó primero fuera de la Tierra, durante un eclipse de 1868. Aquí no se encontró hasta casi tres décadas después.',
    etimologia: 'Su nombre viene del dios griego del Sol.',
    curiosidad: 'Es el único elemento que no se solidifica a presión normal, por mucho que se enfríe.',
  },
  {
    z: 62, // Samario
    informe: 'Lecoq de Boisbaudran lo descubrió en 1879 en un mineral bautizado en honor a un ingeniero de minas ruso.',
    etimologia: 'Viene del mineral samarskita, dedicado al ruso Samarski-Bykhovets.',
    curiosidad: 'Sus imanes aguantan mucho más calor que los de neodimio.',
  },
  {
    z: 55, // Cesio
    informe: 'Un segundo se define por él: exactamente 9 192 631 770 oscilaciones de uno de sus átomos.',
    etimologia: 'Su nombre viene del latín caesius, «gris azulado», por sus líneas espectrales.',
    curiosidad: 'Se funde a unos 28 °C: en un día de calor sería líquido.',
  },
  {
    z: 65, // Terbio
    informe: 'Mosander lo halló en 1843 como impureza de un óxido. Da el verde a las pantallas de los televisores antiguos.',
    etimologia: 'Su nombre sale de un trozo del nombre del pueblo sueco de Ytterby.',
    curiosidad: 'Se usa en aleaciones que cambian de forma con un campo magnético.',
  },
  {
    z: 19, // Potasio
    informe: 'En octubre de 1807, Davy hizo pasar corriente por una sal fundida y apareció un metal que ardía al tocar el agua. Los plátanos van sobrados de él.',
    etimologia: 'Su símbolo viene de kalium, del árabe qali, «cenizas».',
    curiosidad: 'Flota en el agua, que lo hace arder con una llama lila.',
  },
  {
    z: 47, // Plata
    informe: 'La leyenda dice que sus balas acaban con los hombres lobo. Es el metal que mejor conduce la electricidad.',
    etimologia: 'Su símbolo viene del latín argentum, que también dio nombre a Argentina.',
    curiosidad: 'Se ennegrece con los compuestos de azufre del aire.',
  },
  {
    z: 89, // Actinio
    informe: 'Debierne lo anunció en 1899 y Giesel lo aisló en 1902: aún se discute a quién dar el mérito.',
    etimologia: 'Su nombre viene del griego aktís, «rayo».',
    curiosidad: 'Da nombre a la serie de 15 elementos de la última fila.',
  },
  {
    z: 83, // Bismuto
    informe: 'Forma cristales en escalera con colores de arcoíris, y una famosa medicina rosa para el estómago lo lleva.',
    etimologia: 'Quizá venga del alemán weisse Masse, «masa blanca».',
    curiosidad: 'Hasta 2003 se creyó estable: su semivida supera mil millones de veces la edad del universo.',
  },
  {
    z: 64, // Gadolinio
    informe: 'Marignac lo detectó en 1880. Hoy se inyecta como contraste en muchas resonancias magnéticas.',
    etimologia: 'Su nombre honra a un químico finlandés, pionero de las tierras raras.',
    curiosidad: 'Pierde su fuerte magnetismo a unos 20 °C.',
  },
  {
    z: 87, // Francio
    informe: 'Marguerite Perey lo descubrió en 1939 en el Instituto Curie. Fue el último elemento hallado en la naturaleza.',
    etimologia: 'Su nombre es el de la patria de su descubridora.',
    curiosidad: 'Su isótopo más estable apenas dura unos 22 minutos.',
  },
  {
    z: 74, // Wolframio
    informe: 'Dos hermanos lo aislaron en 1783 en un seminario de Bergara. Su símbolo delata un nombre que en inglés casi nadie usa.',
    etimologia: 'Su otro nombre viene del sueco y significa «piedra pesada».',
    curiosidad: 'Es el metal con el punto de fusión más alto: unos 3422 °C.',
  },
  {
    z: 37, // Rubidio
    informe: 'Bunsen y Kirchhoff lo descubrieron en 1861 con su espectroscopio. Se funde a unos 39 °C, como un día de mucho calor.',
    etimologia: 'Su nombre viene del latín rubidus, «rojo oscuro», por sus líneas espectrales.',
    curiosidad: 'Se usa en relojes atómicos compactos.',
  },
  {
    z: 29, // Cobre
    informe: 'La Estatua de la Libertad es verde porque su piel de este metal ha ido cambiando de color con los años.',
    etimologia: 'Su nombre viene de Chipre: los romanos lo llamaban aes cyprium.',
    curiosidad: 'El hacha de Ötzi, la momia de hace unos 5300 años, es de este metal casi puro.',
  },
  {
    z: 34, // Selenio
    informe: 'Berzelius lo halló en 1817 en el lodo de una fábrica de ácido. Conduce mejor con la luz, por eso se usó en fotocopiadoras.',
    etimologia: 'Su nombre viene de Selene, la Luna en griego.',
    curiosidad: 'Lo necesitas en pequeñas dosis, y las nueces de Brasil van cargadas de él.',
  },
  {
    z: 23, // Vanadio
    informe: 'Del Río lo descubrió en México en 1801, pero le convencieron de que se equivocaba. Sefström lo redescubrió unos treinta años después.',
    etimologia: 'Su nombre viene de Vanadís, otro nombre de la diosa nórdica Freya.',
    curiosidad: 'Su primer gran uso industrial fue el acero del chasis del Ford T.',
  },
  {
    z: 70, // Iterbio
    informe: 'Marignac lo separó en 1878. Hoy mueve algunos de los relojes atómicos más precisos del mundo.',
    etimologia: 'Su nombre casi repite el del pueblo sueco de Ytterby.',
    curiosidad: 'Se usa en láseres industriales de fibra.',
  },
  {
    z: 113, // Nihonio
    informe: 'El equipo de Morita tardó casi una década en conseguir tres átomos. Es el primer elemento bautizado por un equipo asiático.',
    etimologia: 'Su nombre viene del nombre de Japón en japonés.',
    curiosidad: 'Lo creó el instituto japonés RIKEN.',
  },
  {
    z: 97, // Berkelio
    informe: 'El equipo de Seaborg lo obtuvo en 1949 bombardeando americio.',
    etimologia: 'Su nombre viene de la ciudad californiana donde se creó.',
    curiosidad: 'Unos 22 miligramos suyos sirvieron para crear el elemento 117.',
  },
  {
    z: 82, // Plomo
    informe: 'Una teoría muy discutida culpa de la caída de Roma a sus cañerías. Durante décadas se añadió a la gasolina.',
    etimologia: 'Su símbolo viene del latín plumbum.',
    curiosidad: 'Protege de la radiación en las salas de rayos X.',
  },
  {
    z: 103, // Lawrencio
    informe: 'Berkeley y Dubná comparten el mérito de crearlo, entre 1961 y 1971. Cierra la serie de los actínidos.',
    etimologia: 'Su nombre honra al inventor del ciclotrón.',
    curiosidad: 'Todavía se debate su lugar exacto en la tabla.',
  },
  {
    z: 53, // Yodo
    informe: 'Courtois lo halló en 1811 en cenizas de algas, mientras fabricaba salitre, muy buscado en las guerras napoleónicas.',
    etimologia: 'Su nombre viene de la palabra griega para «violeta», por el color de su vapor.',
    curiosidad: 'Sin él, la tiroides no funciona: por eso se añade a la sal.',
  },
  {
    z: 8, // Oxígeno
    informe: 'Scheele lo obtuvo primero y Priestley lo publicó antes, en 1774. Sin él no arde ninguna hoguera y tú aguantas muy poco.',
    etimologia: 'Significa «generador de ácidos»: Lavoisier creía, por error, que estaba en todos.',
    curiosidad: 'En estado líquido es azul pálido y lo atrae un imán.',
  },
  {
    z: 106, // Seaborgio
    informe: 'Se creó en 1974. Su nombre honra a alguien que seguía vivo al bautizarlo, algo que solo ha pasado dos veces.',
    etimologia: 'Su nombre homenajea a un químico pionero de los elementos sintéticos.',
    curiosidad: 'Su isótopo más estable dura solo unos minutos.',
  },
  {
    z: 50, // Estaño
    informe: 'Aleado con cobre dio paso a toda una edad. Con mucho frío se desmorona: es la «peste» que sufrían los viejos tubos de órgano.',
    etimologia: 'Su símbolo viene del latín stannum.',
    curiosidad: 'Al doblar una barra se oye un crujido: es el «grito» de sus cristales.',
  },
  {
    z: 93, // Neptunio
    informe: 'McMillan y Abelson lo crearon en 1940 en Berkeley: fue el primer elemento más allá del uranio.',
    etimologia: 'Su nombre viene del planeta que sigue a Urano.',
    curiosidad: 'Hay trazas naturales en los minerales de uranio.',
  },
  {
    z: 48, // Cadmio
    informe: 'Stromeyer lo descubrió en 1817 en un carbonato de zinc de una farmacia. En Japón fue un factor clave de la enfermedad itai-itai.',
    etimologia: 'Su nombre viene de cadmia, el antiguo nombre latino de la calamina.',
    curiosidad: 'Sus pigmentos amarillos estaban en la paleta de Monet.',
  },
  {
    z: 13, // Aluminio
    informe: 'En el siglo XIX era un lujo reservado a joyas y a la corte de Napoleón III. Hoy envuelve tu bocadillo.',
    etimologia: 'Su nombre viene del latín alumen, «sal amarga».',
    curiosidad: 'Reciclarlo ahorra alrededor del 95 % de la energía que cuesta producirlo.',
  },
  {
    z: 61, // Prometio
    informe: 'Marinsky, Glendenin y Coryell lo identificaron en 1945 entre los productos de fisión de un reactor de Oak Ridge.',
    etimologia: 'Su nombre viene del titán que robó el fuego a los dioses.',
    curiosidad: 'Es el único lantánido sin ningún isótopo estable.',
  },
  {
    z: 107, // Bohrio
    informe: 'Se creó en 1981 en Darmstadt, en el laboratorio alemán GSI.',
    etimologia: 'Su nombre honra al físico danés del modelo atómico.',
    curiosidad: 'Primero se propuso un nombre con el nombre y el apellido del físico.',
  },
  {
    z: 14, // Silicio
    informe: 'Berzelius lo aisló en 1824. Hoy da nombre a un valle de California y está en el corazón de cada chip.',
    etimologia: 'Su nombre viene del latín silex, «pedernal».',
    curiosidad: 'Es el segundo elemento más abundante de la corteza terrestre, tras el oxígeno.',
  },
  {
    z: 78, // Platino
    informe: 'Los españoles lo vieron en Colombia y lo tomaron por un estorbo en las minas de oro. Hoy es un metal precioso.',
    etimologia: 'Su nombre viene del español: «platina», plata pequeña.',
    curiosidad: 'El kilogramo patrón fue hasta 2019 un cilindro suyo con iridio.',
  },
  {
    z: 11, // Sodio
    informe: 'Davy lo aisló en 1807. Reacciona con violencia en el agua y, aun así, lo tomas cada día en la mesa.',
    etimologia: 'Su símbolo viene de natrium, por el natrón que los egipcios usaban para momificar.',
    curiosidad: 'Da el color amarillo a las viejas farolas de muchas ciudades.',
  },
  {
    z: 51, // Antimonio
    informe: 'Los antiguos egipcios se pintaban los ojos con su sulfuro. Hoy endurece las baterías de plomo.',
    etimologia: 'Su símbolo viene de stibium, el nombre latino de su mineral.',
    curiosidad: 'Reduce la contracción del metal fundido, por eso se usaba en tipos de imprenta.',
  },
  {
    z: 25, // Manganeso
    informe: 'Gahn lo aisló en 1774, pero los pintores de la Prehistoria ya usaban uno de sus óxidos como pigmento oscuro.',
    etimologia: 'Comparte origen con la magnesia, por una vieja confusión entre minerales.',
    curiosidad: 'Los vidrieros lo llamaban «jabón de vidrio» porque quitaba el tono verdoso.',
  },
  {
    z: 117, // Teneso
    informe: 'Se creó en 2010, bombardeando berkelio de Oak Ridge. Cierra el grupo de los halógenos, aunque quizá no se les parezca.',
    etimologia: 'Su nombre viene de un estado de EE. UU.',
    curiosidad: 'Es, hasta ahora, el elemento descubierto más recientemente.',
  },
  {
    z: 3, // Litio
    informe: 'Arfwedson lo encontró en 1817 en un mineral de la isla sueca de Utö. Hoy viaja en el bolsillo de casi todo el mundo.',
    etimologia: 'Su nombre viene del griego líthos, «piedra».',
    curiosidad: 'Es el metal menos denso: flota en el agua, aunque reacciona con ella.',
  },
  {
    z: 9, // Flúor
    informe: 'Varios químicos acabaron envenenados intentando aislarlo. Moissan lo logró en 1886 y ganó el Nobel veinte años después.',
    etimologia: 'Viene del latín fluere, «fluir»: un mineral suyo ayudaba a fundir metales.',
    curiosidad: 'Es el elemento más reactivo: reacciona incluso con gases nobles como el xenón.',
  },
  {
    z: 45, // Rodio
    informe: 'Wollaston lo descubrió en 1803. Es uno de los metales más caros del mundo y va en el catalizador de muchos coches.',
    etimologia: 'Su nombre viene del griego rhódon, «rosa», por el color de sus sales.',
    curiosidad: 'En 1979, Guinness regaló a Paul McCartney un disco bañado en este metal.',
  },
  {
    z: 95, // Americio
    informe: 'Se creó en EE. UU. en 1944. Hoy un detector de humo casero lleva una pizca de él.',
    etimologia: 'Su nombre viene de un continente, igual que el del europio.',
    curiosidad: 'La Agencia Espacial Europea estudia usarlo en sus sondas.',
  },
  {
    z: 38, // Estroncio
    informe: 'Se distinguió hacia 1790 en un mineral de un pueblo escocés. Da el rojo intenso a bengalas y fuegos artificiales.',
    etimologia: 'Su nombre viene de Strontian, un pueblo de Escocia.',
    curiosidad: 'Un isótopo suyo apareció en dientes de leche tras las pruebas nucleares.',
  },
  {
    z: 112, // Copernicio
    informe: 'Se creó en 1996 en Darmstadt. Su nombre se oficializó en 2010.',
    etimologia: 'Su nombre honra al astrónomo polaco que puso el Sol en el centro.',
    curiosidad: 'Se oficializó el día del cumpleaños del astrónomo, un 19 de febrero.',
  },
  {
    z: 17, // Cloro
    informe: 'El 22 de abril de 1915, en Ypres, una nube suya se usó como arma a gran escala. Hoy desinfecta las piscinas.',
    etimologia: 'Su nombre viene del griego khlorós, «verde pálido», por el color del gas.',
    curiosidad: 'Scheele lo obtuvo en 1774, pero hasta 1810 no se demostró que era un elemento.',
  },
  {
    z: 24, // Cromo
    informe: 'Vauquelin lo descubrió en 1797 en un mineral rojo anaranjado de los Urales. Da su rojo al rubí.',
    etimologia: 'Su nombre viene del griego khrôma, «color», por lo vistoso de sus compuestos.',
    curiosidad: 'El acero inoxidable no se oxida gracias a él.',
  },
  {
    z: 10, // Neón
    informe: 'Ramsay y Travers lo hallaron en 1898 al destilar aire líquido. En 1910 iluminó París en dos tubos rojos de doce metros.',
    etimologia: 'Su nombre significa «nuevo» en griego. Lo sugirió el hijo de Ramsay.',
    curiosidad: 'Su luz es rojo anaranjado: los rótulos de otros colores usan otros gases.',
  },
  {
    z: 27, // Cobalto
    informe: 'Brandt lo aisló hacia 1735. El azul de la porcelana china de la dinastía Ming se debe a él.',
    etimologia: 'Quizá venga de kobold, un duende de las minas alemanas.',
    curiosidad: 'Uno de sus isótopos se ha usado durante décadas en radioterapia.',
  },
  {
    z: 35, // Bromo
    informe: 'Balard lo sacó en 1826 de las salmueras del sur de Francia. Es un líquido rojizo con un olor insoportable.',
    etimologia: 'Su nombre viene de la palabra griega para «hedor».',
    curiosidad: 'El púrpura de Tiro, el tinte de los emperadores, es un compuesto suyo.',
  },
  {
    z: 108, // Hasio
    informe: 'Se creó en 1984 en Darmstadt. En 2001 se logró estudiar un compuesto gaseoso suyo con apenas unos átomos.',
    etimologia: 'Su nombre viene de Hassia, el nombre latino del estado alemán de Hesse.',
    curiosidad: 'Forma un tetróxido parecido al del osmio.',
  },
  {
    z: 96, // Curio
    informe: 'Seaborg reveló su existencia en 1945 respondiendo a un oyente de un concurso infantil de radio, antes del anuncio oficial.',
    etimologia: 'Su nombre homenajea a un matrimonio de científicos.',
    curiosidad: 'Se ha usado en los espectrómetros de los róveres de Marte.',
  },
  {
    z: 42, // Molibdeno
    informe: 'Durante siglos se confundió su mineral con plomo y con grafito. Scheele vio en 1778 que era otra cosa.',
    etimologia: 'Su nombre viene del griego mólybdos, «plomo».',
    curiosidad: 'La mayoría de las enzimas que fijan el nitrógeno del aire lo llevan.',
  },
  {
    z: 102, // Nobelio
    informe: 'Suecia lo anunció en 1957 y se retractó. Soviéticos y estadounidenses se disputaron luego el mérito durante décadas.',
    etimologia: 'Su nombre honra al inventor de la dinamita.',
    curiosidad: 'Se reconoció a Dubná como descubridora, pero se conservó el nombre sueco.',
  },
  {
    z: 43, // Tecnecio
    informe: 'Segrè y Perrier lo hallaron en 1937 en una pieza desechada de un ciclotrón. Fue el primer elemento obtenido artificialmente.',
    etimologia: 'Su nombre viene del griego tekhnētós, «artificial».',
    curiosidad: 'Se usa en unos diez millones de pruebas médicas al año.',
  },
  {
    z: 54, // Xenón
    informe: 'Ramsay y Travers lo hallaron en 1898. En 1962, Bartlett acabó con un dogma: este gas noble sí formaba compuestos.',
    etimologia: 'Su nombre viene del griego xénos, «extraño» o «extranjero».',
    curiosidad: 'Mueve sondas espaciales como Dawn gracias a sus motores iónicos.',
  },
  {
    z: 116, // Livermorio
    informe: 'Se creó en 2000 en Dubná, en colaboración con un laboratorio de California.',
    etimologia: 'Su nombre honra a un laboratorio californiano.',
    curiosidad: 'Sus átomos se desintegran en milisegundos.',
  },
  {
    z: 67, // Holmio
    informe: 'Cleve lo aisló, y Soret y Delafontaine lo vieron por su cuenta en 1878. Si llevas un rato jugando, lo has tenido delante todo el tiempo.',
    etimologia: 'Su nombre viene de Holmia, el nombre latino de Estocolmo.',
    curiosidad: 'Tiene el momento magnético más alto de los elementos naturales.',
  },
  {
    z: 80, // Mercurio
    informe: 'En el siglo XIX, muchos sombrereros acababan con temblores y delirios por respirar sus vapores mientras trabajaban el fieltro.',
    etimologia: 'Su símbolo viene del griego hydrárgyros, «plata líquida».',
    curiosidad: 'Almadén (Ciudad Real) fue durante siglos la mayor mina de este elemento del mundo.',
  },
  {
    z: 6, // Carbono
    informe: 'Se conoce desde la Antigüedad. Puede ser lo más blando de tu estuche o lo más duro de una joyería.',
    etimologia: 'Su nombre viene de la palabra latina para el carbón vegetal.',
    curiosidad: 'Uno de sus isótopos permite datar restos de hasta unos 50 000 años.',
  },
  {
    z: 85, // Astato
    informe: 'Corson, MacKenzie y Segrè lo crearon en 1940. En toda la corteza terrestre hay, como mucho, unos pocos gramos a la vez.',
    etimologia: 'Su nombre viene de la palabra griega para «inestable».',
    curiosidad: 'Es el elemento natural más raro de la corteza terrestre.',
  },
  {
    z: 77, // Iridio
    informe: 'Una fina capa suya de hace 66 millones de años puso sobre la pista del impacto que acabó con los dinosaurios.',
    etimologia: 'Su nombre viene de la diosa del arcoíris, por sus sales de muchos colores.',
    curiosidad: 'El metro patrón de París era una aleación suya con platino.',
  },
  {
    z: 114, // Flerovio
    informe: 'Se creó en 1999 en Dubná. Durante años se dudó de si se comportaba como un metal o como un gas noble.',
    etimologia: 'Su nombre honra a un laboratorio ruso, que a su vez lleva el nombre de Fliórov.',
    curiosidad: 'Sus isótopos más estables apenas duran unos segundos.',
  },
  {
    z: 46, // Paladio
    informe: 'Wollaston ofreció sus primeras muestras en 1803, sin dar su nombre, en una tienda del Soho. Chenevix dijo que era una aleación.',
    etimologia: 'Su nombre viene del asteroide Palas, recién descubierto.',
    curiosidad: 'Absorbe hidrógeno con una capacidad fuera de lo común.',
  },
  {
    z: 69, // Tulio
    informe: 'Cleve lo separó en 1879. Es uno de los lantánidos más escasos, y un isótopo suyo sirve para hacer radiografías portátiles.',
    etimologia: 'Su nombre viene de Thule, la tierra más septentrional de los mapas antiguos.',
    curiosidad: 'Brilla en azul bajo luz ultravioleta en los billetes de euro.',
  },
  {
    z: 90, // Torio
    informe: 'Berzelius lo descubrió en 1829 en un mineral noruego. Las viejas camisas de las lámparas de gas lo llevaban.',
    etimologia: 'Su nombre viene del dios nórdico del trueno.',
    curiosidad: 'Se estudia como combustible nuclear alternativo.',
  },
  {
    z: 60, // Neodimio
    informe: 'Está en casi todos los auriculares y en los motores de muchos coches eléctricos: con él se fabrican los imanes permanentes más potentes.',
    etimologia: 'Su nombre significa «gemelo nuevo»: durante años se confundió con su hermano dentro de una mezcla llamada didimio.',
    curiosidad: 'Lo separó en 1885 Carl Auer von Welsbach, el mismo que inventó la camisa incandescente de las lámparas de gas.',
  },
  {
    z: 99, // Einstenio
    informe: 'Apareció en 1952 entre los restos de la primera bomba de hidrógeno, en el atolón de Enewetak.',
    etimologia: 'Su nombre honra al físico de la relatividad.',
    curiosidad: 'Su descubrimiento se mantuvo en secreto durante años.',
  },
  {
    z: 110, // Darmstatio
    informe: 'Se creó en 1994 en el laboratorio GSI. Sus átomos duran segundos como mucho.',
    etimologia: 'Su nombre viene de la ciudad alemana donde se creó.',
    curiosidad: 'Se llamó provisionalmente ununnilio.',
  },
  {
    z: 86, // Radón
    informe: 'Se filtra desde el suelo a los sótanos sin color ni olor. Es la segunda causa de cáncer de pulmón, tras el tabaco.',
    etimologia: 'Su nombre viene del de otro elemento radiactivo, del que nace.',
    curiosidad: 'Galicia es una de las zonas de España con más presencia de este gas.',
  },
  {
    z: 15, // Fósforo
    informe: 'Un alquimista de Hamburgo lo encontró en 1669 buscando la piedra filosofal… hirviendo cubos y cubos de orina.',
    etimologia: 'En griego, su nombre significa «portador de luz».',
    curiosidad: 'Una de sus formas brilla en la oscuridad al reaccionar lentamente con el oxígeno del aire.',
  },
  {
    z: 63, // Europio
    informe: 'Demarçay lo detectó en 1896 y lo purificó en 1901. Su luminiscencia ayuda a proteger los billetes contra falsificaciones.',
    etimologia: 'Su nombre es el de un continente.',
    curiosidad: 'Daba el color rojo a los viejos televisores en color.',
  },
  {
    z: 32, // Germanio
    informe: 'Mendeléiev lo predijo como «eka-silicio». Winkler lo aisló en 1886, y el primer transistor se hizo con él.',
    etimologia: 'Su nombre viene de Germania, el nombre latino de Alemania.',
    curiosidad: 'Se usa en la fibra óptica y en las lentes de visión infrarroja.',
  },
  {
    z: 30, // Zinc
    informe: 'Protege del óxido farolas y vallas con una capa fina, y es uno de los dos metales del latón.',
    etimologia: 'Quizá venga del alemán Zinke, «diente», por la forma de sus cristales.',
    curiosidad: 'Cerca del 80 % de los tejados de París están cubiertos de este metal.',
  },
  {
    z: 118, // Oganesón
    informe: 'Es el último de la tabla: se creó en Dubná hacia 2002 y es el segundo con nombre de una persona viva.',
    etimologia: 'Su nombre honra al físico ruso Yuri Oganesián.',
    curiosidad: 'Pertenece a los gases nobles, aunque seguramente sería sólido.',
  },
  {
    z: 5, // Boro
    informe: 'Gay-Lussac, Thénard y Davy lo aislaron con días de diferencia en 1808. Hoy está en casi todo el vidrio de laboratorio.',
    etimologia: 'Su nombre viene de un mineral que los árabes llamaban buraq.',
    curiosidad: 'Muchas barras de control de reactores nucleares lo llevan porque absorbe neutrones.',
  },
  {
    z: 56, // Bario
    informe: 'Antes de una radiografía de estómago te dan a beber una papilla con él. También da el verde a los fuegos artificiales.',
    etimologia: 'Su nombre viene del griego barýs, «pesado».',
    curiosidad: 'Las piedras de Bolonia, que brillaban tras exponerse a la luz, lo contenían.',
  },
  {
    z: 39, // Itrio
    informe: 'Gadolin publicó en 1794 el análisis de una piedra negra de una cantera sueca. Fue la puerta de entrada a las tierras raras.',
    etimologia: 'Su nombre viene de Ytterby, el pueblo sueco que bautizó a cuatro elementos.',
    curiosidad: 'Un óxido suyo con bario y cobre fue clave en la superconductividad de 1987.',
  },
  {
    z: 71, // Lutecio
    informe: 'Urbain, Auer von Welsbach y James lo separaron casi a la vez hacia 1907. Es el último de su serie.',
    etimologia: 'Su nombre viene de Lutetia, el nombre romano de París.',
    curiosidad: 'Un isótopo suyo se usa contra el cáncer de próstata.',
  },
  {
    z: 88, // Radio
    informe: 'Las obreras que pintaban con él esferas de reloj afilaban el pincel con los labios. Muchas enfermaron.',
    etimologia: 'Su nombre viene del latín radius, «rayo».',
    curiosidad: 'Los cuadernos de Marie Curie siguen siendo radiactivos por su culpa.',
  },
  {
    z: 111, // Roentgenio
    informe: 'Se creó en 1994 en Darmstadt, pocas semanas después de su vecino anterior en la tabla.',
    etimologia: 'Su nombre honra al descubridor de los rayos X.',
    curiosidad: 'Se sitúa justo debajo del oro.',
  },
  {
    z: 58, // Cerio
    informe: 'Se descubrió en 1803 en Suecia y, ese mismo año, en Alemania. La chispa de tu mechero sale de una aleación suya.',
    etimologia: 'Su nombre viene de un asteroide descubierto dos años antes.',
    curiosidad: 'Su óxido se usa para pulir vidrio.',
  },
  {
    z: 22, // Titanio
    informe: 'Gregor lo detectó en 1791 en la arena negra de un arroyo de Cornualles. Hoy sustituye caderas sin que el cuerpo lo rechace.',
    etimologia: 'Su nombre recuerda a los gigantes de la mitología griega, hijos de Gea.',
    curiosidad: 'El Museo Guggenheim de Bilbao está recubierto de planchas de este metal.',
  },
  {
    z: 98, // Californio
    informe: 'Creado en 1950. Un solo microgramo emite millones de neutrones por segundo y ayuda a arrancar reactores.',
    etimologia: 'Su nombre viene de un estado de EE. UU.',
    curiosidad: 'Se usa para analizar pozos de petróleo.',
  },
  {
    z: 73, // Tantalio
    informe: 'Ekeberg lo descubrió en 1802. Tu móvil lo lleva en sus condensadores, y se extrae del coltán.',
    etimologia: 'Su nombre viene de un personaje mítico condenado a no poder beber nunca.',
    curiosidad: 'El cuerpo lo tolera tan bien que se usa en implantes.',
  },
  {
    z: 68, // Erbio
    informe: 'Mosander lo halló en 1843. Las señales de Internet por fibra óptica se amplifican con él.',
    etimologia: 'Su nombre sale de otro trozo del nombre del pueblo sueco de Ytterby.',
    curiosidad: 'Tiñe de rosa el vidrio y la porcelana.',
  },
  {
    z: 109, // Meitnerio
    informe: 'Se creó en 1982 en Darmstadt: el primer experimento detectó un solo átomo.',
    etimologia: 'Su nombre honra a la física austriaca codescubridora de la fisión nuclear.',
    curiosidad: 'Es el único elemento que honra solo a una mujer real.',
  },
  {
    z: 94, // Plutonio
    informe: 'El equipo de Seaborg lo creó a finales de 1940. La bomba de Nagasaki llevaba varios kilos de este metal.',
    etimologia: 'Su nombre viene del que entonces era el último planeta.',
    curiosidad: 'Un isótopo suyo da energía a las sondas Voyager.',
  },
  {
    z: 41, // Niobio
    informe: 'Hatchett lo halló en 1801 en un mineral de Connecticut y lo llamó columbio. El nombre actual no se fijó hasta mediados del siglo XX.',
    etimologia: 'Su nombre viene de Níobe, hija de Tántalo en el mito griego.',
    curiosidad: 'Los imanes superconductores del Gran Colisionador de Hadrones llevan cables con este metal.',
  },
  {
    z: 20, // Calcio
    informe: 'Davy lo aisló en 1808, pero los romanos ya construían con uno de sus compuestos. Lo llevas en los huesos.',
    etimologia: 'Su nombre viene del latín calx, «cal».',
    curiosidad: 'Es el metal más abundante del cuerpo humano.',
  },
  {
    z: 91, // Protactinio
    informe: 'Fajans y Göhring lo vieron en 1913, y Hahn y Meitner dieron en 1918 con su isótopo más estable.',
    etimologia: 'Su nombre significa «antes del actinio».',
    curiosidad: 'Su isótopo más estable se transforma en actinio.',
  },
  {
    z: 79, // Oro
    informe: 'Es de los elementos menos reactivos: por eso la máscara de Tutankamón sigue brillando más de 3000 años después.',
    etimologia: 'Su símbolo viene del latín aurum.',
    curiosidad: 'Todo lo extraído en la historia cabría en un cubo de unos 22,6 metros de lado.',
  },
  {
    z: 115, // Moscovio
    informe: 'Rusos y estadounidenses lo anunciaron en 2004. Hasta ahora se ha observado poco más de un centenar de átomos.',
    etimologia: 'Su nombre viene de la región de la capital rusa.',
    curiosidad: 'Su existencia se aprobó oficialmente en 2015.',
  },
  {
    z: 4, // Berilio
    informe: 'Los espejos del telescopio James Webb están hechos de este metal ligero, con una finísima capa de oro encima.',
    etimologia: 'Su nombre viene de la gema en la que se halló, pariente de la esmeralda.',
    curiosidad: 'Durante décadas se llamó glucinio, porque sus sales sabían dulces. Y son muy tóxicas.',
  },
  {
    z: 100, // Fermio
    informe: 'También salió de la primera bomba de hidrógeno, en 1952. Su número es redondo.',
    etimologia: 'Su nombre honra al físico italiano que construyó el primer reactor nuclear.',
    curiosidad: 'Es el elemento más pesado que puede crearse por captura de neutrones.',
  },
  {
    z: 81, // Talio
    informe: 'Crookes y Lamy lo hallaron por separado en 1861. Sus sales apenas saben a nada: lo llaman «el veneno de los envenenadores».',
    etimologia: 'Su nombre viene del griego thallós, «brote verde».',
    curiosidad: 'Una novela de Agatha Christie ayudó a una enfermera a detectar un envenenamiento real.',
  },
  {
    z: 26, // Hierro
    informe: 'Los primeros objetos hechos con él venían de meteoritos, como una daga de Tutankamón. Tu sangre es roja gracias a él.',
    etimologia: 'Su símbolo viene del latín ferrum.',
    curiosidad: 'El núcleo de la Tierra está hecho sobre todo de este metal.',
  },
  {
    z: 18, // Argón
    informe: 'Rayleigh notó que el nitrógeno del aire pesaba más de lo esperado. En 1894, con Ramsay, descubrió por qué.',
    etimologia: 'Su nombre viene del griego argós, «perezoso» o «inactivo»: casi no reacciona.',
    curiosidad: 'Es el tercer gas más abundante del aire: cerca del 1 %.',
  },
  {
    z: 105, // Dubnio
    informe: 'Dubná y Berkeley se disputaron su creación hacia 1970, y su nombre no se fijó hasta 1997.',
    etimologia: 'Su nombre viene de la ciudad rusa donde está el instituto nuclear JINR.',
    curiosidad: 'Berkeley propuso llamarlo hahnio, y siguió usando ese nombre durante años.',
  },
  {
    z: 101, // Mendelevio
    informe: 'Se creó en 1955 átomo a átomo: el equipo de Berkeley obtuvo solo 17.',
    etimologia: 'Su nombre honra al creador de la tabla periódica.',
    curiosidad: 'Lo bautizaron en honor a un ruso en plena Guerra Fría.',
  },
  {
    z: 75, // Renio
    informe: 'Noddack, Tacke y Berg lo identificaron en 1925, aunque Ogawa ya lo había tenido delante en 1908 sin saber qué era.',
    etimologia: 'Su nombre viene del río Rin, en latín Rhenus.',
    curiosidad: 'Sus aleaciones soportan el calor de las turbinas de avión.',
  },
  {
    z: 92, // Uranio
    informe: 'Klaproth lo halló en 1789 en la pechblenda. En 1896, Becquerel descubrió la radiactividad gracias a sus sales.',
    etimologia: 'Su nombre viene del planeta descubierto ocho años antes.',
    curiosidad: 'Tiñe de amarillo un vidrio que brilla bajo luz ultravioleta.',
  },
  {
    z: 66, // Disprosio
    informe: 'Lecoq de Boisbaudran lo identificó en 1886 tras unos treinta intentos. Su nombre cuenta lo mucho que le costó.',
    etimologia: 'Su nombre viene del griego dysprósitos, «difícil de conseguir».',
    curiosidad: 'Se añade a los imanes de los motores de los coches eléctricos.',
  },
  {
    z: 52, // Telurio
    informe: 'Müller von Reichenstein lo encontró en 1782 en una mina de oro de Transilvania, sin saber qué era.',
    etimologia: 'Su nombre viene del latín tellus, «tierra».',
    curiosidad: 'Da aliento a ajo: unos voluntarios que lo tomaron aún olían ocho meses después.',
  },
  {
    z: 104, // Rutherfordio
    informe: 'Dubná dijo haberlo creado en 1964 y Berkeley, en 1969. Hoy comparten el mérito. Es el primero tras los actínidos.',
    etimologia: 'Su nombre honra al físico neozelandés considerado padre de la física nuclear.',
    curiosidad: 'Los soviéticos lo llamaban kurchatovio.',
  },
  {
    z: 7, // Nitrógeno
    informe: 'Rutherford lo aisló en 1772. Casi cuatro de cada cinco moléculas que respiras son suyas, y tu cuerpo las devuelve tal cual.',
    etimologia: 'Significa «generador de nitro». Lavoisier prefirió llamarlo ázoe, «sin vida».',
    curiosidad: 'Hierve a unos −196 °C: en estado líquido se usa para congelar al instante.',
  },
  {
    z: 33, // Arsénico
    informe: 'Fue el veneno preferido de tantos herederos impacientes que lo apodaron «polvo de la herencia».',
    etimologia: 'Viene del árabe al-zarnij, «el oropimente», que en griego se transformó en arsenikón.',
    curiosidad: 'En la década de 1830, Marsh ideó una prueba que delataba este veneno.',
  },
  {
    z: 84, // Polonio
    informe: 'Marie y Pierre Curie lo hallaron en 1898. En 2006 envenenó en Londres al exespía Litvinenko.',
    etimologia: 'Marie Curie le puso el nombre de su patria.',
    curiosidad: 'Un gramo supera los 500 °C por su propia radiactividad.',
  },
  {
    z: 76, // Osmio
    informe: 'Tennant lo halló en 1803 en los residuos del platino. Es el elemento estable más denso.',
    etimologia: 'Su nombre viene del griego osmé, «olor», por el de uno de sus óxidos.',
    curiosidad: 'Sus aleaciones daban dureza a las puntas de las plumas estilográficas.',
  },
];

// Fecha del Caso nº 1 (provisional para el prototipo).
// ⚠️ TEMPORAL: adelantada al 1 de octubre para tener un mes y pico de casos en el archivo de prueba.
export const FECHA_CASO_1 = '2026-10-01';

const DIA_MS = 86_400_000;

/** Fecha local en formato AAAA-MM-DD. */
export function fechaLocal(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Número de caso para una fecha local (1 = FECHA_CASO_1). */
export function numeroDeCaso(fecha = fechaLocal()) {
  const [a, m, d] = fecha.split('-').map(Number);
  const [a1, m1, d1] = FECHA_CASO_1.split('-').map(Number);
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(a1, m1 - 1, d1)) / DIA_MS) + 1;
}

/** Caso por número (1, 2, 3…). Tras el último, el calendario vuelve a empezar. */
export function casoPorNumero(numero) {
  return { numero, ...CASOS[(numero - 1) % CASOS.length] };
}

/** Fecha (local, a medianoche) en la que se publicó el caso `numero`. */
export function fechaDeCaso(numero) {
  const [a, m, d] = FECHA_CASO_1.split('-').map(Number);
  return new Date(a, m - 1, d + numero - 1);
}

/** Número del caso de hoy. En el prototipo, ?caso=N lo fuerza (para probar). */
export function numeroDeHoy() {
  const forzado = Number(new URLSearchParams(location.search).get('caso'));
  return forzado >= 1 ? Math.floor(forzado) : Math.max(1, numeroDeCaso());
}

/** Caso del día. */
export function casoDelDia() {
  return casoPorNumero(numeroDeHoy());
}

/** Milisegundos hasta la próxima medianoche local. */
export function msHastaManana(ahora = new Date()) {
  const m = new Date(ahora);
  m.setHours(24, 0, 0, 0);
  return m - ahora;
}

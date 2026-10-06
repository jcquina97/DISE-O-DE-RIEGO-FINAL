import { CatalogItem } from '../types/irrigation';

export const CATALOGS_DATABASE: CatalogItem[] = [
  // 1. EMISORES Y LATERALES DE GOTEO
  {
    id: 'netafim_drip',
    manufacturer: 'Netafim (Orbia Precision Agriculture)',
    category: 'Emisores y Laterales de Goteo',
    title: 'Manual Técnico de Líneas de Goteo UniRam™ y DripNet PC™',
    description: 'Catálogo de especificaciones técnicas completas de mangueras de goteo autocompensantes (PC) y antidrenantes (AS/CNL). Tablas de caudales, ecuaciones de descarga, presiones máximas de trabajo y longitudes máximas de lateral recomendadas.',
    url: 'https://www.netafim.com/en/products-and-solutions/product-offering/drip-irrigation-products/',
    badge: 'Líder Global Goteo',
    officialSiteUrl: 'https://www.netafim.com'
  },
  {
    id: 'rivulis_d5000',
    manufacturer: 'Rivulis Irrigation',
    category: 'Emisores y Laterales de Goteo',
    title: 'Catálogo Técnico Rivulis D5000 PC & T-Tape Drip Tape',
    description: 'Manual de diseño agronómico para cinta de goteo T-Tape y goteros integrados D5000 PC y Hydro PC. Curvas Q-H, espesores de pared (mil), distanciamientos y factores de fricción para modelación hidráulica.',
    url: 'https://www.rivulis.com/products/heavy-wall-drip-lines/d5000-pc-drip-line/',
    badge: 'Goteros PC y Cintas',
    officialSiteUrl: 'https://www.rivulis.com'
  },
  {
    id: 'toro_aquatraxx',
    manufacturer: 'The Toro Company (Ag Irrigation)',
    category: 'Emisores y Laterales de Goteo',
    title: 'Guía de Diseño Toro Aqua-Traxx® & Neptune® Drip',
    description: 'Catálogo oficial de mangueras y cintas con laberinto de flujo turbulento de precisión PBX. Tablas de cálculo de uniformidad de distribución (EU) y pérdidas de carga en mangueras lisas de polietileno virgen.',
    url: 'https://www.toro.com/en/agriculture/drip-irrigation',
    badge: 'Cintas de Alta Precisión',
    officialSiteUrl: 'https://www.toro.com'
  },
  {
    id: 'jain_amnon',
    manufacturer: 'Jain Irrigation Systems Ltd.',
    category: 'Emisores y Laterales de Goteo',
    title: 'Ficha Técnica Jain AmnonDrip™ & Turbo Top PC',
    description: 'Especificaciones de goteros planos integrados y de botón con diafragma de silicona inyectada. Coeficientes de variación de fabricación (CV < 0.03) certificados por norma ISO 9261.',
    url: 'https://www.jains.com/irrigation/drip%20irrigation.htm',
    badge: 'Micro-riego Certificado',
    officialSiteUrl: 'https://www.jains.com'
  },

  // 2. ASPERSIÓN Y MICROASPERSIÓN
  {
    id: 'rainbird_ag',
    manufacturer: 'Rain Bird Agriculture',
    category: 'Aspersión y Microaspersión',
    title: 'Catálogo Agrícola Rain Bird Serie LF™ y Cañones de Riego',
    description: 'Manual de ingeniería para aspersores de impacto Serie LF (LF1200 / LF2400) y cañones SR2005. Tablas de distribución pluviométrica, coeficientes de uniformidad de Christiansen (CU), boquillas intercambiables y deflectores de trayectoria.',
    url: 'https://www.rainbird.com/agriculture',
    badge: 'Aspersión Profesional',
    officialSiteUrl: 'https://www.rainbird.com'
  },
  {
    id: 'senninger_wobbler',
    manufacturer: 'Senninger Irrigation (Hunter Industries)',
    category: 'Aspersión y Microaspersión',
    title: 'Manual de Aplicación Senninger i-Wob2® & Mini-Wobbler®',
    description: 'Tecnología de aspersión rotativa oscilante de baja presión (10 a 20 psi / 0.7 a 1.4 bar). Curvas de tamaño de gota para mitigación de deriva por viento, espaciamientos recomendados y reguladores de presión en línea.',
    url: 'https://www.senninger.com/irrigation-products',
    badge: 'Baja Presión Wobbler',
    officialSiteUrl: 'https://www.senninger.com'
  },
  {
    id: 'nelson_rotator',
    manufacturer: 'Nelson Irrigation Corporation',
    category: 'Aspersión y Microaspersión',
    title: 'Catálogo Nelson Rotator® R2000LP & Big Gun®',
    description: 'Ingeniería de aspersores Rotator sin sellos mecánicos para cobertura total en frutales y cultivos en hileras. Curvas de presión-descarga y software de simulación de superposición pluviométrica Overlap.',
    url: 'https://www.nelsonirrigation.com/products',
    badge: 'Rotator & Cañones',
    officialSiteUrl: 'https://www.nelsonirrigation.com'
  },

  // 3. FILTRACIÓN Y TRATAMIENTO DE AGUA
  {
    id: 'amiad_filters',
    manufacturer: 'Amiad Water Systems',
    category: 'Filtración y Tratamiento',
    title: 'Catálogo de Filtración Automática de Malla Amiad Sigma & Mini Sigma',
    description: 'Sistemas de filtrado autolimpiantes por escáner de succión para cabezales de riego agrícola. Dimensionamiento según sólidos suspendidos totales (TSS), caudales nominales de 30 a 300 m³/h y grado de filtración de 80 a 300 micras.',
    url: 'https://www.amiad.com/products/mini-sigma/',
    badge: 'Filtros de Malla Automáticos',
    officialSiteUrl: 'https://www.amiad.com'
  },
  {
    id: 'azud_helix',
    manufacturer: 'Sistema Azud S.A.',
    category: 'Filtración y Tratamiento',
    title: 'Manual Técnico de Baterías de Discos Azud Helix Automatic',
    description: 'Filtración profunda por compresión de discos ranurados con efecto helicoidal centrífugo. Mínimo consumo de agua de contralavado, dimensionamiento modular y curvas de pérdida de carga limpia versus sucia.',
    url: 'https://azud.com/categoria-producto/agricultura/filtracion-agricola/',
    badge: 'Filtración por Anillas',
    officialSiteUrl: 'https://azud.com'
  },
  {
    id: 'netafim_sand_media',
    manufacturer: 'Netafim Water Treatment',
    category: 'Filtración y Tratamiento',
    title: 'Baterías de Filtros de Grava / Arena de Cuarzo Netafim Media',
    description: 'Diseño para aguas superficiales con alta carga orgánica, algas y limos procedentes de canales abiertos o balsas de almacenamiento. Tasas de filtración superficial (40 a 60 m/h) y valvulería de contralavado tridireccional.',
    url: 'https://www.netafim.com/en/products-and-solutions/product-offering/filtration/',
    badge: 'Filtros de Arena y Grava',
    officialSiteUrl: 'https://www.netafim.com'
  },

  // 4. VÁLVULAS HIDRÁULICAS, VENTOSAS Y PROTECCIÓN
  {
    id: 'bermad_valves',
    manufacturer: 'Bermad Water Technologies',
    category: 'Válvulas Hidráulicas y Ventosas',
    title: 'Catálogo de Ingeniería Bermad Serie 100 & 400 y Ventosas C30/C70',
    description: 'Válvulas de control hidráulico por diafragma para apertura/cierre eléctrico, reducción de presión aguas abajo (PRV), sostenedoras y alivio de sobrepresión. Manual de cálculo de ventosas cinéticas y trifuncionales para purga y admisión de aire.',
    url: 'https://www.bermad.com/products/irrigation-valves/',
    badge: 'Válvulas & Ventosas Aire',
    officialSiteUrl: 'https://www.bermad.com'
  },
  {
    id: 'dorot_aquestia',
    manufacturer: 'Dorot Control Valves (Aquestia)',
    category: 'Válvulas Hidráulicas y Ventosas',
    title: 'Manual de Válvulas Agrícolas Dorot Serie 300 & 100 de Paso Total',
    description: 'Válvulas automáticas plásticas y de hierro dúctil para sectorización de riego. Tablas de coeficiente de caudal Kv/Cv, pérdida de carga por estrangulamiento y guías de selección contra golpe de ariete.',
    url: 'https://www.aquestia.com/dorot/',
    badge: 'Válvulas Reguladoras',
    officialSiteUrl: 'https://www.aquestia.com'
  },
  {
    id: 'senninger_regulators',
    manufacturer: 'Senninger Irrigation',
    category: 'Válvulas Hidráulicas y Ventosas',
    title: 'Guía Técnica de Reguladores de Presión Senninger PRU / PMV / PRL',
    description: 'Reguladores de presión mecánicos prefijados (6, 10, 15, 20, 30, 40 psi) para instalación en cabezas de laterales o manifolds. Mantienen presión constante independientemente de variaciones topográficas del terreno.',
    url: 'https://www.senninger.com/irrigation-products/pressure-regulators',
    badge: 'Reguladores en Línea',
    officialSiteUrl: 'https://www.senninger.com'
  },

  // 5. TUBERÍAS Y CONDUCCIÓN
  {
    id: 'plasson_fittings',
    manufacturer: 'Plasson Agricultural Fittings',
    category: 'Tuberías y Conducción',
    title: 'Catálogo de Accesorios de Compresión y Electrofusión Plasson PEAD',
    description: 'Manual de uniones mecánicas estancas para tuberías de Polietileno de Alta Densidad (PE80 / PE100) hasta PN16. Collarines de toma con salida roscada para conexión directa de laterales y válvulas de purga.',
    url: 'https://www.plasson.com/products/ag-irrigation/',
    badge: 'Accesorios PEAD / PP',
    officialSiteUrl: 'https://www.plasson.com'
  },
  {
    id: 'molecor_tom_pvc',
    manufacturer: 'Molecor Tecnología de Conducción',
    category: 'Tuberías y Conducción',
    title: 'Manual Técnico de Tuberías de PVC Orientado (PVC-O) Clase 500 TOM®',
    description: 'Tuberías de alta resistencia mecánica al golpe de ariete y máxima capacidad hidráulica (C=150 Hazen-Williams) para redes matrices primarias de impulsión en regadíos comunitarios e individuales.',
    url: 'https://molecor.com/es/tom-tuberia-pvc-o',
    badge: 'Tubería Matriz PVC-O',
    officialSiteUrl: 'https://molecor.com'
  },
  {
    id: 'georg_fischer_ag',
    manufacturer: 'GF Piping Systems (Georg Fischer)',
    category: 'Tuberías y Conducción',
    title: 'Sistemas de Conducción Termoplástica GF para Riego e Industria',
    description: 'Válvulas de mariposa, válvulas de retención / cheque antiretorno, medidores de flujo electromagnéticos y tuberías plásticas de alta durabilidad química contra fertilizantes y ácidos.',
    url: 'https://www.gfps.com/en-us/products-solutions.html',
    badge: 'Sistemas Conducción GF',
    officialSiteUrl: 'https://www.gfps.com'
  },

  // 6. BOMBAS Y GRUPOS DE PRESIÓN
  {
    id: 'grundfos_ag',
    manufacturer: 'Grundfos Pumps',
    category: 'Bombas y Grupos de Presión',
    title: 'Catálogo y Herramienta de Selección Grundfos Product Center (Bombas NB/NK/SP)',
    description: 'Curvas características Q-H, NPSH requerido, rendimiento hidráulico y potencias de motor para electrobombas centrífugas normalizadas monobloc/bancada y bombas sumergibles para pozos profundos.',
    url: 'https://product-selection.grundfos.com/',
    badge: 'Bombas & Curvas Q-H',
    officialSiteUrl: 'https://www.grundfos.com'
  },
  {
    id: 'franklin_electric',
    manufacturer: 'Franklin Electric',
    category: 'Bombas y Grupos de Presión',
    title: 'Manual Técnico de Motores Sumergibles y Bombas Multietapa FPS',
    description: 'Curvas de operación para captaciones subterráneas en agricultura. Dimensionamiento de cables eléctricos, arrancadores suaves y variadores de frecuencia VFD SubDrive Solar.',
    url: 'https://franklinwater.com/products/agricultural-irrigation/',
    badge: 'Bombeo Pozos Profundos',
    officialSiteUrl: 'https://franklinwater.com'
  },
  {
    id: 'pedrollo_ag',
    manufacturer: 'Pedrollo S.p.A.',
    category: 'Bombas y Grupos de Presión',
    title: 'Catálogo de Electrobombas Centrífugas Bridadas Pedrollo F & HF',
    description: 'Bombas centrífugas de medio y alto caudal diseñadas para distribución y riego por aspersión/goteo desde depósitos, balsas o ríos. Tablas de caudal de 100 a 4000 l/min.',
    url: 'https://www.pedrollo.com/es/productos',
    badge: 'Bombas de Alto Caudal',
    officialSiteUrl: 'https://www.pedrollo.com'
  },

  // 7. AUTOMATIZACIÓN Y FERTIRRIEGO
  {
    id: 'dosatron_fert',
    manufacturer: 'Dosatron International',
    category: 'Automatización y Fertirriego',
    title: 'Catálogo de Bombas Dosificadoras Proporcionales Hidráulicas Dosatron',
    description: 'Inyección de fertilizantes solubles y correctores de pH sin electricidad, accionadas únicamente por la presión del caudal de agua de la red de riego. Ratios de inyección de 0.2% a 10%.',
    url: 'https://www.dosatron.com/en-us/markets/agriculture-irrigation',
    badge: 'Dosificación Proporcional',
    officialSiteUrl: 'https://www.dosatron.com'
  },
  {
    id: 'mazzei_venturi',
    manufacturer: 'Mazzei Injector Company',
    category: 'Automatización y Fertirriego',
    title: 'Tablas de Rendimiento de Inyectores Venturi Mazzei®',
    description: 'Cálculo de caudal de succión de fertilizante líquido mediante efecto Venturi por presión diferencial. Curvas de pérdida de carga requerida y tablas de orificios de calibración.',
    url: 'https://mazzei.net/agricultural-irrigation-chemigation/',
    badge: 'Inyectores Venturi',
    officialSiteUrl: 'https://mazzei.net'
  },
  {
    id: 'hunter_acc',
    manufacturer: 'Hunter Industries Commercial Ag',
    category: 'Automatización y Fertirriego',
    title: 'Controladores y Programadores Agrícolas Hunter ACC2 / Node BT',
    description: 'Programadores de riego decodificadores a dos hilos para control de hasta 99 electroválvulas en campo. Integración con sondas de humedad volumétrica del suelo y estaciones meteorológicas.',
    url: 'https://www.hunterindustries.com/irrigation-product/controllers',
    badge: 'Programadores de Riego',
    officialSiteUrl: 'https://www.hunterindustries.com'
  }
];

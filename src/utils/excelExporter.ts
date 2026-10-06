import * as XLSX from 'xlsx';
import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';
import { CROPS_DATABASE } from '../data/cropsData';
import { SOIL_DATABASE } from '../data/soilData';
import { CATALOGS_DATABASE } from '../data/catalogsData';

export function exportProjectToExcel(data: ProjectData, results: CalculationResults) {
  const wb = XLSX.utils.book_new();

  const setColWidths = (ws: XLSX.WorkSheet, widths: number[]) => {
    ws['!cols'] = widths.map((w) => ({ wch: w }));
  };

  // =========================================================================
  // HOJA 1: CALCULADORA RÁPIDA DE DISEÑO (PANEL DINÁMICO EDITABLE)
  // =========================================================================
  // Diseñada con dos columnas paralelas:
  // - LADO IZQUIERDO (Col A-D): Solo se editan los datos del lugar y cultivo.
  // - LADO DERECHO (Col F-I): Fórmulas automáticas que se recalculan solas.
  const sheet1Data: any[][] = [
    ['HYDROAGRO DESIGN SUITE - CALCULADORA UNIVERSAL DE RIEGO PRESURIZADO'],
    ['INSTRUCCIÓN: Solo edite las celdas de la Columna C (Datos de Lugar y Cultivo). Todas las fórmulas de la Columna G se recalculan automáticamente sin reescribir nada.'],
    [],
    [
      'SECCIÓN',
      'PARÁMETRO DE ENTRADA (EDITAR AQUÍ)',
      'VALOR',
      'UNIDAD',
      '',
      'CÁLCULO AUTOMÁTICO (FÓRMULA NATIVA)',
      'RESULTADO',
      'UNIDAD',
      'FÓRMULA MATEMÁTICA / CRITERIO'
    ],
    // Fila 5:
    [
      'A. General',
      'Nombre del Proyecto / Finca',
      data.projectName,
      '-',
      '',
      '1. Evapotranspiración Cultivo (ETc)',
      { t: 'n', f: 'C13 * C20', v: results.etcMmDay },
      'mm/día',
      '=ETo * Kc (Demanda neta del dosel)'
    ],
    // Fila 6:
    [
      'A. General',
      'Ubicación / Lugar del Proyecto',
      data.location,
      '-',
      '',
      '2. Coeficiente Reducción (Kr Fereres)',
      { t: 'n', f: 'MIN(1.0, 1.34 * SQRT(C25 / 100))', v: results.krFactor },
      'adimensional',
      '=MIN(1.0, 1.34*SQRT(Cc/100)) por sombra'
    ],
    // Fila 7:
    [
      'A. General',
      'Superficie Total del Predio (Área)',
      data.totalAreaHa,
      'ha',
      '',
      '3. Necesidad Neta de Riego (Nn)',
      { t: 'n', f: 'MAX(0.1, (G5 * G6) - C14)', v: results.netIrrigationMmDay },
      'mm/día',
      '=(ETc * Kr) - Pe (Lámina neta a infiltrar)'
    ],
    // Fila 8:
    [
      'A. General',
      'Número de Sectores / Turnos',
      data.sectorsCount,
      'sectores',
      '',
      '4. Requerimiento Lavado Sales (LR)',
      { t: 'n', f: 'MAX(0, C15 / (5 * C26 - C15))', v: results.leachingRequirementLR },
      'fracción',
      '=ECw / (5*ECe - ECw) control salino'
    ],
    // Fila 9:
    [
      'A. General',
      'Proyectista Responsable',
      data.designerName,
      '-',
      '',
      '5. Necesidad Bruta de Riego (Nb)',
      { t: 'n', f: 'G7 / ((C16 / 100) * (1 - MIN(0.25, G8)))', v: results.grossIrrigationMmDay },
      'mm/día',
      '=Nn / [Ea * (1 - LR)] (Gasto en emisor)'
    ],
    // Fila 10:
    [
      'A. General',
      'Tipo de Sistema Presurizado',
      data.systemType,
      '-',
      '',
      '6. Retención Total en Suelo (TAW)',
      { t: 'n', f: '10 * (C29 - C30) / 100 * C31 * C21 * 10', v: results.tawMm },
      'mm',
      '=10 * (CC - PMP)/100 * Da * Zr * 10'
    ],
    [],
    // Fila 12:
    [
      'B. Lugar/Clima',
      'Evapotranspiración ETo de Referencia',
      data.etoMmDay,
      'mm/día',
      '',
      '7. Agua Útil en Bulbo Mojado (RAW)',
      { t: 'n', f: 'G10 * C22 * (C17 / 100)', v: results.rawMm },
      'mm',
      '=TAW * p * (Pw / 100) reserva sin estrés'
    ],
    // Fila 13:
    [
      'B. Lugar/Clima',
      'Precipitación Efectiva Local (Pe)',
      data.effectiveRainfallMmDay,
      'mm/día',
      '',
      '8. Frecuencia Máxima de Riego',
      { t: 'n', f: 'MAX(1, INT(G12 / G7))', v: results.maxIrrigationIntervalDays },
      'días',
      '=INT(RAW / Nn) intervalo agronómico'
    ],
    // Fila 14:
    [
      'B. Lugar/Clima',
      'Salinidad del Agua de Riego (ECw)',
      data.waterSalinityECw,
      'dS/m',
      '',
      '9. Frecuencia de Riego Programada',
      { t: 'n', f: 'MIN(G13, 1)', v: results.selectedIntervalDays },
      'día(s)',
      '=MIN(Fr_max, 1) alta frecuencia goteo'
    ],
    // Fila 15:
    [
      'B. Lugar/Clima',
      'Eficiencia de Aplicación del Sistema (Ea)',
      data.applicationEfficiencyPerc,
      '%',
      '',
      '10. Tasa Horaria de Aplicación (Ia)',
      { t: 'n', f: 'C39 / (C42 * C23)', v: results.hourlyApplicationRateMmH },
      'mm/h',
      '=qe / (Se * Sl) entrega del gotero'
    ],
    // Fila 16:
    [
      'B. Lugar/Clima',
      'Porcentaje de Suelo Humedecido (Pw)',
      data.wettedAreaPercent,
      '%',
      '',
      '11. Control Escorrentía (Ia <= Ib)',
      { t: 's', f: 'IF(G15 <= C32, "CUMPLE (Sin Escorrentía)", "ALERTA (Riesgo Charco)")', v: results.infiltrationFeasible ? 'CUMPLE (Sin Escorrentía)' : 'ALERTA (Riesgo Charco)' },
      'estado',
      '=IF(Ia <= Ib Suelo, OK, ALERTA)'
    ],
    [],
    // Fila 18:
    [
      'C. Cultivo',
      'Nombre del Cultivo (Ver Hoja 2)',
      data.crop.name,
      '-',
      '',
      '12. Tiempo de Riego por Turno (Tr)',
      { t: 'n', f: '(G9 * G14) / G15', v: results.irrigationDurationHoursPerShift },
      'horas/turno',
      '=(Nb * Fr) / Ia duración por sector'
    ],
    // Fila 19:
    [
      'C. Cultivo',
      'Fase Fenológica Activa',
      data.cropPhase,
      '-',
      '',
      '13. Jornada Total de Bombeo Diaria',
      { t: 'n', f: 'G18 * C8', v: results.dailyOperatingHoursRequired },
      'horas/día',
      '=Tr * Número_Sectores'
    ],
    // Fila 20:
    [
      'C. Cultivo',
      'Coeficiente Kc Efectivo',
      results.kcEffective,
      '-',
      '',
      '14. Factibilidad Operativa Bombeo',
      { t: 's', f: 'IF(G19 <= C57, "FACTIBLE (Dentro de Horas)", "ALERTA (Excede Horas)")', v: results.dailyOperationFeasible ? 'FACTIBLE (Dentro de Horas)' : 'ALERTA (Excede Horas)' },
      'estado',
      '=IF(Jornada <= Horas_permitidas, OK, ALERTA)'
    ],
    // Fila 21:
    [
      'C. Cultivo',
      'Profundidad Radical Activa (Zr)',
      data.crop.rootDepthM,
      'm',
      '',
      '15. Superficie por Sector / Turno',
      { t: 'n', f: 'C7 / C8', v: results.sectorAreaHa },
      'ha',
      '=Superficie_Total / Sectores'
    ],
    // Fila 22:
    [
      'C. Cultivo',
      'Agotamiento Admisible (p)',
      data.crop.depletionP,
      'fracción',
      '',
      '16. Emisores por Lateral',
      { t: 'n', f: 'INT(C44 / C42)', v: results.emittersPerLateral },
      'goteros',
      '=INT(Longitud_lateral / Se)'
    ],
    // Fila 23:
    [
      'C. Cultivo',
      'Distancia Entre Hileras (Sl)',
      data.crop.rowSpacingM,
      'm',
      '',
      '17. Caudal del Lateral (L/s)',
      { t: 'n', f: '(G22 * C39) / 3600', v: results.lateralFlowLps },
      'L/s',
      '=(N_emisores * qe) / 3600'
    ],
    // Fila 24:
    [
      'C. Cultivo',
      'Distancia Entre Plantas (Sp)',
      data.crop.plantSpacingM,
      'm',
      '',
      '18. Factor Christiansen F (m=1.852)',
      { t: 'n', f: '(1 / 2.852) + (1 / (2 * G22)) + (SQRT(0.852) / (6 * (G22^2)))', v: results.christiansenF },
      'adimensional',
      '=Reductor salidas múltiples Hazen-Williams'
    ],
    // Fila 25:
    [
      'C. Cultivo',
      'Cobertura Foliar / Sombra (Cc)',
      data.crop.canopyCoverPercent,
      '%',
      '',
      '19. Fricción Neta en Lateral (hf_lat)',
      { t: 'n', f: 'G24 * (10.674 * (C44 * (1 + 0.22/C42)) * ((G23/1000)^1.852) / ((C46^1.852) * ((C45/1000)^4.871)))', v: results.lateralFrictionLossHca },
      'mca',
      '=F * hf_continuo (PE liso)'
    ],
    // Fila 26:
    [
      'C. Cultivo',
      'Tolerancia Salina del Cultivo (ECe)',
      data.crop.ecETolerance,
      'dS/m',
      '',
      '20. Presión Requerida Entrada Lateral',
      { t: 'n', f: 'C40 + (0.75 * G25)', v: results.lateralInletPressureRequiredMca },
      'mca',
      '=Hnom + 0.75*hf_lat'
    ],
    [],
    // Fila 28:
    [
      'D. Suelo',
      'Tipo de Textura del Suelo (Ver Hoja 3)',
      data.soil.texture,
      '-',
      '',
      '21. Laterales por Subunidad',
      { t: 'n', f: 'INT((G21 * 10000) / (C44 * C23))', v: results.lateralsPerSubunit },
      'líneas',
      '=INT((Area_sec * 10000) / (L_lat * Sl))'
    ],
    // Fila 29:
    [
      'D. Suelo',
      'Capacidad de Campo (CC)',
      data.soil.fieldCapacityPerc,
      '%',
      '',
      '22. Caudal de Diseño por Sector (L/s)',
      { t: 'n', f: 'G28 * G23', v: results.subunitFlowLps },
      'L/s',
      '=Laterales_subunidad * Q_lateral'
    ],
    // Fila 30:
    [
      'D. Suelo',
      'Punto de Marchitez Permanente (PMP)',
      data.soil.wiltingPointPerc,
      '%',
      '',
      '23. Caudal de Diseño por Sector (m³/h)',
      { t: 'n', f: 'G29 * 3.6', v: results.subunitFlowM3h },
      'm³/h',
      '=Q_sec_Lps * 3.6'
    ],
    // Fila 31:
    [
      'D. Suelo',
      'Densidad Aparente del Suelo (Da)',
      data.soil.bulkDensityGcm3,
      'g/cm³',
      '',
      '24. Fricción en Manifold (hf_sec)',
      { t: 'n', f: '0.38 * (10.674 * C48 * ((G29/1000)^1.852) / ((145^1.852) * ((C47/1000)^4.871)))', v: results.manifoldFrictionLossHca },
      'mca',
      '=Fricción terciaria con factor salidas'
    ],
    // Fila 32:
    [
      'D. Suelo',
      'Infiltración Básica del Suelo (Ib)',
      data.soil.basicInfiltrationMmH,
      'mm/h',
      '',
      '25. Fricción en Matriz Principal (hf_mat)',
      { t: 'n', f: '10.674 * C50 * ((G29/1000)^1.852) / ((150^1.852) * ((C49/1000)^4.871))', v: results.mainlineFrictionLossHca },
      'mca',
      '=Fricción matriz continua'
    ],
    [],
    // Fila 34:
    [
      'E. Topografía',
      'Cota en Cabezal de Riego (Z0)',
      data.topography.startElevationM,
      'msnm',
      '',
      '26. Desnivel Geodésico Terreno (ΔZ)',
      { t: 'n', f: 'MAX(0, C35 - C34)', v: Math.max(0, results.totalElevationDeltaM) },
      'm',
      '=MAX(0, Z1_crítico - Z0_cabezal)'
    ],
    // Fila 35:
    [
      'E. Topografía',
      'Cota Límite Crítico del Predio (Z1)',
      data.topography.endElevationM,
      'msnm',
      '',
      '27. ALTURA MANOMÉTRICA TOTAL (HMT)',
      { t: 'n', f: 'G26 + G31 + G32 + ((G31+G32)*0.15 + C54) + C52 + C53 + G34 + C51', v: results.totalDynamicHeadHmtMca },
      'mca',
      '=Pin + hf_sec + hf_mat + Acc + Filtro + Fert + ΔZ + Asp'
    ],
    // Fila 36:
    [
      'E. Topografía',
      'Longitud del Terreno Eje X',
      data.topography.fieldLengthM,
      'm',
      '',
      '28. Presión de Bombeo en Bares',
      { t: 'n', f: 'G35 / 10', v: Number((results.totalDynamicHeadHmtMca / 10).toFixed(2)) },
      'bar',
      '=HMT / 10 (1 bar = 10 mca = 14.22 psi)'
    ],
    // Fila 37:
    [
      'E. Topografía',
      'Pendiente en la Línea Lateral',
      results.lateralSlopePercent,
      '%',
      '',
      '29. Potencia al Eje Requerida (BHP)',
      { t: 'n', f: '(G29 * G35) / (75 * (C55/100) * (C56/100))', v: results.motorBhpHP },
      'HP',
      '=(Q_Lps * HMT) / [75 * ηb * ηm]'
    ],
    [],
    // Fila 39:
    [
      'F. Emisor/Red',
      'Caudal Nominal del Emisor (qe)',
      data.emitter.nominalFlowLph,
      'L/h',
      '',
      '30. Potencia Eléctrica Activa (kW)',
      { t: 'n', f: 'G37 * 0.7457', v: results.motorPowerKw },
      'kW',
      '=BHP * 0.7457 (Consumo de red)'
    ],
    // Fila 40:
    [
      'F. Emisor/Red',
      'Presión Nominal de Trabajo (Hnom)',
      data.emitter.nominalPressureMca,
      'mca',
      '',
      '31. Motor Comercial Sugerido (IE3)',
      { t: 'n', f: 'IF(G37<=5, 5, IF(G37<=7.5, 7.5, IF(G37<=10, 10, IF(G37<=15, 15, IF(G37<=20, 20, IF(G37<=25, 25, IF(G37<=30, 30, IF(G37<=40, 40, IF(G37<=50, 50, IF(G37<=60, 60, IF(G37<=75, 75, IF(G37<=100, 100, CEILING(G37*1.15, 25)))))))))))))', v: results.motorRecommendedCommercialHp },
      'HP',
      'Motor comercial con reserva +15%'
    ],
    // Fila 41:
    [
      'F. Emisor/Red',
      'Exponente de Descarga (x)',
      data.emitter.dischargeExponentX,
      '-',
      '',
      '32. Metros Totales de Lateral PE',
      { t: 'n', f: 'G28 * C8 * C44', v: results.totalLateralMeters },
      'm',
      '=Laterales_sector * Sectores * Longitud'
    ],
    // Fila 42:
    [
      'F. Emisor/Red',
      'Espaciamiento Entre Emisores (Se)',
      data.emitter.spacingM,
      'm',
      '',
      '33. Metros Totales de Terciaria PVC',
      { t: 'n', f: 'C8 * C48', v: results.totalManifoldMeters },
      'm',
      '=Sectores * Longitud_manifold'
    ],
    // Fila 43:
    [
      'F. Emisor/Red',
      'Coef. Variación Fabricación (CV)',
      data.emitter.manufacturerCv,
      '-',
      '',
      '34. INVERSIÓN TOTAL ESTIMADA (USD)',
      { t: 'n', f: "'4. Presupuesto Dinámico (BoM)'!H16", v: results.totalProjectCostUsd },
      'USD',
      '=Enlazado a Hoja 4 de Presupuesto'
    ],
    // Fila 44:
    [
      'F. Emisor/Red',
      'Longitud del Lateral (L_lat)',
      data.hydraulics.lateralLengthM,
      'm',
      '',
      '35. COSTO POR HECTÁREA (USD/ha)',
      { t: 'n', f: 'ROUND(G43 / C7, 2)', v: results.costPerHaUsd },
      'USD / ha',
      '=Total_Inversión / Superficie_Total'
    ],
    // Fila 45:
    [
      'F. Emisor/Red',
      'Diámetro Interior Lateral (Di)',
      data.hydraulics.lateralDiameterMm,
      'mm',
      '',
      '36. Costo Energético Anual (USD/año)',
      { t: 'n', f: 'ROUND(G38 * (G19 * 180) * C58, 2)', v: results.seasonalEnergyCostUsd },
      'USD / año',
      '=Potencia_kW * Horas_campaña * Tarifa'
    ],
    // Fila 46:
    ['F. Emisor/Red', 'Rugosidad Hazen-Williams (C)', data.hydraulics.lateralRoughnessC, '-', '', '', '', '', ''],
    // Fila 47:
    ['F. Emisor/Red', 'Diámetro Terciaria / Manifold (mm)', data.hydraulics.manifoldDiameterMm, 'mm', '', '', '', '', ''],
    // Fila 48:
    ['F. Emisor/Red', 'Longitud Tubería Terciaria (m)', data.hydraulics.manifoldLengthM, 'm', '', '', '', '', ''],
    // Fila 49:
    ['F. Emisor/Red', 'Diámetro Matriz Principal (mm)', data.hydraulics.mainlineDiameterMm, 'mm', '', '', '', '', ''],
    // Fila 50:
    ['F. Emisor/Red', 'Longitud Matriz Principal (m)', data.hydraulics.mainlineLengthM, 'm', '', '', '', '', ''],
    // Fila 51:
    ['G. Bombeo', 'Altura Aspiración Geométrica (m)', data.pumping.suctionLiftM, 'mca', '', '', '', '', ''],
    // Fila 52:
    ['G. Bombeo', 'Pérdida en Filtración Sucia (mca)', data.pumping.filterHeadLossMca, 'mca', '', '', '', '', ''],
    // Fila 53:
    ['G. Bombeo', 'Pérdida en Fertirriego Venturi (mca)', data.pumping.fertigationHeadLossMca, 'mca', '', '', '', '', ''],
    // Fila 54:
    ['G. Bombeo', 'Pérdida en Accesorios Menores (mca)', data.pumping.accessoriesLossMca, 'mca', '', '', '', '', ''],
    // Fila 55:
    ['G. Bombeo', 'Rendimiento Hidráulico Bomba (ηb %)', data.pumping.pumpEfficiencyPercent, '%', '', '', '', '', ''],
    // Fila 56:
    ['G. Bombeo', 'Rendimiento Motor Eléctrico (ηm %)', data.pumping.motorEfficiencyPercent, '%', '', '', '', '', ''],
    // Fila 57:
    ['G. Bombeo', 'Horas Máximas Disponibles Bombeo (h)', data.pumping.dailyOperatingHoursAllowed, 'h/día', '', '', '', '', ''],
    // Fila 58:
    ['G. Bombeo', 'Tarifa Eléctrica ($/kWh)', data.pumping.energyCostPerKwh, 'USD/kWh', '', '', '', '', ''],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  setColWidths(ws1, [15, 38, 16, 12, 4, 38, 16, 12, 42]);
  XLSX.utils.book_append_sheet(wb, ws1, 'Calculadora Rápida de Riego');

  // =========================================================================
  // HOJA 2: BASE DE DATOS DE CULTIVOS (CONSULTA Y REFERENCIA FAO-56)
  // =========================================================================
  const sheetCropsData: any[][] = [
    ['BASE DE DATOS AGRONÓMICA DE CULTIVOS - REFERENCIA FAO-56'],
    ['Consulte o copie los parámetros de su cultivo para pegarlos directamente en la Hoja 1.'],
    [],
    [
      'Nombre Común',
      'Nombre Científico',
      'Categoría',
      'Kc Inicial',
      'Kc Medio (Pico)',
      'Kc Final (Cosecha)',
      'Profundidad Radicular Zr (m)',
      'Agotamiento Admisible p',
      'Distancia Hileras Sl (m)',
      'Distancia Plantas Sp (m)',
      'Cobertura Sombra Cc (%)',
      'Tolerancia Salina ECe (dS/m)'
    ],
  ];

  CROPS_DATABASE.forEach((c) => {
    sheetCropsData.push([
      c.name,
      c.scientificName,
      c.category,
      c.kcIni,
      c.kcMid,
      c.kcEnd,
      c.rootDepthM,
      c.depletionP,
      c.rowSpacingM,
      c.plantSpacingM,
      c.canopyCoverPercent,
      c.ecETolerance,
    ]);
  });

  const wsCrops = XLSX.utils.aoa_to_sheet(sheetCropsData);
  setColWidths(wsCrops, [32, 28, 16, 12, 14, 16, 18, 18, 16, 16, 16, 18]);
  XLSX.utils.book_append_sheet(wb, wsCrops, 'Base de Datos Cultivos');

  // =========================================================================
  // HOJA 3: BASE DE DATOS DE SUELOS (PROPIEDADES HIDROFÍSICAS USDA)
  // =========================================================================
  const sheetSoilsData: any[][] = [
    ['BASE DE DATOS DE SUELOS Y RETENCIÓN HÍDRICA - TEXTURAS USDA'],
    ['Consulte los valores de Capacidad de Campo, Marchitez, Densidad e Infiltración según su textura.'],
    [],
    [
      'Clase Textural USDA',
      'Capacidad de Campo CC (%)',
      'Punto de Marchitez Permanente PMP (%)',
      'Agua Útil Retenible (CC - PMP %)',
      'Densidad Aparente Da (g/cm³)',
      'Infiltración Básica Ib (mm/h)',
      'Aptitud para Riego Localizado'
    ],
  ];

  SOIL_DATABASE.forEach((s) => {
    sheetSoilsData.push([
      s.texture,
      s.fieldCapacityPerc,
      s.wiltingPointPerc,
      Number((s.fieldCapacityPerc - s.wiltingPointPerc).toFixed(1)),
      s.bulkDensityGcm3,
      s.basicInfiltrationMmH,
      s.basicInfiltrationMmH >= 10 ? 'Excelente (Drenaje óptimo)' : 'Requiere baja tasa de gotero'
    ]);
  });

  const wsSoils = XLSX.utils.aoa_to_sheet(sheetSoilsData);
  setColWidths(wsSoils, [32, 22, 25, 22, 20, 20, 32]);
  XLSX.utils.book_append_sheet(wb, wsSoils, 'Base de Datos Suelos');

  // =========================================================================
  // HOJA 4: PRESUPUESTO DINÁMICO (BoM CON CANTIDADES VINCULADAS A HOJA 1)
  // =========================================================================
  const sheetBomData: any[][] = [
    ['PRESUPUESTO GENERAL Y CÓMPUTO MÉTRICO DE MATERIALES (BILL OF MATERIALS)'],
    ['Las cantidades y subtotales se calculan dinámicamente según la geometría y parámetros de diseño.'],
    [],
    [
      'Ítem',
      'Partida Presupuestaria',
      'Concepto de Obra / Suministro',
      'Especificación Técnica Normalizada',
      'Cantidad Calculada',
      'Unidad',
      'Precio Unitario (USD)',
      'Subtotal (USD)',
      'Fórmula Aplicada en Cantidad'
    ],
    // Fila 5: Lateral PE
    [
      1,
      'Líneas Laterales y Emisores',
      `Tubería PE con gotero ${data.emitter.nominalFlowLph} L/h @ ${data.emitter.spacingM}m`,
      `PN4 / Di=${data.hydraulics.lateralDiameterMm}mm / Espesor 1.0mm (40 mil)`,
      { t: 'n', f: "'Calculadora Rápida de Riego'!G41", v: results.totalLateralMeters },
      'm',
      data.unitCosts['lateral_per_m'] ?? 0.28,
      { t: 'n', f: 'E5 * G5', v: results.bomItems[0]?.totalCost || 0 },
      "=Vinculado a Celda G41 de Calculadora"
    ],
    // Fila 6: Manifold PVC
    [
      2,
      'Red Terciaria / Manifold',
      `Tubería Porta-regante PVC-U DN ${data.hydraulics.manifoldDiameterMm}mm`,
      'PN6 unión anger campana con collarines de toma a lateral',
      { t: 'n', f: "'Calculadora Rápida de Riego'!G42", v: results.totalManifoldMeters },
      'm',
      data.unitCosts['manifold_per_m'] ?? 4.80,
      { t: 'n', f: 'E6 * G6', v: results.bomItems[1]?.totalCost || 0 },
      "=Vinculado a Celda G42 de Calculadora"
    ],
    // Fila 7: Matriz PVC-O
    [
      3,
      'Red Matriz de Impulsión',
      `Tubería Matriz PVC-O / PEAD DN ${data.hydraulics.mainlineDiameterMm}mm`,
      'PN10 resistente a sobrepresión de ariete Joukowsky',
      { t: 'n', f: "'Calculadora Rápida de Riego'!C50", v: results.totalMainlineMeters },
      'm',
      data.unitCosts['mainline_per_m'] ?? 9.50,
      { t: 'n', f: 'E7 * G7', v: results.bomItems[2]?.totalCost || 0 },
      "=Longitud_matriz de Calculadora C50"
    ],
    // Fila 8: Electroválvulas
    [
      4,
      'Valvulería y Sectorización',
      'Electroválvulas hidráulicas de plástico solenoide 24VAC',
      'Paso total 2" a 3" con regulador de caudal integrado',
      { t: 'n', f: "'Calculadora Rápida de Riego'!C8", v: data.sectorsCount },
      'unidad',
      data.unitCosts['valve_electric'] ?? 165.0,
      { t: 'n', f: 'E8 * G8', v: results.bomItems[3]?.totalCost || 0 },
      "=Número de sectores de Calculadora C8"
    ],
    // Fila 9: Ventosas
    [
      5,
      'Valvulería y Sectorización',
      'Válvulas ventosas trifuncionales cinéticas PN16 1"-2"',
      'Purga automática continua y admisión de aire anti-vacío',
      { t: 'n', f: "MAX(4, 'Calculadora Rápida de Riego'!C8 * 2)", v: Math.max(4, data.sectorsCount * 2) },
      'unidad',
      data.unitCosts['air_valve'] ?? 68.0,
      { t: 'n', f: 'E9 * G9', v: results.bomItems[4]?.totalCost || 0 },
      "=MAX(4, Sectores * 2)"
    ],
    // Fila 10: Bomba
    [
      6,
      'Cabezal e Impulsión',
      'Electrobomba centrífuga horizontal normalizada',
      'Punto de operación según Q_sec m³/h @ HMT mca, motor IE3',
      1,
      'equipo',
      results.bomItems[5]?.unitCost || 2500,
      { t: 'n', f: 'E10 * G10', v: results.bomItems[5]?.totalCost || 2500 },
      "1 equipo electromecánico"
    ],
    // Fila 11: Filtración
    [
      7,
      'Cabezal e Impulsión',
      'Batería de filtración automática de discos / malla 130 mesh',
      'Contralavado hidráulico automático por presión diferencial',
      1,
      'sistema',
      results.bomItems[6]?.unitCost || 2800,
      { t: 'n', f: 'E11 * G11', v: results.bomItems[6]?.totalCost || 2800 },
      "1 sistema filtrante"
    ],
    // Fila 12: Fertirriego
    [
      8,
      'Cabezal e Impulsión',
      'Cabezal de fertirriego Venturi / bomba dosificadora',
      'Rotámetro, válvulas de retención teflón y depósito solución',
      1,
      'equipo',
      data.unitCosts['fertigation_system'] ?? 750.0,
      { t: 'n', f: 'E12 * G12', v: results.bomItems[7]?.totalCost || 750 },
      "1 equipo inyector"
    ],
    // Fila 13: Automatización
    [
      9,
      'Automatización y Cuadro',
      'Controlador programador de riego y cuadro VFD',
      'Salidas 24VAC, arranque de bomba y variador de frecuencia',
      1,
      'sistema',
      data.unitCosts['automation_controller'] ?? 980.0,
      { t: 'n', f: 'E13 * G13', v: results.bomItems[8]?.totalCost || 980 },
      "1 programador central"
    ],
    // Fila 14: Mano de obra
    [
      10,
      'Obra Civil e Instalación',
      'Zanjado, tendido, anclajes, montaje y prueba hidráulica',
      'Prueba de estanqueidad a 1.5 x PN según norma UNE-EN 805',
      { t: 'n', f: "'Calculadora Rápida de Riego'!C7", v: data.totalAreaHa },
      'ha',
      data.unitCosts['installation_labor_per_ha'] ?? 420.0,
      { t: 'n', f: 'E14 * G14', v: results.bomItems[9]?.totalCost || 0 },
      "=Superficie_total_ha de Celda C7"
    ],
    [],
    // Fila 16: Gran Total
    [
      '',
      'TOTAL GENERAL DEL PROYECTO',
      'INVERSIÓN TOTAL ESTIMADA (SUMINISTRO E INSTALACIÓN)',
      'Suma de partidas presupuestarias 1 a 10',
      '',
      '',
      'TOTAL USD:',
      { t: 'n', f: 'SUM(H5:H14)', v: results.totalProjectCostUsd },
      "=SUM(H5:H14)"
    ],
    // Fila 17: Costo por ha
    [
      '',
      'INDICADOR UNITARIO POR HECTÁREA',
      'Costo de Inversión por Hectárea Irrigada',
      'Razón inversión total respecto a superficie neta',
      '',
      '',
      'USD / ha:',
      { t: 'n', f: "ROUND(H16 / 'Calculadora Rápida de Riego'!C7, 2)", v: results.costPerHaUsd },
      "=Total_Inversión / Superficie_ha"
    ],
    // Fila 18: Costo por sector
    [
      '',
      'INDICADOR UNITARIO POR SUBUNIDAD',
      'Costo Promedio por Sector de Riego',
      'Razón inversión total respecto al número de turnos',
      '',
      '',
      'USD / sector:',
      { t: 'n', f: "ROUND(H16 / 'Calculadora Rápida de Riego'!C8, 2)", v: Math.round(results.totalProjectCostUsd / data.sectorsCount) },
      "=Total_Inversión / Sectores"
    ],
  ];

  const wsBom = XLSX.utils.aoa_to_sheet(sheetBomData);
  setColWidths(wsBom, [6, 26, 42, 46, 18, 10, 20, 20, 35]);
  XLSX.utils.book_append_sheet(wb, wsBom, '4. Presupuesto Dinámico (BoM)');

  // =========================================================================
  // HOJA 5: COMPENDIO TEÓRICO DE FÓRMULAS (MEMORIA TÉCNICA Y NOMENCLATURA)
  // =========================================================================
  const sheetFormulasData: any[][] = [
    ['MEMORIA TÉCNICA DE FÓRMULAS HIDRÁULICAS Y AGRONÓMICAS DE RIEGO'],
    ['Explicación técnica de qué calcula cada fórmula, variables, unidades y utilidad en el diseño.'],
    [],
    [
      'Nombre de la Fórmula',
      'Categoría',
      'Expresión Matemática',
      '¿Para Qué Sirve Exactamente?',
      'Variables y Unidades de Entrada',
      'Criterio Técnico del Especialista'
    ],
    [
      'Evapotranspiración del Cultivo (ETc)',
      'Agronomía',
      'ETc = ETo * Kc',
      'Determina la lámina máxima diaria de agua que la masa vegetal transpira y el suelo evapora.',
      'ETo (mm/día), Kc (adimensional según fase fenológica).',
      'Base para dimensionar la capacidad del sistema en el mes de máxima demanda.'
    ],
    [
      'Coeficiente de Reducción (Kr Fereres)',
      'Agronomía',
      'Kr = min(1.0, 1.34 * sqrt(Cc/100))',
      'Ajusta el consumo en riego localizado donde el suelo interlineal permanece seco.',
      'Cc = Porcentaje de sombra o cobertura foliar de copa (%).',
      'Evita sobrestimar caudales y sobredimensionar tuberías en frutales.'
    ],
    [
      'Necesidad Neta de Riego (Nn)',
      'Agronomía',
      'Nn = (ETc * Kr) - Pe',
      'Lámina neta que el sistema debe infiltrar en el bulbo radicular.',
      'ETc (mm/día), Kr (-), Pe = Precipitación efectiva (mm/día).',
      'Si Pe >= ETc*Kr, el riego se posterga temporalmente.'
    ],
    [
      'Requerimiento de Lavado (LR)',
      'Agronomía',
      'LR = ECw / (5*ECe - ECw)',
      'Determina la fracción de agua adicional para lixiviar sales por debajo de raíces.',
      'ECw = Salinidad agua (dS/m), ECe = Tolerancia umbral cultivo (dS/m).',
      'Protege al cultivo de salinización y estrés osmótico.'
    ],
    [
      'Necesidad Bruta de Riego (Nb)',
      'Agronomía',
      'Nb = Nn / [Ea * (1 - LR)]',
      'Lámina bruta total que el emisor debe entregar al terreno.',
      'Nn (mm/día), Ea = Eficiencia aplicación (0.90), LR = Fracción lavado.',
      'Caudal de diseño volumétrico a suministrar en cabezal.'
    ],
    [
      'Retención Útil en Suelo (RAW)',
      'Suelo',
      'RAW = 10 * (CC - PMP)/100 * Da * Zr * p * (Pw/100)',
      'Lámina de reserva aprovechable en el bulbo antes de estrés hídrico.',
      'CC (%), PMP (%), Da (g/cm³), Zr (m), p (fracción agotamiento), Pw (% mojado).',
      'Fija el intervalo de días entre riegos sucesivos.'
    ],
    [
      'Intensidad Horaria Aplicación (Ia)',
      'Emisor/Suelo',
      'Ia = qe / (Se * Sl)',
      'Tasa de entrega del emisor sobre el marco de plantación.',
      'qe = Caudal gotero (L/h), Se = Distancia goteros (m), Sl = Distancia hileras (m).',
      'REGLA DE ORO: Ia DEBE ser menor que Ib (Infiltración básica) para evitar escorrentía.'
    ],
    [
      'Tiempo de Riego por Turno (Tr)',
      'Operación',
      'Tr = (Nb * Fr) / Ia',
      'Horas de apertura continua de electroválvula por sector.',
      'Nb (mm/día), Fr = Frecuencia (días), Ia = Intensidad (mm/h).',
      'Tr * Sectores debe ser menor a las horas de bombeo diario disponibles.'
    ],
    [
      'Fricción Hazen-Williams (hf)',
      'Hidráulica',
      'hf = 10.674 * L * Q^1.852 / (C^1.852 * D^4.871)',
      'Calcula la pérdida continua por rozamiento viscoso en tuberías a presión.',
      'L (m), Q (m³/s), C (coeficiente rugosidad: 145 PEAD, 150 PVC), D (m).',
      'Ecuación estándar universal en ingeniería de riego.'
    ],
    [
      'Factor Christiansen (F)',
      'Hidráulica',
      'F = 1/(m+1) + 1/(2N) + sqrt(m-1)/(6N^2)',
      'Corrige la pérdida en tuberías con salidas múltiples (goteros a lo largo del tubo).',
      'm = 1.852 (Hazen-Williams), N = Cantidad de goteros en el ramal.',
      'hf_real = F * hf_continuo (F converge a ~0.355 para N > 30).'
    ],
    [
      'Altura Manométrica Total (HMT)',
      'Bombeo',
      'HMT = Hop + hf_lat + hf_sec + hf_mat + hm_acc + Hfiltro + Hfert + DeltaZ + Hasp',
      'Energía piezométrica total requerida en brida de bomba.',
      'Hop (presión nominal emisor), hf (fricciones red), DeltaZ (desnivel terreno), Hasp (succión).',
      'Garantiza que el emisor más desfavorable opere a su presión de catálogo.'
    ],
    [
      'Potencia al Eje de la Bomba (BHP)',
      'Bombeo',
      'BHP = (Q * HMT) / (75 * eta_b * eta_m)',
      'Potencia mecánica requerida en el eje del motor eléctrico o térmico.',
      'Q (L/s), HMT (mca), eta_b (rendimiento bomba 0.75), eta_m (rendimiento motor 0.90).',
      'Permite seleccionar el motor comercial normalizado (IE3) con reserva del 15%.'
    ],
  ];

  const wsFormulas = XLSX.utils.aoa_to_sheet(sheetFormulasData);
  setColWidths(wsFormulas, [32, 16, 42, 50, 45, 45]);
  XLSX.utils.book_append_sheet(wb, wsFormulas, '5. Memoria de Fórmulas');

  // =========================================================================
  // HOJA 6: CATÁLOGOS TÉCNICOS Y PROVEEDORES OFICIALES
  // =========================================================================
  const sheetCatalogsData: any[][] = [
    ['DIRECTORIO DE CATÁLOGOS TÉCNICOS OFICIALES Y ENLACES WEB DIRECTOS'],
    ['Referencias para Especificación, Curvas Q-H, Pérdidas de Carga y Software de Selección'],
    [],
    [
      'Fabricante',
      'Categoría de Componente',
      'Título del Catálogo Técnico',
      'Descripción / Datos Incluidos en el Manual',
      'Enlace Web Oficial de Descarga'
    ],
  ];

  CATALOGS_DATABASE.forEach((cat) => {
    sheetCatalogsData.push([
      cat.manufacturer,
      cat.category,
      cat.title,
      cat.description,
      cat.url,
    ]);
  });

  const wsCatalogs = XLSX.utils.aoa_to_sheet(sheetCatalogsData);
  setColWidths(wsCatalogs, [25, 26, 42, 55, 45]);
  XLSX.utils.book_append_sheet(wb, wsCatalogs, '6. Catálogos Oficiales');

  // Generar libro binario .xlsx
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  const cleanName = data.projectName
    ? data.projectName.replace(/[^a-zA-Z0-9_\-]/g, '_')
    : 'Diseno_Riego';
  const fileName = `${cleanName}_Plantilla_Universal_Editable.xlsx`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

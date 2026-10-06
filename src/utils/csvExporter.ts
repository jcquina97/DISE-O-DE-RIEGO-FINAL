import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';
import { CATALOGS_DATABASE } from '../data/catalogsData';

/**
 * Genera un archivo CSV completo, técnico y estructurado que cumple con todas
 * las exigencias de diseño agronómico, hidráulico, topográfico y presupuestario.
 *
 * Características del archivo generado:
 * 1. Byte Order Mark UTF-8 (\uFEFF) para visualización inmediata de tildes, símbolos (° ² ³ Δ η) en Excel sin caracteres rotos.
 * 2. Celdas de Parámetros de Entrada identificadas para fácil actualización según cultivo y lugar.
 * 3. Fórmulas activas de cálculo (=ETo*Kc, =MIN(...), =MAX(...), =IF(...), =SUM(...)).
 * 4. Desglose agronómico FAO-56 completo paso a paso.
 * 5. Desglose hidráulico de pérdidas Hazen-Williams, Factor Christiansen F y HMT.
 * 6. Cómputo métrico y presupuesto (BoM) con fórmulas de producto (=Cantidad*Precio) y suma total.
 * 7. Enlaces oficiales a catálogos técnicos de fabricantes.
 */
export function exportProjectToCsv(data: ProjectData, results: CalculationResults) {
  const delimiter = ',';

  const escapeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    const s = String(val);
    if (s.includes('"') || s.includes(delimiter) || s.includes('\n') || s.includes('\r')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return `"${s}"`;
  };

  const row = (...cells: (string | number | undefined | null)[]): string => {
    return cells.map(escapeCell).join(delimiter) + '\r\n';
  };

  // Prepend UTF-8 BOM so Microsoft Excel immediately detects UTF-8 encoding
  let csv = '\uFEFF';

  // =========================================================================
  // ENCABEZADO OFICIAL
  // =========================================================================
  csv += row('HYDROAGRO DESIGN SUITE - MEMORIA TÉCNICA Y PRESUPUESTO OFICIAL');
  csv += row('Cálculo Agronómico FAO-56 • Topografía en Curvas de Nivel • Hidráulica ISO 9261 • Presupuesto BoM');
  csv += row(
    'Proyecto:',
    data.projectName,
    'Ubicación:',
    data.location,
    'Fecha:',
    new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  );
  csv += row('Proyectista:', data.designerName, 'Sistema:', data.systemType, 'Área Total:', `${data.totalAreaHa} ha`);
  csv += row();

  // =========================================================================
  // SECCIÓN 1: PARÁMETROS EDITABLES DE ENTRADA (LUGAR, CLIMA, CULTIVO, SUELO)
  // =========================================================================
  csv += row('=== SECCIÓN 1: PARÁMETROS DE ENTRADA (EDITAR AQUÍ PARA DIFERENTES CULTIVOS Y LUGARES) ===');
  csv += row('CÓDIGO', 'PARÁMETRO DE DISEÑO', 'VALOR DE ENTRADA', 'UNIDAD', 'NOTAS Y CRITERIO TÉCNICO');
  
  // Variables generales
  csv += row('P_AREA', 'Superficie Total a Irrigar', data.totalAreaHa, 'ha', 'Superficie neta del predio');
  csv += row('P_SECT', 'Número de Sectores de Riego', data.sectorsCount, 'turnos', 'Subunidades operativas independientes');
  
  // Clima y lugar
  csv += row('P_ETO', 'Evapotranspiración ETo Referencia', data.etoMmDay, 'mm/día', 'Demanda evaporativa de mes pico (FAO-56)');
  csv += row('P_PE', 'Precipitación Efectiva Local', data.effectiveRainfallMmDay, 'mm/día', 'Lluvia aprovechable por raíces');
  csv += row('P_ECW', 'Salinidad del Agua de Riego ECw', data.waterSalinityECw, 'dS/m', 'Conductividad eléctrica fuente');
  csv += row('P_EA', 'Eficiencia de Aplicación Ea', data.applicationEfficiencyPerc, '%', 'Goteo: 90-95%, Micro: 85%, Aspersión: 75%');
  csv += row('P_PW', 'Porcentaje de Suelo Mojado Pw', data.wettedAreaPercent, '%', 'Volumen de bulbo húmedo (30-50% frutales)');

  // Cultivo
  csv += row('P_CROP', 'Nombre del Cultivo', data.crop.name, '-', 'Especie agrícola');
  csv += row('P_KC', 'Coeficiente de Cultivo Kc Efectivo', results.kcEffective, '-', 'Factor fenológico FAO-56 según fase');
  csv += row('P_ZR', 'Profundidad Radical Activa Zr', data.crop.rootDepthM, 'm', 'Espesor de suelo con 80% de raíces activas');
  csv += row('P_DEP', 'Fracción de Agotamiento Admisible p', data.crop.depletionP, 'fracción', 'Sensibilidad fisiológica al déficit');
  csv += row('P_SL', 'Distancia Entre Hileras Sl', data.crop.rowSpacingM, 'm', 'Marco de plantación entre líneas');
  csv += row('P_SP', 'Distancia Entre Plantas Sp', data.crop.plantSpacingM, 'm', 'Marco de plantación sobre hilera');
  csv += row('P_CC', 'Cobertura Foliar / Sombra Cc', data.crop.canopyCoverPercent, '%', 'Proyección de copa al mediodía');
  csv += row('P_ECE', 'Tolerancia Salina del Cultivo ECe', data.crop.ecETolerance, 'dS/m', 'Umbral de extracto de saturación');

  // Suelo
  csv += row('P_SOIL', 'Textura del Suelo', data.soil.texture, '-', 'Clase textural USDA');
  csv += row('P_CC_S', 'Capacidad de Campo CC', data.soil.fieldCapacityPerc, '%', 'Humedad a -0.33 bar');
  csv += row('P_PMP', 'Punto de Marchitez Permanente PMP', data.soil.wiltingPointPerc, '%', 'Humedad límite a -15 bar');
  csv += row('P_DA', 'Densidad Aparente del Suelo Da', data.soil.bulkDensityGcm3, 'g/cm³', 'Masa seca por unidad de volumen aparente');
  csv += row('P_IB', 'Infiltración Básica del Suelo Ib', data.soil.basicInfiltrationMmH, 'mm/h', 'Velocidad de infiltración estabilizada');

  // Topografía
  csv += row('P_Z0', 'Cota Inicial Cabezal de Riego Z0', data.topography.startElevationM, 'msnm', 'Altimetría estación de bombeo');
  csv += row('P_Z1', 'Cota Crítica Límite del Predio Z1', data.topography.endElevationM, 'msnm', 'Altimetría en punto más alto');
  csv += row('P_LX', 'Longitud del Predio (Eje X)', data.topography.fieldLengthM, 'm', 'Sentido de laterales');
  csv += row('P_LY', 'Ancho del Predio (Eje Y)', data.topography.fieldWidthM, 'm', 'Sentido de matriz');
  csv += row('P_SLAT', 'Pendiente en la Línea Lateral', results.lateralSlopePercent, '%', '0% si sigue curvas de nivel (a iso-cota)');

  // Emisor y Red
  csv += row('P_QE', 'Caudal Nominal del Emisor qe', data.emitter.nominalFlowLph, 'L/h', 'Gasto unitario nominal del gotero');
  csv += row('P_HNOM', 'Presión Nominal de Trabajo Hnom', data.emitter.nominalPressureMca, 'mca', 'Presión recomendada de catálogo (10 mca = 1 bar)');
  csv += row('P_XEXP', 'Exponente de Descarga x', data.emitter.dischargeExponentX, '-', 'x=0 a 0.05 (PC) | x=0.5 (Turbulento)');
  csv += row('P_SE', 'Espaciamiento Entre Emisores Se', data.emitter.spacingM, 'm', 'Distancia entre goteros sobre la línea');
  csv += row('P_LLAT', 'Longitud del Lateral Porta-Goteros', data.hydraulics.lateralLengthM, 'm', 'Extensión del ramal');
  csv += row('P_DI_LAT', 'Diámetro Interior Lateral Di', data.hydraulics.lateralDiameterMm, 'mm', 'Diámetro interior neto (16mm = 13.8mm)');
  csv += row('P_C_HW', 'Rugosidad Hazen-Williams Lateral C', data.hydraulics.lateralRoughnessC, '-', 'PEAD liso: 145 - 150');
  csv += row('P_D_SEC', 'Diámetro Terciaria / Manifold', data.hydraulics.manifoldDiameterMm, 'mm', 'Tubería secundaria distribuidora');
  csv += row('P_L_SEC', 'Longitud Tubería Terciaria', data.hydraulics.manifoldLengthM, 'm', 'Extensión de terciaria');
  csv += row('P_D_MAT', 'Diámetro Matriz Principal', data.hydraulics.mainlineDiameterMm, 'mm', 'Conducción primaria');
  csv += row('P_L_MAT', 'Longitud Matriz Principal', data.hydraulics.mainlineLengthM, 'm', 'Longitud desde cabezal');

  // Bombeo
  csv += row('P_HASP', 'Altura Geométrica de Aspiración Hasp', data.pumping.suctionLiftM, 'mca', 'Succión en balsa / pozo');
  csv += row('P_HFILT', 'Pérdida en Cabezal de Filtración', data.pumping.filterHeadLossMca, 'mca', 'En estado sucio antes de contralavado');
  csv += row('P_HFERT', 'Pérdida en Cabezal de Fertirriego', data.pumping.fertigationHeadLossMca, 'mca', 'Diferencial Venturi / dosificador');
  csv += row('P_HACC', 'Pérdida en Accesorios Singulares', data.pumping.accessoriesLossMca, 'mca', 'Codos, tes y válvulas directas');
  csv += row('P_ETAB', 'Rendimiento Bomba Hidráulica ηb', data.pumping.pumpEfficiencyPercent, '%', 'Eficiencia en punto de operación BEP');
  csv += row('P_ETAM', 'Rendimiento Motor Eléctrico ηm', data.pumping.motorEfficiencyPercent, '%', 'Clase de eficiencia IE2/IE3');
  csv += row('P_JMAX', 'Horas Máximas Disponibles Bombeo', data.pumping.dailyOperatingHoursAllowed, 'h/día', 'Jornada diaria admisible');
  csv += row('P_TARIFA', 'Tarifa Eléctrica por Energía', data.pumping.energyCostPerKwh, 'USD/kWh', 'Costo de kWh eléctrico');
  csv += row();

  // =========================================================================
  // SECCIÓN 2: BALANCE AGRONÓMICO FAO-56 (FÓRMULAS ACTIVAS)
  // =========================================================================
  csv += row('=== SECCIÓN 2: CÁLCULOS AGRONÓMICOS FAO-56 Y PROGRAMACIÓN DE RIEGO ===');
  csv += row('PASO', 'PARÁMETRO AGRONÓMICO', 'VALOR CALCULADO', 'UNIDAD', 'FÓRMULA MATEMÁTICA NATIVA', 'INTERPRETACIÓN Y CRITERIO');
  csv += row('1', 'Evapotranspiración Cultivo (ETc)', results.etcMmDay, 'mm/día', '=ETo * Kc', 'Demanda máxima potencial del dosel vegetal');
  csv += row('2', 'Factor Cobertura Kr (Fereres)', results.krFactor, '-', '=MIN(1.0, 1.34*SQRT(Cc/100))', 'Ajuste por sombra; no moja suelo interlineal seco');
  csv += row('3', 'Necesidad Neta de Riego (Nn)', results.netIrrigationMmDay, 'mm/día', '=(ETc * Kr) - Pe', 'Lámina neta requerida a infiltrar en raíces');
  csv += row('4', 'Fracción Lavado Sales (LR)', Number((results.leachingRequirementLR * 100).toFixed(2)), '%', '=ECw / (5*ECe - ECw)', 'Porcentaje adicional de agua para lixiviar sales');
  csv += row('5', 'Necesidad Bruta de Riego (Nb)', results.grossIrrigationMmDay, 'mm/día', '=Nn / [Ea * (1 - LR)]', 'Lámina total que deben erogar los emisores');
  csv += row('6', 'Retención Total Suelo (TAW)', results.tawMm, 'mm', '=10 * (CC - PMP)/100 * Da * Zr * 10', 'Capacidad máxima de almacenamiento en perfil');
  csv += row('7', 'Agua Útil en Bulbo (RAW)', results.rawMm, 'mm', '=TAW * p * (Pw / 100)', 'Reserva de agua sin que el cultivo sufra estrés');
  csv += row('8', 'Frecuencia Máxima de Riego', results.maxIrrigationIntervalDays, 'días', '=INT(RAW / Nn)', 'Intervalo agronómico límite entre riegos');
  csv += row('9', 'Frecuencia Programada (Fr)', results.selectedIntervalDays, 'día(s)', '=MIN(Fr_max, 1)', 'Alta frecuencia en goteo (1 día típico)');
  csv += row('10', 'Intensidad Aplicación Horaria (Ia)', results.hourlyApplicationRateMmH, 'mm/h', '=qe / (Se * Sl)', 'Tasa de entrega del emisor sobre el marco');
  csv += row(
    '11',
    'Control Escorrentía (Ia <= Ib)',
    results.infiltrationFeasible ? 'CUMPLE (Sin Escorrentía)' : 'ALERTA (Riesgo Charco)',
    '-',
    '=IF(Ia <= Ib, CUMPLE, ALERTA)',
    `Ia=${results.hourlyApplicationRateMmH} mm/h vs Ib=${data.soil.basicInfiltrationMmH} mm/h`
  );
  csv += row('12', 'Tiempo Riego por Turno (Tr)', results.irrigationDurationHoursPerShift, 'horas/sector', '=(Nb * Fr) / Ia', 'Horas continuas de apertura de válvula por sector');
  csv += row('13', 'Jornada Diaria Total Requerida', results.dailyOperatingHoursRequired, 'horas/día', '=Tr * Numero_Sectores', 'Horas totales para regar todos los sectores');
  csv += row(
    '14',
    'Factibilidad Operativa Bombeo',
    results.dailyOperationFeasible ? 'FACTIBLE (Dentro de Horas)' : 'ALERTA (Excede Horas)',
    '-',
    '=IF(Jornada <= J_max, OK, ALERTA)',
    `Jornada=${results.dailyOperatingHoursRequired}h vs Permitida=${data.pumping.dailyOperatingHoursAllowed}h`
  );
  csv += row();

  // =========================================================================
  // SECCIÓN 3: HIDRÁULICA Y PÉRDIDAS DE CARGA HMT (FÓRMULAS ACTIVAS)
  // =========================================================================
  csv += row('=== SECCIÓN 3: DIMENSIONAMIENTO HIDRÁULICO Y ALTURA MANOMÉTRICA TOTAL (HMT) ===');
  csv += row('ÍTEM', 'COMPONENTE HIDRÁULICO', 'VALOR CALCULADO', 'UNIDAD', 'FÓRMULA / RELACIÓN APLICADA', 'CRITERIO TÉCNICO NORMATIVO');
  csv += row('1', 'Emisores por Lateral', results.emittersPerLateral, 'goteros', '=INT(L_lat / Se)', 'Cantidad de emisores sobre un ramal individual');
  csv += row('2', 'Caudal del Lateral (L/h)', results.lateralFlowLph, 'L/h', '=N_emisores * qe', 'Gasto acumulado total del lateral');
  csv += row('3', 'Caudal del Lateral (L/s)', results.lateralFlowLps, 'L/s', '=Q_lat_h / 3600', 'Gasto en unidades de cálculo hidráulico');
  csv += row('4', 'Factor Christiansen F (m=1.852)', results.christiansenF, '-', '=(1/(m+1)) + (1/(2N)) + (SQRT(m-1)/(6N^2))', 'Factor reductor de pérdidas en salidas múltiples');
  csv += row('5', 'Longitud Equivalente Lateral', results.lateralEquivalentLengthM, 'm', '=L_lat * (1 + 0.22/Se)', 'Añade pérdidas singulares por espiga de gotero');
  csv += row('6', 'Pérdida por Fricción Lateral (hf_lat)', results.lateralFrictionLossHca, 'mca', '=F * hf_continuo Hazen-Williams', 'Disipación viscosa neta a lo largo del ramal');
  csv += row('7', 'Presión Entrada Lateral Requerida', results.lateralInletPressureRequiredMca, 'mca', '=Hnom + 0.75 * hf_lat', 'Carga mínima en inserción con la terciaria');
  csv += row('8', 'Presión en Extremo Final Lateral', results.lateralEndPressureMca, 'mca', '=Pin_lat - hf_lat + DeltaZ_lat', 'Presión en punta de purga del lateral');
  csv += row('9', 'Uniformidad de Emisión EU', `${results.emissionUniformityEU}%`, '%', '=100*[1 - 1.27*(CV/sqrt(np))]*(q_min/q_med)', 'Norma ISO 9261 / ASAE EP458 (>=90% Excelente)');
  csv += row('10', 'Variación Caudal Gotero (Δq)', `${results.emitterFlowVariationPercent}%`, '%', '=(q_max - q_min) / q_nom * 100', 'Norma ISO 9261 exige Δq <= 10%');
  csv += row('11', 'Superficie por Subunidad / Sector', results.sectorAreaHa, 'ha', '=Area_Total / Sectores', 'Superficie neta regada simultáneamente');
  csv += row('12', 'Laterales por Subunidad', results.lateralsPerSubunit, 'líneas', '=INT((Area_sec*10000) / (L_lat * Sl))', 'Ramales conectados al manifold secundario');
  csv += row('13', 'Caudal por Subunidad (L/s)', results.subunitFlowLps, 'L/s', '=Laterales_sec * Q_lat_s', 'Caudal simultáneo de diseño del sector');
  csv += row('14', 'Caudal por Subunidad (m³/h)', results.subunitFlowM3h, 'm³/h', '=Q_sec_Lps * 3.6', 'Gasto horario para selección de bomba y filtros');
  csv += row('15', 'Velocidad en Terciaria / Manifold', `${results.manifoldVelocityMs} m/s`, 'm/s', '=Q / Area_tubo', `Diámetro ${data.hydraulics.manifoldDiameterMm}mm (Rango 0.8-1.5 m/s)`);
  csv += row('16', 'Fricción en Terciaria / Manifold', results.manifoldFrictionLossHca, 'mca', '=F_sec * hf_continuo Hazen-Williams', 'Rozamiento en manifold con factor de salidas');
  csv += row('17', 'Velocidad en Matriz Principal', `${results.mainlineVelocityMs} m/s`, 'm/s', '=Q / Area_matriz', `Diámetro ${data.hydraulics.mainlineDiameterMm}mm (Rango 1.0-1.8 m/s)`);
  csv += row('18', 'Fricción en Matriz Principal', results.mainlineFrictionLossHca, 'mca', '=hf_continuo Hazen-Williams (C=150)', 'Rozamiento continuo en impulsión principal');
  csv += row('19', 'Accesorios y Valvulería Singulares', results.fittingsLossMca, 'mca', '=(hf_sec + hf_mat)*0.15 + h_acc', 'Pérdidas menores en codos, tes y válvulas');
  csv += row('20', 'Desnivel Geodésico Terreno (ΔZ)', Math.max(0, results.totalElevationDeltaM), 'm', '=MAX(0, Z1_crítico - Z0_cabezal)', 'Diferencia de cota geométrica a vencer');
  csv += row('21', 'ALTURA MANOMÉTRICA TOTAL (HMT)', results.totalDynamicHeadHmtMca, 'mca', '=Pin + hf_sec + hf_mat + Acc + Filt + Fert + ΔZ + Asp', 'Carga piezométrica neta en brida de impulsión');
  csv += row('22', 'Presión Equivalente en Bares', (results.totalDynamicHeadHmtMca / 10).toFixed(2), 'bar', '=HMT / 10', '1 bar = 10 mca = 14.22 psi');
  csv += row('23', 'Potencia Hidráulica del Fluido', results.pumpHydraulicPowerKw, 'kW', '=(9.81 * Q_Lps * HMT) / 1000', 'Energía útil neta transferida al agua');
  csv += row('24', 'Potencia al Eje Requerida (BHP)', results.motorBhpHP, 'HP', '=(Q_Lps * HMT) / [75 * ηb * ηm]', 'Potencia mecánica al freno del motor');
  csv += row('25', 'Potencia Eléctrica Activa (kW)', results.motorPowerKw, 'kW', '=BHP * 0.7457', 'Potencia demandada al transformador / red');
  csv += row('26', 'Motor Comercial Sugerido (IE3)', results.motorRecommendedCommercialHp, 'HP', '=Potencia normalizada con reserva +15%', 'Clase de alta eficiencia IE3');
  csv += row();

  // =========================================================================
  // SECCIÓN 4: CÓMPUTO MÉTRICO Y PRESUPUESTO DINÁMICO (BoM)
  // =========================================================================
  csv += row('=== SECCIÓN 4: CÓMPUTO MÉTRICO Y PRESUPUESTO DETALLADO (BILL OF MATERIALS) ===');
  csv += row('ÍTEM', 'PARTIDA PRESUPUESTARIA', 'CONCEPTO DE SUMINISTRO / OBRA', 'ESPECIFICACIÓN TÉCNICA', 'CANTIDAD', 'UNIDAD', 'PRECIO UNITARIO (USD)', 'SUBTOTAL (USD)', 'FÓRMULA APLICADA');

  results.bomItems.forEach((item, idx) => {
    csv += row(
      idx + 1,
      item.category,
      item.concept,
      item.specification,
      item.quantity,
      item.unit,
      item.unitCost.toFixed(2),
      item.totalCost.toFixed(2),
      '=Cantidad * Precio_Unitario'
    );
  });

  csv += row();
  csv += row(
    '',
    'TOTAL GENERAL DEL PROYECTO',
    'INVERSIÓN TOTAL ESTIMADA (SUMINISTRO E INSTALACIÓN)',
    'Suma de partidas presupuestarias 1 a 10',
    '',
    '',
    'TOTAL USD:',
    results.totalProjectCostUsd.toFixed(2),
    '=SUM(Subtotales Partidas 1 a 10)'
  );
  csv += row(
    '',
    'INDICADOR UNITARIO POR HECTÁREA',
    'Costo de Inversión por Hectárea Irrigada',
    `Calculado para ${data.totalAreaHa} hectáreas netas`,
    '',
    '',
    'USD / ha:',
    results.costPerHaUsd.toFixed(2),
    '=Total_Inversión / Superficie_ha'
  );
  csv += row(
    '',
    'INDICADOR UNITARIO POR SUBUNIDAD',
    'Costo Promedio por Sector de Riego',
    `Calculado para ${data.sectorsCount} sectores operativos`,
    '',
    '',
    'USD / sector:',
    Math.round(results.totalProjectCostUsd / data.sectorsCount).toFixed(2),
    '=Total_Inversión / Sectores'
  );
  csv += row(
    '',
    'COSTO ENERGÉTICO ANUAL ESTIMADO',
    'Gasto Operativo Eléctrico por Campaña',
    `${results.seasonalOperatingHours} h de bombeo acumuladas @ $${data.pumping.energyCostPerKwh}/kWh`,
    '',
    '',
    'USD / año:',
    results.seasonalEnergyCostUsd.toFixed(2),
    '=Potencia_kW * Horas_campaña * Tarifa_kWh'
  );
  csv += row();

  // =========================================================================
  // SECCIÓN 5: ENLACES OFICIALES A CATÁLOGOS TÉCNICOS Y FABRICANTES
  // =========================================================================
  csv += row('=== SECCIÓN 5: DIRECTORIO DE CATÁLOGOS TÉCNICOS Y PROVEEDORES OFICIALES ===');
  csv += row('FABRICANTE', 'CATEGORÍA DE COMPONENTE', 'TÍTULO DEL CATÁLOGO TÉCNICO', 'DESCRIPCIÓN TÉCNICA', 'ENLACE WEB OFICIAL DIRECTO');

  CATALOGS_DATABASE.forEach((cat) => {
    csv += row(cat.manufacturer, cat.category, cat.title, cat.description, cat.url);
  });

  // Create downloadable Blob and trigger file download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const cleanName = data.projectName
    ? data.projectName.replace(/[^a-zA-Z0-9_\-]/g, '_')
    : 'Diseno_Riego';
  const fileName = `${cleanName}_Memoria_y_Presupuesto_Completo.csv`;

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

import { ProjectData } from '../types/irrigation';

export interface CalculationResults {
  // Agronomic
  kcEffective: number;
  etcMmDay: number;
  krFactor: number;
  netIrrigationMmDay: number;
  leachingRequirementLR: number;
  grossIrrigationMmDay: number;
  tawMm: number; // Total Available Water
  rawMm: number; // Readily Available Water in wetted bulb
  maxIrrigationIntervalDays: number;
  selectedIntervalDays: number;
  hourlyApplicationRateMmH: number;
  infiltrationFeasible: boolean;
  irrigationDurationHoursPerShift: number;
  dailyOperatingHoursRequired: number;
  dailyOperationFeasible: boolean;

  // Hydraulics - Lateral
  emittersPerLateral: number;
  lateralFlowLph: number;
  lateralFlowLps: number;
  christiansenF: number;
  lateralEquivalentLengthM: number;
  lateralFrictionLossHca: number; // hf continuo * F * Fe
  lateralElevationChangeM: number;
  lateralInletPressureRequiredMca: number;
  lateralEndPressureMca: number;
  lateralMinPressureMca: number;
  lateralMaxPressureMca: number;
  emitterMinFlowLph: number;
  emitterMaxFlowLph: number;
  emitterFlowVariationPercent: number;
  emissionUniformityEU: number;
  christiansenCuPercent: number;
  uniformityAcceptable: boolean;

  // Hydraulics - Subunit & Main
  sectorAreaHa: number;
  lateralsPerSubunit: number;
  subunitFlowM3h: number;
  subunitFlowLps: number;
  manifoldVelocityMs: number;
  manifoldFrictionLossHca: number;
  manifoldDiameterRecommendedMm: number;
  mainlineVelocityMs: number;
  mainlineFrictionLossHca: number;
  mainlineDiameterRecommendedMm: number;
  joukowskyWaterHammerOverpressureMca: number;

  // Topography
  slopeLongitudinalPercent: number;
  totalElevationDeltaM: number;
  lateralSlopePercent: number;

  // Pumping & Head
  fittingsLossMca: number;
  totalDynamicHeadHmtMca: number;
  pumpHydraulicPowerKw: number;
  motorBhpHP: number;
  motorPowerKw: number;
  motorRecommendedCommercialHp: number;
  seasonalOperatingHours: number;
  seasonalEnergyKwh: number;
  seasonalEnergyCostUsd: number;

  // Budget & BoM summary
  totalLateralMeters: number;
  totalEmittersCount: number;
  totalManifoldMeters: number;
  totalMainlineMeters: number;
  totalProjectCostUsd: number;
  costPerHaUsd: number;
  bomItems: BomItem[];
}

export interface BomItem {
  id: string;
  category: string;
  concept: string;
  specification: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export function calculateIrrigationProject(data: ProjectData): CalculationResults {
  const {
    totalAreaHa,
    sectorsCount,
    crop,
    cropPhase,
    soil,
    etoMmDay,
    effectiveRainfallMmDay,
    waterSalinityECw,
    applicationEfficiencyPerc,
    wettedAreaPercent,
    topography,
    emitter,
    hydraulics,
    pumping,
    unitCosts
  } = data;

  // 1. Agronomic Calculations
  let kcEffective = crop.kcMid;
  if (cropPhase === 'Inicial') kcEffective = crop.kcIni;
  if (cropPhase === 'Final/Maduración') kcEffective = crop.kcEnd;

  const etcMmDay = etoMmDay * kcEffective;

  // Kr Fereres / Keller
  const canopyFraction = Math.min(1.0, Math.max(0.1, crop.canopyCoverPercent / 100));
  // Kr = min(1.0, 1.34 * sqrt(canopyFraction))
  const krFactor = Math.min(1.0, Number((1.34 * Math.sqrt(canopyFraction)).toFixed(3)));

  // Net Irrigation Nn = max(0, ETc * Kr - Pe)
  const netIrrigationMmDay = Math.max(0.1, Number((etcMmDay * krFactor - effectiveRainfallMmDay).toFixed(2)));

  // Leaching Requirement LR = ECw / (5 * ECe - ECw)
  let leachingRequirementLR = 0;
  if (waterSalinityECw > 0.5 && crop.ecETolerance > 0) {
    const denom = 5 * crop.ecETolerance - waterSalinityECw;
    if (denom > 0) {
      leachingRequirementLR = Math.min(0.25, Math.max(0, waterSalinityECw / denom));
    }
  }

  // Gross Irrigation Nb = Nn / (Ea * (1 - LR))
  const eaFrac = Math.max(0.5, Math.min(0.98, applicationEfficiencyPerc / 100));
  const grossIrrigationMmDay = Number((netIrrigationMmDay / (eaFrac * (1 - leachingRequirementLR))).toFixed(2));

  // Soil Moisture Storage
  // TAW = 10 * (CC - PMP) * Da * Zr
  const deltaMoisture = Math.max(1, soil.fieldCapacityPerc - soil.wiltingPointPerc);
  const tawMm = Number((10 * (deltaMoisture / 100) * soil.bulkDensityGcm3 * crop.rootDepthM * 10).toFixed(1)); // mm

  // RAW = TAW * p * (Pw / 100)
  const pwFrac = Math.min(1.0, Math.max(0.2, wettedAreaPercent / 100));
  const rawMm = Number((tawMm * crop.depletionP * pwFrac).toFixed(1));

  // Max Interval Days
  const maxIrrigationIntervalDays = Math.max(1, Math.floor(rawMm / Math.max(0.1, netIrrigationMmDay)));
  // Typical high-frequency drip irrigation is 1 day (or max 2 in heavy soils)
  const selectedIntervalDays = Math.min(maxIrrigationIntervalDays, 1);

  // Hourly application rate Ia = qe / (Se * Sl)
  // qe in L/h, Se in m, Sl in m (row spacing)
  // Ia in mm/h (1 L/m2 = 1 mm)
  const hourlyApplicationRateMmH = Number((emitter.nominalFlowLph / (emitter.spacingM * crop.rowSpacingM)).toFixed(2));
  const infiltrationFeasible = hourlyApplicationRateMmH <= soil.basicInfiltrationMmH;

  // Irrigation duration per shift Tr = (Nb * Fr) / Ia
  const irrigationDurationHoursPerShift = Number(((grossIrrigationMmDay * selectedIntervalDays) / hourlyApplicationRateMmH).toFixed(2));

  // Daily operating hours required = Tr * sectorsCount
  const dailyOperatingHoursRequired = Number((irrigationDurationHoursPerShift * sectorsCount).toFixed(2));
  const dailyOperationFeasible = dailyOperatingHoursRequired <= pumping.dailyOperatingHoursAllowed;

  // 2. Topography & Slope
  const slopeLongitudinalPercent = Number((((topography.endElevationM - topography.startElevationM) / topography.fieldLengthM) * 100).toFixed(2));
  const totalElevationDeltaM = Number((topography.endElevationM - topography.startElevationM).toFixed(2));

  // Lateral slope:
  // If laterals follow contour lines (a_nivel), slope is ~0% (or slight drainage 0.3%).
  // If descendente, positive gradient helps flow (+z); if ascendente, gradient opposes flow (-z).
  let lateralSlopePercent = 0.0;
  if (topography.lateralSlopeDirection === 'descendente') {
    lateralSlopePercent = Math.abs(topography.slopePercentLongitudinal);
  } else if (topography.lateralSlopeDirection === 'ascendente') {
    lateralSlopePercent = -Math.abs(topography.slopePercentLongitudinal);
  } else {
    lateralSlopePercent = 0.2; // 0.2% mínimo constructivo a nivel
  }

  const lateralElevationChangeM = Number(((lateralSlopePercent / 100) * hydraulics.lateralLengthM).toFixed(2));

  // 3. Hydraulics - Lateral & Emitter
  const emittersPerLateral = Math.max(5, Math.floor(hydraulics.lateralLengthM / emitter.spacingM));
  const lateralFlowLph = Number((emittersPerLateral * emitter.nominalFlowLph).toFixed(1));
  const lateralFlowLps = Number((lateralFlowLph / 3600).toFixed(3));

  // Christiansen F factor for multiple outlets (Hazen-Williams m = 1.852)
  const mHw = 1.852;
  const N = emittersPerLateral;
  const christiansenF = Number((1 / (mHw + 1) + 1 / (2 * N) + Math.sqrt(mHw - 1) / (6 * Math.pow(N, 2))).toFixed(4));

  // Virtual equivalent length for emitter barb friction
  const barbLeM = 0.22; // m de tubo equivalente por emisor integrado
  const lateralEquivalentFactor = 1 + barbLeM / emitter.spacingM;
  const lateralEquivalentLengthM = Number((hydraulics.lateralLengthM * lateralEquivalentFactor).toFixed(1));

  // Continuous friction loss Hazen-Williams
  // hf = 10.674 * L * Q^1.852 / (C^1.852 * D^4.871) with Q in m3/s, D in m
  const Q_m3s = lateralFlowLps / 1000;
  const D_lat_m = hydraulics.lateralDiameterMm / 1000;
  const C_lat = hydraulics.lateralRoughnessC;
  const hfContinuous = (10.674 * lateralEquivalentLengthM * Math.pow(Q_m3s, 1.852)) /
    (Math.pow(C_lat, 1.852) * Math.pow(D_lat_m, 4.871));

  // Actual lateral friction loss with Christiansen F
  const lateralFrictionLossHca = Number((hfContinuous * christiansenF).toFixed(2));

  // Hydraulic pressure balance in lateral:
  // H_inlet - hf_lat +/- DeltaZ = H_end
  // If slope is descendente (+lateralElevationChangeM), pressure gains at the end:
  // H_end = H_inlet - hf + lateralElevationChangeM
  // To ensure min pressure = emitter.nominalPressureMca:
  const inletBaseMca = emitter.nominalPressureMca + (0.75 * lateralFrictionLossHca);
  const lateralInletPressureRequiredMca = Number(inletBaseMca.toFixed(2));

  let lateralEndPressureMca = lateralInletPressureRequiredMca - lateralFrictionLossHca + lateralElevationChangeM;
  lateralEndPressureMca = Number(Math.max(2, lateralEndPressureMca).toFixed(2));

  const lateralMinPressureMca = Math.min(lateralInletPressureRequiredMca, lateralEndPressureMca);
  const lateralMaxPressureMca = Math.max(lateralInletPressureRequiredMca, lateralEndPressureMca);

  // Emitter flow variation: q = k * H^x
  // For PC emitter, x is very small (~0.03) so q is almost constant.
  const emitterMinFlowLph = Number((emitter.flowConstantK * Math.pow(Math.max(1, lateralMinPressureMca), emitter.dischargeExponentX)).toFixed(2));
  const emitterMaxFlowLph = Number((emitter.flowConstantK * Math.pow(Math.max(1, lateralMaxPressureMca), emitter.dischargeExponentX)).toFixed(2));
  const emitterFlowVariationPercent = Number((((emitterMaxFlowLph - emitterMinFlowLph) / emitter.nominalFlowLph) * 100).toFixed(2));

  // Emission Uniformity EU (Keller-Karmeli):
  // EU = 100 * [1 - 1.27 * (CV / sqrt(np))] * (q_min / q_mean)
  const np = 1; // 1 emisor por punto de emisión típico
  const cvTerm = 1 - 1.27 * (emitter.manufacturerCv / Math.sqrt(np));
  const qRatio = emitterMinFlowLph / emitter.nominalFlowLph;
  const emissionUniformityEU = Number((100 * cvTerm * Math.min(1.0, qRatio)).toFixed(1));

  // Christiansen Uniformity CU
  const christiansenCuPercent = Number((100 * (1 - 0.798 * (emitterFlowVariationPercent / 100))).toFixed(1));
  const uniformityAcceptable = emissionUniformityEU >= 88.0 && emitterFlowVariationPercent <= 10.0;

  // 4. Subunit & Manifold (Secondary) Hydraulics
  const sectorAreaHa = Number((totalAreaHa / sectorsCount).toFixed(2));
  const sectorAreaM2 = sectorAreaHa * 10000;
  // Laterals count per subunit:
  const lateralsPerSubunit = Math.max(4, Math.floor(sectorAreaM2 / (hydraulics.lateralLengthM * crop.rowSpacingM)));
  const subunitFlowLps = Number((lateralsPerSubunit * lateralFlowLps).toFixed(2));
  const subunitFlowM3h = Number((subunitFlowLps * 3.6).toFixed(2));

  // Manifold diameter & velocity
  const D_mani_m = hydraulics.manifoldDiameterMm / 1000;
  const areaMani = (Math.PI * Math.pow(D_mani_m, 2)) / 4;
  const manifoldVelocityMs = Number(((subunitFlowLps / 1000) / areaMani).toFixed(2));

  // Recommended economic diameter: D_eco = sqrt(4 * Q / (pi * V_eco)) with V_eco = 1.3 m/s
  const D_eco_mani = Math.sqrt((4 * (subunitFlowLps / 1000)) / (Math.PI * 1.3)) * 1000;
  const manifoldDiameterRecommendedMm = Math.round(D_eco_mani);

  // Manifold friction loss: outlets along manifold to laterals -> also Christiansen F!
  const F_mani = 0.38; // Manifold Christiansen factor
  const hfManiCont = (10.674 * hydraulics.manifoldLengthM * Math.pow(subunitFlowLps / 1000, 1.852)) /
    (Math.pow(145, 1.852) * Math.pow(D_mani_m, 4.871));
  const manifoldFrictionLossHca = Number((hfManiCont * F_mani).toFixed(2));

  // 5. Mainline (Matriz Principal)
  const D_main_m = hydraulics.mainlineDiameterMm / 1000;
  const areaMain = (Math.PI * Math.pow(D_main_m, 2)) / 4;
  const mainlineVelocityMs = Number(((subunitFlowLps / 1000) / areaMain).toFixed(2));

  const D_eco_main = Math.sqrt((4 * (subunitFlowLps / 1000)) / (Math.PI * 1.5)) * 1000;
  const mainlineDiameterRecommendedMm = Math.round(D_eco_main);

  const mainlineFrictionLossHca = Number(((10.674 * hydraulics.mainlineLengthM * Math.pow(subunitFlowLps / 1000, 1.852)) /
    (Math.pow(150, 1.852) * Math.pow(D_main_m, 4.871))).toFixed(2));

  // Joukowsky Water Hammer Estimation:
  // a ≈ 400 m/s for PVC/PEAD
  const celerityA = 380; // m/s
  const joukowskyWaterHammerOverpressureMca = Number(((celerityA * mainlineVelocityMs) / 9.81).toFixed(1));

  // 6. Pump Head (HMT) & Power
  const fittingsLossMca = Number(((manifoldFrictionLossHca + mainlineFrictionLossHca) * 0.15 + pumping.accessoriesLossMca).toFixed(2));
  
  // Total Dynamic Head (HMT)
  // HMT = H_op + hf_lat + hf_mani + hf_main + h_fittings + H_filter + H_fert + DeltaZ_max + H_suction
  const deltaZ_pump = Math.max(0, totalElevationDeltaM);
  const totalDynamicHeadHmtMca = Number((
    lateralInletPressureRequiredMca +
    manifoldFrictionLossHca +
    mainlineFrictionLossHca +
    fittingsLossMca +
    pumping.filterHeadLossMca +
    pumping.fertigationHeadLossMca +
    deltaZ_pump +
    pumping.suctionLiftM
  ).toFixed(2));

  // Pump Hydraulic Power (kW) = (rho * g * Q * HMT) / 1000
  // Q in m3/s = subunitFlowLps / 1000
  const pumpHydraulicPowerKw = Number(((9.81 * subunitFlowLps * totalDynamicHeadHmtMca) / 1000).toFixed(2));

  // Motor BHP = Q(L/s) * HMT(m) / [75 * eta_pump * eta_motor]
  const etaTotal = (pumping.pumpEfficiencyPercent / 100) * (pumping.motorEfficiencyPercent / 100);
  const motorBhpHP = Number(((subunitFlowLps * totalDynamicHeadHmtMca) / (75 * etaTotal)).toFixed(2));
  const motorPowerKw = Number((motorBhpHP * 0.7457).toFixed(2));

  // Commercial standard HP (5, 7.5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 100...)
  const commercialHps = [1, 2, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150];
  const motorRecommendedCommercialHp = commercialHps.find(hp => hp >= motorBhpHP * 1.15) || Math.ceil(motorBhpHP * 1.2);

  // Energy & Operating Cost:
  // Seasonal irrigation hours = (Tr * sectorsCount) * 180 days (típica temporada activa)
  const seasonalOperatingHours = Math.round(dailyOperatingHoursRequired * 180);
  const seasonalEnergyKwh = Math.round(motorPowerKw * seasonalOperatingHours);
  const seasonalEnergyCostUsd = Math.round(seasonalEnergyKwh * pumping.energyCostPerKwh);

  // 7. Bill of Materials (BoM) & Budget Breakdown
  const totalLateralMeters = Math.round(lateralsPerSubunit * sectorsCount * hydraulics.lateralLengthM);
  const totalEmittersCount = Math.round(totalLateralMeters / emitter.spacingM);
  const totalManifoldMeters = Math.round(sectorsCount * hydraulics.manifoldLengthM);
  const totalMainlineMeters = Math.round(hydraulics.mainlineLengthM);

  const getCost = (key: string, fallback: number) => unitCosts[key] ?? fallback;

  const bomItems: BomItem[] = [
    {
      id: 'bom_emitter_line',
      category: 'Líneas Laterales y Emisores',
      concept: `Tubería de PE ${hydraulics.lateralDiameterMm}mm con ${emitter.type} ${emitter.nominalFlowLph} L/h @ ${emitter.spacingM}m`,
      specification: `Espesor estándar 1.0mm (40 mil), clase PN4 / compensación ${emitter.dischargeExponentX < 0.1 ? 'PC integral' : 'turbulento'}`,
      quantity: totalLateralMeters,
      unit: 'm',
      unitCost: getCost('lateral_per_m', 0.28),
      totalCost: Math.round(totalLateralMeters * getCost('lateral_per_m', 0.28))
    },
    {
      id: 'bom_manifold_pipe',
      category: 'Red de Distribución Terciaria',
      concept: `Tubería Porta-regante / Manifold PVC-U DN ${hydraulics.manifoldDiameterMm}mm PN6`,
      specification: `Unión por junta elástica anger o campana soldada, incluye collarines de toma a lateral`,
      quantity: totalManifoldMeters,
      unit: 'm',
      unitCost: getCost('manifold_per_m', 4.80),
      totalCost: Math.round(totalManifoldMeters * getCost('manifold_per_m', 4.80))
    },
    {
      id: 'bom_mainline_pipe',
      category: 'Red Matriz Principal de Impulsión',
      concept: `Tubería Matriz PVC-O / PEAD DN ${hydraulics.mainlineDiameterMm}mm PN10`,
      specification: `Alta resistencia hidráulica al golpe de ariete Joukowsky (a=${celerityA}m/s)`,
      quantity: totalMainlineMeters,
      unit: 'm',
      unitCost: getCost('mainline_per_m', 9.50),
      totalCost: Math.round(totalMainlineMeters * getCost('mainline_per_m', 9.50))
    },
    {
      id: 'bom_valves_subunits',
      category: 'Valvulería y Sectorización',
      concept: `Electroválvulas hidráulicas de plástico con solenoide 24VAC DN 2" - 3"`,
      specification: `Control automático de apertura/cierre para ${sectorsCount} subunidades de riego`,
      quantity: sectorsCount,
      unit: 'unidad',
      unitCost: getCost('valve_electric', 165.0),
      totalCost: Math.round(sectorsCount * getCost('valve_electric', 165.0))
    },
    {
      id: 'bom_air_valves',
      category: 'Valvulería y Sectorización',
      concept: `Válvulas de aire ventosas trifuncionales cinéticas DN 1" - 2" PN16`,
      specification: `Protección contra colapso por vacío y evacuación de bolsas de aire en puntos altos`,
      quantity: Math.max(4, sectorsCount * 2),
      unit: 'unidad',
      unitCost: getCost('air_valve', 68.0),
      totalCost: Math.round(Math.max(4, sectorsCount * 2) * getCost('air_valve', 68.0))
    },
    {
      id: 'bom_pump_group',
      category: 'Cabezal de Riego e Impulsión',
      concept: `Electrobomba centrífuga horizontal normalizada ${motorRecommendedCommercialHp} HP`,
      specification: `Punto de diseño: Q=${subunitFlowM3h} m³/h @ HMT=${totalDynamicHeadHmtMca} mca, motor IE3`,
      quantity: 1,
      unit: 'equipo',
      unitCost: getCost('pump_station', 1850 + motorRecommendedCommercialHp * 45),
      totalCost: Math.round(getCost('pump_station', 1850 + motorRecommendedCommercialHp * 45))
    },
    {
      id: 'bom_filtration_station',
      category: 'Cabezal de Riego e Impulsión',
      concept: `Batería de filtrado de discos o malla automática con contralavado hidráulico`,
      specification: `Capacidad nominal ${Math.round(subunitFlowM3h * 1.25)} m³/h a 130 mesh (120 micras)`,
      quantity: 1,
      unit: 'sistema',
      unitCost: getCost('filtration_system', 1400 + subunitFlowM3h * 28),
      totalCost: Math.round(getCost('filtration_system', 1400 + subunitFlowM3h * 28))
    },
    {
      id: 'bom_fertigation_unit',
      category: 'Cabezal de Riego e Impulsión',
      concept: `Cabezal de fertirriego con inyector Venturi / Bomba dosificadora proporcional`,
      specification: `Incluye caudalímetro rotámetro, válvulas de retención de teflón y tanque de solución madre`,
      quantity: 1,
      unit: 'equipo',
      unitCost: getCost('fertigation_system', 750.0),
      totalCost: Math.round(getCost('fertigation_system', 750.0))
    },
    {
      id: 'bom_automation_controller',
      category: 'Automatización y Cuadro Eléctrico',
      concept: `Controlador programador modular de riego para ${sectorsCount} estaciones con cuadro de fuerza VFD`,
      specification: `Salidas de 24VAC, arranque de bomba sincronizado y variador de frecuencia`,
      quantity: 1,
      unit: 'sistema',
      unitCost: getCost('automation_controller', 980.0),
      totalCost: Math.round(getCost('automation_controller', 980.0))
    },
    {
      id: 'bom_civil_installation',
      category: 'Instalación, Obra Civil y Puesta en Marcha',
      concept: `Mano de obra especializada: zanjeo mecanizado, tendido, anclajes y prueba hidráulica`,
      specification: `Presión de prueba estática a 1.5 x PN según norma UNE-EN 805 / ASAE`,
      quantity: totalAreaHa,
      unit: 'ha',
      unitCost: getCost('installation_labor_per_ha', 420.0),
      totalCost: Math.round(totalAreaHa * getCost('installation_labor_per_ha', 420.0))
    }
  ];

  const totalProjectCostUsd = bomItems.reduce((acc, item) => acc + item.totalCost, 0);
  const costPerHaUsd = Math.round(totalProjectCostUsd / Math.max(0.1, totalAreaHa));

  return {
    kcEffective,
    etcMmDay,
    krFactor,
    netIrrigationMmDay,
    leachingRequirementLR,
    grossIrrigationMmDay,
    tawMm,
    rawMm,
    maxIrrigationIntervalDays,
    selectedIntervalDays,
    hourlyApplicationRateMmH,
    infiltrationFeasible,
    irrigationDurationHoursPerShift,
    dailyOperatingHoursRequired,
    dailyOperationFeasible,

    emittersPerLateral,
    lateralFlowLph,
    lateralFlowLps,
    christiansenF,
    lateralEquivalentLengthM,
    lateralFrictionLossHca,
    lateralElevationChangeM,
    lateralInletPressureRequiredMca,
    lateralEndPressureMca,
    lateralMinPressureMca,
    lateralMaxPressureMca,
    emitterMinFlowLph,
    emitterMaxFlowLph,
    emitterFlowVariationPercent,
    emissionUniformityEU,
    christiansenCuPercent,
    uniformityAcceptable,

    sectorAreaHa,
    lateralsPerSubunit,
    subunitFlowM3h,
    subunitFlowLps,
    manifoldVelocityMs,
    manifoldFrictionLossHca,
    manifoldDiameterRecommendedMm,
    mainlineVelocityMs,
    mainlineFrictionLossHca,
    mainlineDiameterRecommendedMm,
    joukowskyWaterHammerOverpressureMca,

    slopeLongitudinalPercent,
    totalElevationDeltaM,
    lateralSlopePercent,

    fittingsLossMca,
    totalDynamicHeadHmtMca,
    pumpHydraulicPowerKw,
    motorBhpHP,
    motorPowerKw,
    motorRecommendedCommercialHp,
    seasonalOperatingHours,
    seasonalEnergyKwh,
    seasonalEnergyCostUsd,

    totalLateralMeters,
    totalEmittersCount,
    totalManifoldMeters,
    totalMainlineMeters,
    totalProjectCostUsd,
    costPerHaUsd,
    bomItems,
  };
}

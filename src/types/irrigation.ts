export interface CropPreset {
  id: string;
  name: string;
  scientificName: string;
  category: 'Frutales' | 'Hortalizas' | 'Extensivos' | 'Forrajes' | 'Viveros y Flores';
  kcIni: number;
  kcMid: number;
  kcEnd: number;
  rootDepthM: number; // Profundidad radicular efectiva Zr (m)
  depletionP: number; // Fracción de agotamiento admisible p (0 - 1)
  plantSpacingM: number; // Distancia entre plantas (m)
  rowSpacingM: number; // Distancia entre hileras (m)
  canopyCoverPercent: number; // Porcentaje de cobertura de copa / sombra (%)
  ecETolerance: number; // Salinidad umbral del extracto de saturación ECe (dS/m)
}

export interface SoilPreset {
  id: string;
  texture: string;
  fieldCapacityPerc: number; // Capacidad de campo CC (% peso o vol)
  wiltingPointPerc: number; // Punto de marchitez permanente PMP (% peso o vol)
  bulkDensityGcm3: number; // Densidad aparente Da (g/cm3)
  basicInfiltrationMmH: number; // Infiltración básica Ib (mm/h)
}

export interface EmitterOption {
  id: string;
  type: 'Gotero Integrado PC' | 'Gotero Integrado No-PC' | 'Gotero Insertado Botón' | 'Microaspersor' | 'Aspersor de Impacto';
  nominalFlowLph: number; // Caudal nominal qn (l/h)
  nominalPressureMca: number; // Presión nominal de trabajo Hnom (mca)
  dischargeExponentX: number; // Exponente de descarga x
  flowConstantK: number; // Coeficiente k en q = k * H^x
  spacingM: number; // Espaciamiento entre emisores Se (m)
  manufacturerCv: number; // Coeficiente de variación de fabricación CV
  recommendedFiltrationMesh: number; // Malla recomendada (mesh / micras)
}

export interface TopographySettings {
  fieldLengthM: number; // Longitud del predio (sentido de laterales o eje X)
  fieldWidthM: number; // Ancho del predio (sentido de matriz o eje Y)
  startElevationM: number; // Cota inicial (m.s.n.m.)
  endElevationM: number; // Cota final en eje longitudinal (m.s.n.m.)
  contourIntervalM: number; // Equidistancia de curvas de nivel (m)
  lateralSlopeDirection: 'descendente' | 'ascendente' | 'a_nivel'; // Dirección del lateral respecto a pendiente
  slopePercentLongitudinal: number; // Pendiente longitudinal (%)
  slopePercentTransversal: number; // Pendiente transversal (%)
  pointsCount: number; // Densidad de muestreo
}

export interface HydraulicSettings {
  lateralDiameterMm: number; // Diámetro interior del lateral D_lat (mm)
  lateralRoughnessC: number; // Coeficiente Hazen-Williams (PE = 140-150)
  lateralLengthM: number; // Longitud de la línea lateral (m)
  emittersPerLateral: number;
  manifoldDiameterMm: number; // Diámetro interior tubería secundaria/manifold (mm)
  manifoldLengthM: number;
  mainlineDiameterMm: number; // Diámetro interior tubería matriz principal (mm)
  mainlineLengthM: number;
  pipeMaterial: 'PEAD' | 'PVC' | 'Aluminio';
}

export interface PumpingSettings {
  suctionLiftM: number; // Altura geométrica de aspiración (m)
  filterHeadLossMca: number; // Pérdida en cabezal de filtrado (mca)
  fertigationHeadLossMca: number; // Pérdida en cabezal de fertirriego (mca)
  accessoriesLossMca: number; // Válvulas, codos y piezas especiales (mca)
  pumpEfficiencyPercent: number; // Rendimiento de la electrobomba (0 - 100)
  motorEfficiencyPercent: number; // Rendimiento del motor eléctrico (0 - 100)
  dailyOperatingHoursAllowed: number; // Horas máximas disponibles de bombeo diario
  energyCostPerKwh: number; // Tarifa eléctrica ($/kWh)
}

export interface ProjectData {
  projectName: string;
  designerName: string;
  location: string;
  totalAreaHa: number;
  sectorsCount: number; // Número de subunidades o turnos de riego
  systemType: 'Goteo Subterráneo' | 'Goteo Superficial' | 'Microaspersión' | 'Aspersión Cobertura Total';
  
  // Agronomic
  crop: CropPreset;
  cropPhase: 'Inicial' | 'Desarrollo/Media' | 'Final/Maduración';
  soil: SoilPreset;
  etoMmDay: number; // Evapotranspiración potencial de referencia ETo (mm/día)
  effectiveRainfallMmDay: number; // Precipitación efectiva Pe (mm/día)
  waterSalinityECw: number; // Salinidad del agua de riego ECw (dS/m)
  applicationEfficiencyPerc: number; // Eficiencia de aplicación Ea (%)
  wettedAreaPercent: number; // Porcentaje de área mojada Pw (%)

  // Topography
  topography: TopographySettings;

  // Emitter
  emitter: EmitterOption;

  // Hydraulics
  hydraulics: HydraulicSettings;

  // Pump & Head
  pumping: PumpingSettings;

  // Custom unit costs
  unitCosts: Record<string, number>;
}

export interface FormulaDocumentation {
  id: string;
  name: string;
  category: 'Agronomía y Suelo' | 'Emisores y Uniformidad' | 'Hidráulica de Tuberías' | 'Curvas de Nivel y Topografía' | 'Estación de Bombeo';
  formulaLaTeX: string;
  purpose: string;
  variables: { symbol: string; name: string; unit: string; description: string }[];
  technicalCriteria: string;
  exampleCalculation?: string;
}

export interface CatalogItem {
  id: string;
  manufacturer: string;
  category: 'Emisores y Laterales de Goteo' | 'Aspersión y Microaspersión' | 'Filtración y Tratamiento' | 'Válvulas Hidráulicas y Ventosas' | 'Tuberías y Conducción' | 'Bombas y Grupos de Presión' | 'Automatización y Fertirriego';
  title: string;
  description: string;
  url: string;
  badge: string;
  officialSiteUrl: string;
}

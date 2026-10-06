import { SoilPreset, EmitterOption } from '../types/irrigation';

export const SOIL_DATABASE: SoilPreset[] = [
  {
    id: 'arenoso',
    texture: 'Arenoso (Sand)',
    fieldCapacityPerc: 9.0,
    wiltingPointPerc: 4.0,
    bulkDensityGcm3: 1.65,
    basicInfiltrationMmH: 30.0,
  },
  {
    id: 'franco_arenoso',
    texture: 'Franco Arenoso (Sandy Loam)',
    fieldCapacityPerc: 14.0,
    wiltingPointPerc: 6.0,
    bulkDensityGcm3: 1.50,
    basicInfiltrationMmH: 20.0,
  },
  {
    id: 'franco',
    texture: 'Franco (Loam) - Óptimo agronómico',
    fieldCapacityPerc: 22.0,
    wiltingPointPerc: 10.0,
    bulkDensityGcm3: 1.40,
    basicInfiltrationMmH: 12.0,
  },
  {
    id: 'franco_limoso',
    texture: 'Franco Limoso (Silt Loam)',
    fieldCapacityPerc: 27.0,
    wiltingPointPerc: 13.0,
    bulkDensityGcm3: 1.35,
    basicInfiltrationMmH: 10.0,
  },
  {
    id: 'franco_arcilloso',
    texture: 'Franco Arcilloso (Clay Loam)',
    fieldCapacityPerc: 31.0,
    wiltingPointPerc: 16.0,
    bulkDensityGcm3: 1.30,
    basicInfiltrationMmH: 7.5,
  },
  {
    id: 'arcilloso',
    texture: 'Arcilloso Pesado (Clay)',
    fieldCapacityPerc: 38.0,
    wiltingPointPerc: 22.0,
    bulkDensityGcm3: 1.25,
    basicInfiltrationMmH: 4.0,
  },
];

export const EMITTER_DATABASE: EmitterOption[] = [
  {
    id: 'drip_pc_1_6',
    type: 'Gotero Integrado PC',
    nominalFlowLph: 1.6,
    nominalPressureMca: 10.0, // 1.0 bar
    dischargeExponentX: 0.03, // Altamente autocompensante
    flowConstantK: 1.55,
    spacingM: 0.50,
    manufacturerCv: 0.03,
    recommendedFiltrationMesh: 130, // 130 mesh (120 micras)
  },
  {
    id: 'drip_pc_2_0',
    type: 'Gotero Integrado PC',
    nominalFlowLph: 2.0,
    nominalPressureMca: 10.0,
    dischargeExponentX: 0.04,
    flowConstantK: 1.90,
    spacingM: 0.60,
    manufacturerCv: 0.035,
    recommendedFiltrationMesh: 130,
  },
  {
    id: 'drip_pc_3_8',
    type: 'Gotero Integrado PC',
    nominalFlowLph: 3.8,
    nominalPressureMca: 10.0,
    dischargeExponentX: 0.05,
    flowConstantK: 3.50,
    spacingM: 0.75,
    manufacturerCv: 0.04,
    recommendedFiltrationMesh: 130,
  },
  {
    id: 'drip_turb_1_6',
    type: 'Gotero Integrado No-PC',
    nominalFlowLph: 1.6,
    nominalPressureMca: 10.0,
    dischargeExponentX: 0.48, // Laberinto turbulento estándar
    flowConstantK: 0.53,
    spacingM: 0.40,
    manufacturerCv: 0.05,
    recommendedFiltrationMesh: 130,
  },
  {
    id: 'drip_turb_2_2',
    type: 'Gotero Integrado No-PC',
    nominalFlowLph: 2.2,
    nominalPressureMca: 10.0,
    dischargeExponentX: 0.50,
    flowConstantK: 0.696,
    spacingM: 0.50,
    manufacturerCv: 0.055,
    recommendedFiltrationMesh: 130,
  },
  {
    id: 'micro_35',
    type: 'Microaspersor',
    nominalFlowLph: 35.0,
    nominalPressureMca: 20.0, // 2.0 bar
    dischargeExponentX: 0.50,
    flowConstantK: 7.826,
    spacingM: 3.5,
    manufacturerCv: 0.045,
    recommendedFiltrationMesh: 100, // 150 micras
  },
  {
    id: 'sprinkler_450',
    type: 'Aspersor de Impacto',
    nominalFlowLph: 480.0,
    nominalPressureMca: 30.0, // 3.0 bar
    dischargeExponentX: 0.50,
    flowConstantK: 87.63,
    spacingM: 12.0,
    manufacturerCv: 0.04,
    recommendedFiltrationMesh: 80,
  },
];

import React from 'react';
import { 
  Sprout, 
  Layers, 
  Sun, 
  Droplet, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';
import { CROPS_DATABASE } from '../data/cropsData';
import { SOIL_DATABASE } from '../data/soilData';

interface AgronomicModuleProps {
  data: ProjectData;
  results: CalculationResults;
  onChangeData: (updater: (prev: ProjectData) => ProjectData) => void;
  onJumpToFormula: (formulaId: string) => void;
}

export const AgronomicModule: React.FC<AgronomicModuleProps> = ({
  data,
  results,
  onChangeData,
  onJumpToFormula,
}) => {
  const { crop, soil } = data;

  const handleSelectCrop = (cropId: string) => {
    const selected = CROPS_DATABASE.find((c) => c.id === cropId);
    if (selected) {
      onChangeData((prev) => ({
        ...prev,
        crop: { ...selected },
      }));
    }
  };

  const handleSelectSoil = (soilId: string) => {
    const selected = SOIL_DATABASE.find((s) => s.id === soilId);
    if (selected) {
      onChangeData((prev) => ({
        ...prev,
        soil: { ...selected },
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Intro */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Sprout className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Módulo 1: Diseño Agronómico y Balance Hídrico de Suelo-Planta</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Cálculo de la evapotranspiración de diseño (FAO-56), lámina neta y bruta, fracción de lavado de sales, retención en el bulbo húmedo y tiempos de riego por turno.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fórmulas activas: FAO-56 Penman-Monteith, Fereres Kr, Rhoades LR, Keller-Karmeli RAW.</span>
        </div>
      </div>

      {/* Main Grid: Parameters Inputs & Real-time Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Selección de Cultivo */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Sprout className="w-4 h-4 text-emerald-600" />
                1.1. Parámetros Fisiológicos del Cultivo
              </h3>
              <span className="text-xs text-slate-500 font-mono">FAO-56 Monograph</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Cultivo Objetivo:</label>
                <select
                  value={crop.id}
                  onChange={(e) => handleSelectCrop(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {CROPS_DATABASE.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 italic mt-0.5 block">{crop.scientificName}</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Fase Fenológica Activa:</label>
                <select
                  value={data.cropPhase}
                  onChange={(e) =>
                    onChangeData((prev) => ({
                      ...prev,
                      cropPhase: e.target.value as any,
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Inicial">Fase Inicial (Kc = {crop.kcIni})</option>
                  <option value="Desarrollo/Media">Fase Media / Máxima Demanda (Kc = {crop.kcMid})</option>
                  <option value="Final/Maduración">Fase Final / Cosecha (Kc = {crop.kcEnd})</option>
                </select>
                <span className="text-[11px] text-emerald-700 font-medium mt-0.5 block">
                  Kc Efectivo de diseño: <strong className="font-bold">{results.kcEffective}</strong>
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Profundidad Radical Efectiva (Zr):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="3.0"
                    value={crop.rootDepthM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        crop: { ...prev.crop, rootDepthM: parseFloat(e.target.value) || 0.5 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Agotamiento Admisible (p):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="0.8"
                    value={crop.depletionP}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        crop: { ...prev.crop, depletionP: parseFloat(e.target.value) || 0.4 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">fracción</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Marco de Plantación (Entre Hileras):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="15.0"
                    value={crop.rowSpacingM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        crop: { ...prev.crop, rowSpacingM: parseFloat(e.target.value) || 3.0 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Distancia Entre Plantas:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="10.0"
                    value={crop.plantSpacingM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        crop: { ...prev.crop, plantSpacingM: parseFloat(e.target.value) || 1.5 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Cobertura Foliar / Sombra (Cc):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="5"
                    min="10"
                    max="100"
                    value={crop.canopyCoverPercent}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        crop: { ...prev.crop, canopyCoverPercent: parseFloat(e.target.value) || 50 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">%</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Factor Kr Fereres = {results.krFactor}</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tolerancia Salina del Cultivo (ECe):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="12.0"
                    value={crop.ecETolerance}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        crop: { ...prev.crop, ecETolerance: parseFloat(e.target.value) || 1.5 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">dS/m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Suelo y Textura */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Layers className="w-4 h-4 text-amber-600" />
                1.2. Características Físicas e Hidráulicas del Suelo
              </h3>
              <span className="text-xs text-slate-500 font-mono">Retención Hídrica</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Tipo de Textura del Suelo:</label>
                <select
                  value={soil.id}
                  onChange={(e) => handleSelectSoil(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SOIL_DATABASE.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.texture}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Capacidad de Campo (CC):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={soil.fieldCapacityPerc}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        soil: { ...prev.soil, fieldCapacityPerc: parseFloat(e.target.value) || 20 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Punto Marchitez Permanente (PMP):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={soil.wiltingPointPerc}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        soil: { ...prev.soil, wiltingPointPerc: parseFloat(e.target.value) || 10 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Densidad Aparente (Da):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    value={soil.bulkDensityGcm3}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        soil: { ...prev.soil, bulkDensityGcm3: parseFloat(e.target.value) || 1.4 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">g/cm³</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Infiltración Básica (Ib):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    value={soil.basicInfiltrationMmH}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        soil: { ...prev.soil, basicInfiltrationMmH: parseFloat(e.target.value) || 15 },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">mm/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Clima y Demanda */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                1.3. Variables Climatológicas y Calidad de Agua
              </h3>
              <span className="text-xs text-slate-500 font-mono">Demanda Evaporativa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">ETo Pico de Referencia:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="15.0"
                    value={data.etoMmDay}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        etoMmDay: parseFloat(e.target.value) || 5.0,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">mm/d</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Precipitación Efectiva (Pe):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20.0"
                    value={data.effectiveRainfallMmDay}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        effectiveRainfallMmDay: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">mm/d</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Salinidad del Agua (ECw):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="8.0"
                    value={data.waterSalinityECw}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        waterSalinityECw: parseFloat(e.target.value) || 0.8,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">dS/m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Eficiencia Aplicación (Ea):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="50"
                    max="98"
                    value={data.applicationEfficiencyPerc}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        applicationEfficiencyPerc: parseFloat(e.target.value) || 90,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Área Mojada (Pw):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="5"
                    min="20"
                    max="100"
                    value={data.wettedAreaPercent}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        wettedAreaPercent: parseFloat(e.target.value) || 40,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Nº Sectores de Riego:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="24"
                    value={data.sectorsCount}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        sectorsCount: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">turnos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Analysis & Decision Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-semibold text-emerald-400 text-sm flex items-center gap-2">
                <Droplet className="w-4 h-4" />
                Balance Hídrico y Resultados Agronómicos
              </h3>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Resumen Ejecutivo
              </span>
            </div>

            {/* Step-by-Step Mathematical Flow */}
            <div className="space-y-3 text-xs">
              {/* ETc */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span>1. Evapotranspiración del Cultivo (ETc)</span>
                    <button
                      onClick={() => onJumpToFormula('fao_etc')}
                      className="text-emerald-400 hover:text-emerald-300"
                      title="Ver fórmula y explicación técnica"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    ETc = {data.etoMmDay} mm/d × {results.kcEffective}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-white">{results.etcMmDay}</span>
                  <span className="text-[11px] text-slate-400 ml-1">mm/día</span>
                </div>
              </div>

              {/* Net & Gross Irrigation */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span>2. Lámina Neta (Nn) y Bruta (Nb)</span>
                    <button
                      onClick={() => onJumpToFormula('lamina_bruta_riego')}
                      className="text-emerald-400 hover:text-emerald-300"
                      title="Ver fórmula y explicación técnica"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Kr={results.krFactor} • LR={(results.leachingRequirementLR * 100).toFixed(1)}% • Ea={data.applicationEfficiencyPerc}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-emerald-300 font-bold text-sm">Nn = {results.netIrrigationMmDay} mm/d</div>
                  <div className="text-amber-300 font-bold text-sm">Nb = {results.grossIrrigationMmDay} mm/d</div>
                </div>
              </div>

              {/* Soil Storage TAW / RAW */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span>3. Retención Útil Suelo (RAW)</span>
                    <button
                      onClick={() => onJumpToFormula('capacidad_retencion_suelo')}
                      className="text-emerald-400 hover:text-emerald-300"
                      title="Ver fórmula y explicación técnica"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    TAW = {results.tawMm} mm • Bulbo Pw = {data.wettedAreaPercent}%
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-cyan-300">{results.rawMm}</span>
                  <span className="text-[11px] text-slate-400 ml-1">mm</span>
                  <div className="text-[10px] text-slate-400">Freq. agronómica: {results.maxIrrigationIntervalDays} días</div>
                </div>
              </div>

              {/* Application Rate vs Infiltration */}
              <div className={`p-3 rounded-lg border flex items-center justify-between ${
                results.infiltrationFeasible
                  ? 'bg-emerald-950/40 border-emerald-800/60'
                  : 'bg-rose-950/40 border-rose-800/60'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-200">
                    <span>4. Tasa Aplicación (Ia) vs Infiltración (Ib)</span>
                    <button
                      onClick={() => onJumpToFormula('tasa_aplicacion_horaria')}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Ia = {results.hourlyApplicationRateMmH} mm/h | Ib Suelo = {soil.basicInfiltrationMmH} mm/h
                  </p>
                </div>
                <div className="text-right">
                  {results.infiltrationFeasible ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs bg-emerald-500/20 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ia ≤ Ib (Sin Escorrentía)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-xs bg-rose-500/20 px-2 py-0.5 rounded">
                      <AlertTriangle className="w-3.5 h-3.5" /> Ia &gt; Ib (Riesgo Charco)
                    </span>
                  )}
                </div>
              </div>

              {/* Irrigation Times */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tiempo de Riego por Turno (Tr)</span>
                  </div>
                  <span className="font-bold text-white text-sm">
                    {results.irrigationDurationHoursPerShift} horas/sector
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Jornada Operativa Total ({data.sectorsCount} sectores)</span>
                  </div>
                  <span className={`font-bold text-sm ${
                    results.dailyOperationFeasible ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {results.dailyOperatingHoursRequired} h / {data.pumping.dailyOperatingHoursAllowed} h max
                  </span>
                </div>
                {!results.dailyOperationFeasible && (
                  <p className="text-[11px] text-rose-300 bg-rose-900/40 p-1.5 rounded border border-rose-800">
                    Advertencia: La jornada requerida excede las {data.pumping.dailyOperatingHoursAllowed} h máximas. Aumente el caudal del emisor, reduzca el número de sectores o divida en turnos simultáneos.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Technical Tip Card */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-xs space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-950">
              <Info className="w-4 h-4 text-amber-700" />
              Recomendación Especialista FAO-56:
            </h4>
            <p>
              Para cultivos permanentes como <strong>{crop.name}</strong>, el coeficiente de cobertura <span className="font-mono font-semibold">Kr = {results.krFactor}</span> evita la sobre-estimación de la demanda hídrica en un <strong>{((1 - results.krFactor) * 100).toFixed(0)}%</strong> respecto a un cultivo de cobertura completa, reduciendo directamente la potencia de bomba requerida y el consumo energético estacional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

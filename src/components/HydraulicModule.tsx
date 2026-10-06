import React from 'react';
import { 
  GitBranch, 
  Activity, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Info
} from 'lucide-react';
import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';
import { EMITTER_DATABASE } from '../data/soilData';

interface HydraulicModuleProps {
  data: ProjectData;
  results: CalculationResults;
  onChangeData: (updater: (prev: ProjectData) => ProjectData) => void;
  onJumpToFormula: (formulaId: string) => void;
}

export const HydraulicModule: React.FC<HydraulicModuleProps> = ({
  data,
  results,
  onChangeData,
  onJumpToFormula,
}) => {
  const { emitter, hydraulics } = data;

  const handleSelectEmitter = (emitterId: string) => {
    const selected = EMITTER_DATABASE.find((e) => e.id === emitterId);
    if (selected) {
      onChangeData((prev) => ({
        ...prev,
        emitter: { ...selected },
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-100 text-cyan-800 rounded-lg">
              <GitBranch className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Módulo 3: Hidráulica de Red, Laterales y Emisores</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ecuación de descarga $q = k \cdot H^x$, fricción Hazen-Williams con factor de salidas múltiples Christiansen (F), uniformidad EU y velocidad económica.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <Info className="w-4 h-4 text-cyan-600 shrink-0" />
          <span>Norma ISO 9261: Variación de caudal Δq ≤ 10% y Uniformidad EU ≥ 90%.</span>
        </div>
      </div>

      {/* Grid: Emitter & Lateral Inputs + Subunit Hydraulics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Emitter & Lateral Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Emitter Selection Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Gauge className="w-4 h-4 text-cyan-600" />
                3.1. Selección y Curva Característica del Emisor
              </h3>
              <button
                onClick={() => onJumpToFormula('ecuacion_emisor')}
                className="text-xs text-cyan-600 hover:text-cyan-800 font-semibold flex items-center gap-1"
              >
                Fórmula q=k·Hˣ <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Catálogo de Emisores Certificados:</label>
                <select
                  value={emitter.id}
                  onChange={(e) => handleSelectEmitter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                >
                  {EMITTER_DATABASE.map((em) => (
                    <option key={em.id} value={em.id}>
                      {em.type} - {em.nominalFlowLph} L/h @ {em.nominalPressureMca} mca (x={em.dischargeExponentX})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Caudal Nominal (qn):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={emitter.nominalFlowLph}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        emitter: {
                          ...prev.emitter,
                          nominalFlowLph: parseFloat(e.target.value) || 2.0,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-slate-500 font-semibold">L/h</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Presión Nominal (Hnom):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    value={emitter.nominalPressureMca}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        emitter: {
                          ...prev.emitter,
                          nominalPressureMca: parseFloat(e.target.value) || 10,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-slate-500 font-semibold">mca</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Exponente de Descarga (x):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1.0"
                    value={emitter.dischargeExponentX}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        emitter: {
                          ...prev.emitter,
                          dischargeExponentX: parseFloat(e.target.value) || 0.05,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-slate-500 font-semibold">adimensional</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {emitter.dischargeExponentX < 0.1 ? 'Autocompensante PC' : 'Flujo Turbulento'}
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Espaciamiento entre Emisores (Se):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min="0.15"
                    max="15"
                    value={emitter.spacingM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        emitter: {
                          ...prev.emitter,
                          spacingM: parseFloat(e.target.value) || 0.5,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Coef. Variación Fabricación (CV):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.005"
                    min="0.01"
                    max="0.15"
                    value={emitter.manufacturerCv}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        emitter: {
                          ...prev.emitter,
                          manufacturerCv: parseFloat(e.target.value) || 0.03,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-slate-500 font-semibold">ISO 9261</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Filtración Recomendada:</label>
                <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700 font-mono">
                  {emitter.recommendedFiltrationMesh} mesh (120 micras)
                </div>
              </div>
            </div>
          </div>

          {/* Lateral Hydraulics Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Sliders className="w-4 h-4 text-emerald-600" />
                3.2. Geometría y Fricción en el Lateral de Riego
              </h3>
              <button
                onClick={() => onJumpToFormula('factor_christiansen_f')}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                Factor F Christiansen <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Longitud del Lateral (L):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="5"
                    min="10"
                    max="500"
                    value={hydraulics.lateralLengthM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        hydraulics: {
                          ...prev.hydraulics,
                          lateralLengthM: parseFloat(e.target.value) || 100,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  {results.emittersPerLateral} emisores por hilera
                </span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diámetro Interior Lateral (D):</label>
                <select
                  value={hydraulics.lateralDiameterMm}
                  onChange={(e) =>
                    onChangeData((prev) => ({
                      ...prev,
                      hydraulics: {
                        ...prev.hydraulics,
                        lateralDiameterMm: parseFloat(e.target.value) || 13.8,
                      },
                    }))
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="13.8">16 mm nominal (Di = 13.8 mm, e=1.0mm)</option>
                  <option value="14.2">16 mm pared delgada (Di = 14.2 mm, e=0.9mm)</option>
                  <option value="17.4">20 mm nominal (Di = 17.4 mm, e=1.2mm)</option>
                  <option value="21.6">25 mm nominal (Di = 21.6 mm, e=1.5mm)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Rugosidad Hazen-Williams (C):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="155"
                    value={hydraulics.lateralRoughnessC}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        hydraulics: {
                          ...prev.hydraulics,
                          lateralRoughnessC: parseFloat(e.target.value) || 145,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">PEAD liso</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Caudal Total del Ramal:</label>
                <div className="p-2 bg-slate-100 rounded-lg text-slate-800 font-bold flex items-center justify-between">
                  <span>{results.lateralFlowLph} L/h</span>
                  <span className="text-[11px] text-slate-500 font-mono">({results.lateralFlowLps} L/s)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Manifold & Mainline Sizing Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-indigo-600" />
                3.3. Tubería Terciaria (Manifold) y Matriz Principal
              </h3>
              <button
                onClick={() => onJumpToFormula('dimensionamiento_velocidad_economica')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                Criterio Velocidad <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Diámetro Terciaria / Manifold:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="5"
                    value={hydraulics.manifoldDiameterMm}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        hydraulics: {
                          ...prev.hydraulics,
                          manifoldDiameterMm: parseFloat(e.target.value) || 63,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">mm</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                  <span>V = {results.manifoldVelocityMs} m/s</span>
                  <span className="text-indigo-700 font-semibold">Rec: {results.manifoldDiameterRecommendedMm} mm</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Diámetro Matriz Principal:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="5"
                    value={hydraulics.mainlineDiameterMm}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        hydraulics: {
                          ...prev.hydraulics,
                          mainlineDiameterMm: parseFloat(e.target.value) || 90,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">mm</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex justify-between">
                  <span>V = {results.mainlineVelocityMs} m/s</span>
                  <span className="text-indigo-700 font-semibold">Rec: {results.mainlineDiameterRecommendedMm} mm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hydraulic Verification & Analysis (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-semibold text-cyan-400 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Diagnóstico de Uniformidad y Pérdidas
              </h3>
              <span className="text-[11px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                ASAE EP458
              </span>
            </div>

            {/* Verification Cards */}
            <div className="space-y-3 text-xs">
              {/* Emission Uniformity EU */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <span>Uniformidad de Emisión (EU)</span>
                    <button
                      onClick={() => onJumpToFormula('uniformidad_emision_eu')}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    CV={emitter.manufacturerCv} • q_min={results.emitterMinFlowLph} L/h
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-bold ${
                    results.emissionUniformityEU >= 90 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {results.emissionUniformityEU}%
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {results.emissionUniformityEU >= 90 ? 'Excelente (>90%)' : 'Aceptable (80-90%)'}
                  </div>
                </div>
              </div>

              {/* Christiansen Uniformity CU */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-medium">Coeficiente Christiansen (CU)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    Factor F = {results.christiansenF}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-emerald-400">{results.christiansenCuPercent}%</span>
                </div>
              </div>

              {/* Head loss & Pressure Variation */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Fricción Hazen-Williams (hf lateral)</span>
                  <span className="text-amber-300 font-bold font-mono">{results.lateralFrictionLossHca} mca</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Presión en Entrada Requerida</span>
                  <span className="text-emerald-300 font-bold font-mono">{results.lateralInletPressureRequiredMca} mca</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Presión en Cola del Lateral</span>
                  <span className="text-white font-bold font-mono">{results.lateralEndPressureMca} mca</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-700/60">
                  <span className="text-slate-300 font-medium">Variación de Caudal (Δq)</span>
                  <span className={`font-bold font-mono ${
                    results.emitterFlowVariationPercent <= 10 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {results.emitterFlowVariationPercent}% {results.emitterFlowVariationPercent <= 10 ? '✓ (≤10%)' : '✖ (>10%)'}
                  </span>
                </div>
              </div>

              {/* Joukowsky Water Hammer */}
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sobrepresión Ariete (Joukowsky)</span>
                    <button
                      onClick={() => onJumpToFormula('golpe_de_ariete_joukowsky')}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <ArrowRight className="w-3.5 h-3.5 inline" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    V matriz = {results.mainlineVelocityMs} m/s
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-amber-400">+{results.joukowskyWaterHammerOverpressureMca} mca</span>
                  <div className="text-[10px] text-slate-400">Exige tubo PN10 mínimo</div>
                </div>
              </div>

              {/* Status Compliance Badge */}
              <div className={`p-3 rounded-lg border text-xs flex items-center gap-2.5 ${
                results.uniformityAcceptable
                  ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800/80 text-amber-300'
              }`}>
                {results.uniformityAcceptable ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span><strong>Conforme a Norma:</strong> La uniformidad hidráulica cumple con los estándares internacionales para riego de alta eficiencia.</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <span><strong>Alerta Hidráulica:</strong> La variación de caudal o pérdidas supera los límites recomendados. Aumente el diámetro o use goteros PC.</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

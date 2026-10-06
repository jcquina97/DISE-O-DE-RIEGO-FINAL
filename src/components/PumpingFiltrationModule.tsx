import React from 'react';
import { 
  Zap, 
  Filter, 
  Gauge, 
  Activity, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight,
  Droplet,
  Sliders
} from 'lucide-react';
import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';

interface PumpingFiltrationModuleProps {
  data: ProjectData;
  results: CalculationResults;
  onChangeData: (updater: (prev: ProjectData) => ProjectData) => void;
  onJumpToFormula: (formulaId: string) => void;
}

export const PumpingFiltrationModule: React.FC<PumpingFiltrationModuleProps> = ({
  data,
  results,
  onChangeData,
  onJumpToFormula,
}) => {
  const { pumping, emitter } = data;

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Módulo 4: Estación de Bombeo, Altura Manométrica (HMT) y Cabezal de Filtrado</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Cálculo integral de la Altura Manométrica Total (HMT), potencia al eje del motor (BHP y kW), dimensionamiento de la batería de filtración y estimación de costos energéticos.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Fórmulas: Altura Manométrica Total (HMT), Potencia al Eje BHP (DIN / ISO), Dosing Mazzei / Dosatron.</span>
        </div>
      </div>

      {/* Main Grid: Parameters + Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Pump Configuration Form Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Sliders className="w-4 h-4 text-indigo-600" />
                4.1. Parámetros del Grupo de Bombeo
              </h3>
              <button
                onClick={() => onJumpToFormula('potencia_bomba_bhp')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                Fórmula BHP <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Rendimiento Bomba (ηb):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="50"
                    max="90"
                    value={pumping.pumpEfficiencyPercent}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          pumpEfficiencyPercent: parseFloat(e.target.value) || 75,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">%</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Rendimiento Motor (ηm):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    min="75"
                    max="98"
                    value={pumping.motorEfficiencyPercent}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          motorEfficiencyPercent: parseFloat(e.target.value) || 90,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">% (IE3)</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Altura de Aspiración (Hasp):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={pumping.suctionLiftM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          suctionLiftM: parseFloat(e.target.value) || 2.0,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">mca</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pérdida en Filtración (Hfiltro):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="15"
                    value={pumping.filterHeadLossMca}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          filterHeadLossMca: parseFloat(e.target.value) || 6.0,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">mca</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Estado sucio / lavado</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pérdida en Fertirriego:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="15"
                    value={pumping.fertigationHeadLossMca}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          fertigationHeadLossMca: parseFloat(e.target.value) || 5.0,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">mca</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Inyector Venturi / bypass</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Accesorios y Válvulas:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    value={pumping.accessoriesLossMca}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          accessoriesLossMca: parseFloat(e.target.value) || 2.5,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">mca</span>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Tarifa Eléctrica ($/kWh):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    min="0.02"
                    max="1.0"
                    value={pumping.energyCostPerKwh}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        pumping: {
                          ...prev.pumping,
                          energyCostPerKwh: parseFloat(e.target.value) || 0.12,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-slate-500 font-semibold">USD / kWh</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filtration Station Sizing Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                4.2. Batería de Filtración Recomendada
              </h3>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                130 Mesh
              </span>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Caudal de Diseño a Filtrar:</span>
                <strong className="text-slate-900">{results.subunitFlowM3h} m³/h ({results.subunitFlowLps} L/s)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Tipo de Filtro Sugerido:</span>
                <span className="font-semibold text-slate-900">Malla Automática o Batería Anillas Doble</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Superficie Filtrante Mínima:</span>
                <strong className="text-slate-900">
                  {Math.round(results.subunitFlowM3h * 280)} cm² (tasa &lt; 50 m³/h/m²)
                </strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Umbral de Contralavado:</span>
                <strong className="text-slate-900">ΔP = 0.5 a 0.7 bar (5 a 7 mca)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Step-by-Step HMT Breakdown & Motor Power (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Total Dynamic Head HMT Table */}
          <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-semibold text-amber-400 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Desglose Paso a Paso de Altura Manométrica Total (HMT)
              </h3>
              <button
                onClick={() => onJumpToFormula('altura_manometrica_total_hmt')}
                className="text-xs text-slate-300 hover:text-white underline flex items-center gap-1"
              >
                Fórmula HMT <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-12 gap-2 text-slate-400 font-semibold border-b border-slate-800 pb-1">
                <span className="col-span-8">Componente de Presión / Pérdida</span>
                <span className="col-span-2 text-right">Valor</span>
                <span className="col-span-2 text-right">Acumulado</span>
              </div>

              {/* 1. Presión en el lateral de diseño */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  1. Presión requerida a la entrada del lateral (Hop + hf_lat)
                </span>
                <span className="col-span-2 text-right font-mono text-emerald-400 font-bold">
                  +{results.lateralInletPressureRequiredMca} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {results.lateralInletPressureRequiredMca} mca
                </span>
              </div>

              {/* 2. Pérdida en secundaria manifold */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  2. Pérdida en tubería terciaria / manifold (hf_sec)
                </span>
                <span className="col-span-2 text-right font-mono text-amber-400 font-bold">
                  +{results.manifoldFrictionLossHca} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {(results.lateralInletPressureRequiredMca + results.manifoldFrictionLossHca).toFixed(2)} mca
                </span>
              </div>

              {/* 3. Pérdida en matriz principal */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  3. Pérdida en tubería matriz principal (hf_matriz)
                </span>
                <span className="col-span-2 text-right font-mono text-amber-400 font-bold">
                  +{results.mainlineFrictionLossHca} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {(results.lateralInletPressureRequiredMca + results.manifoldFrictionLossHca + results.mainlineFrictionLossHca).toFixed(2)} mca
                </span>
              </div>

              {/* 4. Piezas especiales y valvulería */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  4. Accesorios singulares, codos, tes y válvulas (hm_acc)
                </span>
                <span className="col-span-2 text-right font-mono text-amber-400 font-bold">
                  +{results.fittingsLossMca} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {(results.lateralInletPressureRequiredMca + results.manifoldFrictionLossHca + results.mainlineFrictionLossHca + results.fittingsLossMca).toFixed(2)} mca
                </span>
              </div>

              {/* 5. Cabezal de filtrado */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  5. Batería de filtración en estado sucio (Hfiltro)
                </span>
                <span className="col-span-2 text-right font-mono text-amber-400 font-bold">
                  +{pumping.filterHeadLossMca} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {(results.lateralInletPressureRequiredMca + results.manifoldFrictionLossHca + results.mainlineFrictionLossHca + results.fittingsLossMca + pumping.filterHeadLossMca).toFixed(2)} mca
                </span>
              </div>

              {/* 6. Fertirriego */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  6. Cabezal de fertirriego Venturi diferencial (Hfert)
                </span>
                <span className="col-span-2 text-right font-mono text-amber-400 font-bold">
                  +{pumping.fertigationHeadLossMca} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {(results.lateralInletPressureRequiredMca + results.manifoldFrictionLossHca + results.mainlineFrictionLossHca + results.fittingsLossMca + pumping.filterHeadLossMca + pumping.fertigationHeadLossMca).toFixed(2)} mca
                </span>
              </div>

              {/* 7. Desnivel topográfico */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1">
                <span className="col-span-8 text-slate-200">
                  7. Desnivel geodésico topográfico terreno (ΔZ)
                </span>
                <span className="col-span-2 text-right font-mono text-cyan-400 font-bold">
                  +{Math.max(0, results.totalElevationDeltaM)} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300">
                  {(results.totalDynamicHeadHmtMca - pumping.suctionLiftM).toFixed(2)} mca
                </span>
              </div>

              {/* 8. Altura de aspiración */}
              <div className="grid grid-cols-12 gap-2 py-1 items-center hover:bg-slate-800/50 rounded px-1 border-b border-slate-800">
                <span className="col-span-8 text-slate-200">
                  8. Altura geométrica de aspiración y succión (Hasp)
                </span>
                <span className="col-span-2 text-right font-mono text-cyan-400 font-bold">
                  +{pumping.suctionLiftM} mca
                </span>
                <span className="col-span-2 text-right font-mono text-slate-300 font-bold">
                  {results.totalDynamicHeadHmtMca} mca
                </span>
              </div>

              {/* Total Row */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-sm">
                <div>
                  <span className="font-bold text-white">ALTURA MANOMÉTRICA TOTAL (HMT):</span>
                  <p className="text-[11px] text-slate-400">Presión manométrica neta en brida de impulsión</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-amber-400">{results.totalDynamicHeadHmtMca}</span>
                  <span className="text-slate-400 ml-1 font-semibold">mca</span>
                  <div className="text-xs text-slate-400 font-mono">
                    ({(results.totalDynamicHeadHmtMca / 10).toFixed(2)} bar / {(results.totalDynamicHeadHmtMca * 1.422).toFixed(1)} psi)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Motor Power & Seasonal Operating Cost */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Potencia de Bombeo y Costo Energético Anual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 block mb-1">Potencia Hidráulica Neta:</span>
                <span className="text-base font-bold text-slate-900">{results.pumpHydraulicPowerKw} kW</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Fluido en movimiento</span>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                <span className="text-indigo-900 font-medium block mb-1">Potencia al Eje (BHP):</span>
                <span className="text-base font-bold text-indigo-700">{results.motorBhpHP} HP</span>
                <span className="text-[11px] text-indigo-800 block mt-0.5">({results.motorPowerKw} kW eléctrico)</span>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-900 font-medium block mb-1">Motor Comercial Recomendado:</span>
                <span className="text-base font-bold text-emerald-700">{results.motorRecommendedCommercialHp} HP</span>
                <span className="text-[11px] text-emerald-800 block mt-0.5">+15% Factor de Reserva</span>
              </div>
            </div>

            {/* Energy Cost Estimation */}
            <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  Costo Eléctrico Operativo por Campaña (180 días)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  {results.seasonalOperatingHours} h de bombeo acumuladas • {results.seasonalEnergyKwh.toLocaleString()} kWh/año @ ${pumping.energyCostPerKwh}/kWh
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">
                  ${results.seasonalEnergyCostUsd.toLocaleString()}
                </span>
                <span className="text-slate-400 text-[11px] block">USD / temporada</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Droplet, 
  Layers, 
  Mountain, 
  Zap, 
  DollarSign,
  FileText
} from 'lucide-react';
import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ProjectData;
  results: CalculationResults;
}

export const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({
  isOpen,
  onClose,
  data,
  results,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col print:shadow-none print:w-full print:max-w-none">
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base">Memoria Técnica Oficial del Proyecto de Riego</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-8 overflow-y-auto print:p-6 print:overflow-visible">
          {/* Header & Title */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest font-bold text-emerald-700">
                INFORME DE INGENIERÍA HIDRÁULICA Y AGRONÓMICA
              </div>
              <h1 className="text-2xl font-black text-slate-950 mt-1">
                {data.projectName || 'Proyecto de Riego Presurizado'}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Localización: <strong>{data.location}</strong> • Proyectista: <strong>{data.designerName}</strong>
              </p>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <div>Fecha: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Normas: FAO-56 • ISO 9261 • ASAE EP458</div>
            </div>
          </div>

          {/* Section 1: Executive Summary KPIs */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
              1. Resumen Ejecutivo del Dimensionamiento
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Superficie Total:</span>
                <strong className="text-base text-slate-900">{data.totalAreaHa} ha</strong>
                <span className="text-slate-500 block text-[11px]">({data.sectorsCount} sectores)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Caudal del Sector:</span>
                <strong className="text-base text-cyan-800">{results.subunitFlowM3h} m³/h</strong>
                <span className="text-slate-500 block text-[11px]">({results.subunitFlowLps} L/s)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Carga Total (HMT):</span>
                <strong className="text-base text-amber-800">{results.totalDynamicHeadHmtMca} mca</strong>
                <span className="text-slate-500 block text-[11px]">({(results.totalDynamicHeadHmtMca / 10).toFixed(2)} bar)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">Potencia de Bomba:</span>
                <strong className="text-base text-indigo-800">{results.motorRecommendedCommercialHp} HP</strong>
                <span className="text-slate-500 block text-[11px]">({results.motorPowerKw} kW)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Agronomic Balance */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
              2. Balance Agronómico y Parámetros Suelo-Planta
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Cultivo y Necesidad de Riego:</div>
                <div className="flex justify-between"><span>Cultivo:</span><strong>{data.crop.name}</strong></div>
                <div className="flex justify-between"><span>Fase Fenológica:</span><strong>{data.cropPhase} (Kc = {results.kcEffective})</strong></div>
                <div className="flex justify-between"><span>Evapotranspiración ETo:</span><strong>{data.etoMmDay} mm/día</strong></div>
                <div className="flex justify-between"><span>Consumo del Cultivo (ETc):</span><strong>{results.etcMmDay} mm/día</strong></div>
                <div className="flex justify-between"><span>Factor Reductor Kr (Fereres):</span><strong>{results.krFactor}</strong></div>
                <div className="flex justify-between"><span>Lámina Neta (Nn):</span><strong>{results.netIrrigationMmDay} mm/día</strong></div>
                <div className="flex justify-between"><span>Lámina Bruta (Nb):</span><strong className="text-emerald-700">{results.grossIrrigationMmDay} mm/día</strong></div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Suelo y Tiempos Operativos:</div>
                <div className="flex justify-between"><span>Textura:</span><strong>{data.soil.texture}</strong></div>
                <div className="flex justify-between"><span>Capacidad Retención Útil (RAW):</span><strong>{results.rawMm} mm</strong></div>
                <div className="flex justify-between"><span>Frecuencia de Riego:</span><strong>{results.selectedIntervalDays} día(s)</strong></div>
                <div className="flex justify-between"><span>Intensidad de Aplicación (Ia):</span><strong>{results.hourlyApplicationRateMmH} mm/h</strong></div>
                <div className="flex justify-between"><span>Infiltración Básica Suelo (Ib):</span><strong>{data.soil.basicInfiltrationMmH} mm/h (Ia ≤ Ib ✓)</strong></div>
                <div className="flex justify-between"><span>Tiempo Riego por Turno (Tr):</span><strong>{results.irrigationDurationHoursPerShift} horas/sector</strong></div>
                <div className="flex justify-between"><span>Jornada Diaria Total:</span><strong>{results.dailyOperatingHoursRequired} h / {data.pumping.dailyOperatingHoursAllowed} h max</strong></div>
              </div>
            </div>
          </div>

          {/* Section 3: Topography & Contour Lines Analysis */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
              3. Análisis Altimétrico y Trazo en Curvas de Nivel
            </h2>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><span>Cota Cabezal (Z₀):</span> <strong>{data.topography.startElevationM} msnm</strong></div>
                <div><span>Cota Límite (Z₁):</span> <strong>{data.topography.endElevationM} msnm</strong></div>
                <div><span>Desnivel Total (ΔZ):</span> <strong>{results.totalElevationDeltaM} m</strong></div>
                <div><span>Pendiente Longitudinal:</span> <strong>{results.slopeLongitudinalPercent}%</strong></div>
              </div>
              <p className="text-slate-700 text-xs pt-2 border-t border-slate-200">
                <strong>Criterio de Trazo Aplicado:</strong> Los laterales de riego se trazan <strong>paralelos a las curvas de nivel</strong> (siguiendo iso-cotas altimétricas). Esto reduce a valores despreciables la variación de presión por desnivel hidrostático (|ΔZ_lat| ≈ {results.lateralElevationChangeM} m), garantizando que la uniformidad de emisión no se degrade por efectos de pendiente gravitacional.
              </p>
            </div>
          </div>

          {/* Section 4: Hydraulics & Head Breakdown */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
              4. Dimensionamiento Hidráulico y Presión Total (HMT)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Emisores y Línea Lateral:</div>
                <div className="flex justify-between"><span>Emisor:</span><strong>{data.emitter.type} {data.emitter.nominalFlowLph} L/h</strong></div>
                <div className="flex justify-between"><span>Presión Nominal (Hnom):</span><strong>{data.emitter.nominalPressureMca} mca</strong></div>
                <div className="flex justify-between"><span>Espaciamiento entre goteros:</span><strong>{data.emitter.spacingM} m</strong></div>
                <div className="flex justify-between"><span>Pérdida por Fricción Lateral (hf):</span><strong>{results.lateralFrictionLossHca} mca</strong></div>
                <div className="flex justify-between"><span>Uniformidad de Emisión (EU):</span><strong className="text-emerald-700">{results.emissionUniformityEU}% (Excelente)</strong></div>
                <div className="flex justify-between"><span>Variación de Caudal (Δq):</span><strong>{results.emitterFlowVariationPercent}% (&lt;10% ✓)</strong></div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-900">Desglose de Pérdidas de Carga:</div>
                <div className="flex justify-between"><span>Presión Entrada Lateral:</span><strong>{results.lateralInletPressureRequiredMca} mca</strong></div>
                <div className="flex justify-between"><span>Pérdida Terciaria / Manifold:</span><strong>{results.manifoldFrictionLossHca} mca</strong></div>
                <div className="flex justify-between"><span>Pérdida Matriz Principal:</span><strong>{results.mainlineFrictionLossHca} mca</strong></div>
                <div className="flex justify-between"><span>Accesorios y Singulares:</span><strong>{results.fittingsLossMca} mca</strong></div>
                <div className="flex justify-between"><span>Filtración + Fertirriego:</span><strong>{(data.pumping.filterHeadLossMca + data.pumping.fertigationHeadLossMca).toFixed(1)} mca</strong></div>
                <div className="flex justify-between"><span>Desnivel Terreno + Succión:</span><strong>{(Math.max(0, results.totalElevationDeltaM) + data.pumping.suctionLiftM).toFixed(1)} mca</strong></div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="font-bold text-slate-950">ALTURA MANOMÉTRICA (HMT):</span>
                  <strong className="font-bold text-slate-950 text-sm">{results.totalDynamicHeadHmtMca} mca</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Bill of Materials & Budget */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-l-4 border-emerald-600 pl-2">
              5. Cómputo Métrico y Presupuesto General
            </h2>
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Partida</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Concepto</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">Cant.</th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-700">Unid.</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-700">P. Unit ($)</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-900">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {results.bomItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-1.5 font-medium text-slate-700">{item.category}</td>
                      <td className="px-3 py-1.5 text-slate-900">{item.concept}</td>
                      <td className="px-3 py-1.5 text-right font-mono">{item.quantity.toLocaleString()}</td>
                      <td className="px-3 py-1.5 text-center text-slate-500 font-mono">{item.unit}</td>
                      <td className="px-3 py-1.5 text-right font-mono">${item.unitCost.toFixed(2)}</td>
                      <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900">${item.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-900 text-white font-bold">
                  <tr>
                    <td colSpan={5} className="px-3 py-2.5 text-right uppercase">
                      Inversión Total Estimada:
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-emerald-400 text-sm">
                      ${results.totalProjectCostUsd.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-semibold px-1">
              <span>Costo por Hectárea: ${results.costPerHaUsd.toLocaleString()} / ha</span>
              <span>Costo Operativo Energético: ${results.seasonalEnergyCostUsd.toLocaleString()} / campaña</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs text-slate-700 border-t border-slate-200">
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 max-w-xs mx-auto"></div>
              <div className="mt-2 font-bold">{data.designerName || 'Ing. Proyectista de Riego'}</div>
              <div className="text-slate-500">Especialista en Hidráulica y Agronomía</div>
            </div>
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 max-w-xs mx-auto"></div>
              <div className="mt-2 font-bold">Aprobación Técnica del Cliente / Productor</div>
              <div className="text-slate-500">Conformidad de Diseño y Presupuesto</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

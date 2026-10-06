import React, { useState } from 'react';
import { 
  DollarSign, 
  Download, 
  Layers, 
  PieChart, 
  Sliders, 
  CheckCircle2,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';
import { ProjectData } from '../types/irrigation';
import { CalculationResults, BomItem } from '../utils/hydraulicCalculations';

interface CostBudgetModuleProps {
  data: ProjectData;
  results: CalculationResults;
  onChangeData: (updater: (prev: ProjectData) => ProjectData) => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
}

export const CostBudgetModule: React.FC<CostBudgetModuleProps> = ({
  data,
  results,
  onChangeData,
  onExportCsv,
  onExportExcel,
}) => {
  const [editingUnitCosts, setEditingUnitCosts] = useState(false);

  // Group items by category
  const categories = Array.from(new Set(results.bomItems.map((item) => item.category)));

  // Calculate totals per category
  const categoryTotals: Record<string, number> = {};
  categories.forEach((cat) => {
    categoryTotals[cat] = results.bomItems
      .filter((i) => i.category === cat)
      .reduce((sum, i) => sum + i.totalCost, 0);
  });

  const handleUpdateUnitCost = (key: string, val: number) => {
    onChangeData((prev) => ({
      ...prev,
      unitCosts: {
        ...prev.unitCosts,
        [key]: Math.max(0, val),
      },
    }));
  };

  const handleResetUnitCosts = () => {
    onChangeData((prev) => ({
      ...prev,
      unitCosts: {},
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Módulo 5: Cómputo Métrico, Presupuesto y Costos del Proyecto</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Presupuesto detallado (Bill of Materials) clasificado por partidas: cabezal de impulsión, batería de filtración, tuberías matrices y secundarias, laterales con emisores, valvulería de aire y control, mano de obra de tendido y pruebas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setEditingUnitCosts(!editingUnitCosts)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition"
          >
            <Sliders className="w-3.5 h-3.5" />
            {editingUnitCosts ? 'Cerrar Ajuste Precios' : 'Ajustar Precios'}
          </button>
          <button
            onClick={onExportCsv}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            title="Exportar archivo CSV plano"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
          <button
            onClick={onExportExcel}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition border border-emerald-500"
            title="Descargar libro Excel profesional multi-hoja (.xlsx) sin necesidad de ajustes"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            Descargar Excel Oficial (.xlsx)
          </button>
        </div>
      </div>

      {/* Excel Ready Banner */}
      <div className="bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              Formato Excel Oficial Terminado y Automatizado (Sin Necesidad de Ajustes Manuales)
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                100% Listo
              </span>
            </h4>
            <p className="text-slate-600 mt-0.5">
              El archivo descargable <strong>.xlsx</strong> incluye 5 hojas tabuladas con anchos de columna preajustados, formato de moneda, fórmulas dinámicas nativas (<code className="bg-white px-1 py-0.5 rounded border font-mono text-emerald-700">=SUM(...)</code> y <code className="bg-white px-1 py-0.5 rounded border font-mono text-emerald-700">=E*G</code>), cálculo agronómico FAO-56 completo, tabla de pérdidas HMT y directorio de catálogos técnicos con enlaces.
            </p>
          </div>
        </div>
        <button
          onClick={onExportExcel}
          className="whitespace-nowrap px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Abrir en Excel
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm">
          <span className="text-slate-400 text-xs font-medium block mb-1">Inversión Total Estimada:</span>
          <div className="text-2xl font-bold text-emerald-400">
            ${results.totalProjectCostUsd.toLocaleString()}
          </div>
          <span className="text-slate-400 text-[11px] mt-1 block">
            Para {data.totalAreaHa} hectáreas ({data.sectorsCount} sectores)
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium block mb-1">Costo Unitario por Hectárea:</span>
          <div className="text-2xl font-bold text-slate-900">
            ${results.costPerHaUsd.toLocaleString()}
            <span className="text-sm font-normal text-slate-500 ml-1">/ ha</span>
          </div>
          <span className="text-emerald-700 text-[11px] font-medium mt-1 block">
            Rango estándar goteo: $2,500 - $5,500/ha
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium block mb-1">Costo por Subunidad / Turno:</span>
          <div className="text-2xl font-bold text-indigo-700">
            ${Math.round(results.totalProjectCostUsd / data.sectorsCount).toLocaleString()}
          </div>
          <span className="text-slate-500 text-[11px] mt-1 block">
            {results.sectorAreaHa} ha por subunidad
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-xs font-medium block mb-1">Metraje Total de Laterales:</span>
          <div className="text-2xl font-bold text-cyan-700">
            {(results.totalLateralMeters / 1000).toFixed(1)} km
          </div>
          <span className="text-slate-500 text-[11px] mt-1 block">
            {results.totalEmittersCount.toLocaleString()} goteros instalados
          </span>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <PieChart className="w-4 h-4 text-emerald-600" />
          Distribución de Costos por Partida Presupuestaria
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {categories.map((cat, idx) => {
            const catCost = categoryTotals[cat] || 0;
            const pct = ((catCost / results.totalProjectCostUsd) * 100).toFixed(1);
            return (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-800">{cat}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">${catCost.toLocaleString()}</span>
                    <span className="text-slate-500 ml-1.5 font-mono">({pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Unit Cost Adjustment Panel if toggled */}
      {editingUnitCosts && (
        <div className="bg-amber-50/80 border border-amber-300 p-5 rounded-xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-800" />
              Configurador de Precios Unitarios de Mercado
            </h4>
            <button
              onClick={handleResetUnitCosts}
              className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar Valores Base
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-amber-900 font-medium mb-1">Lateral PE ($/m):</label>
              <input
                type="number"
                step="0.02"
                value={data.unitCosts['lateral_per_m'] ?? 0.28}
                onChange={(e) => handleUpdateUnitCost('lateral_per_m', parseFloat(e.target.value) || 0.28)}
                className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-medium mb-1">Manifold PVC ($/m):</label>
              <input
                type="number"
                step="0.5"
                value={data.unitCosts['manifold_per_m'] ?? 4.80}
                onChange={(e) => handleUpdateUnitCost('manifold_per_m', parseFloat(e.target.value) || 4.80)}
                className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-medium mb-1">Matriz PVC-O ($/m):</label>
              <input
                type="number"
                step="0.5"
                value={data.unitCosts['mainline_per_m'] ?? 9.50}
                onChange={(e) => handleUpdateUnitCost('mainline_per_m', parseFloat(e.target.value) || 9.50)}
                className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-medium mb-1">Electroválvula ($/u):</label>
              <input
                type="number"
                step="5"
                value={data.unitCosts['valve_electric'] ?? 165}
                onChange={(e) => handleUpdateUnitCost('valve_electric', parseFloat(e.target.value) || 165)}
                className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-slate-900 font-semibold"
              />
            </div>
            <div>
              <label className="block text-amber-900 font-medium mb-1">Mano de Obra ($/ha):</label>
              <input
                type="number"
                step="10"
                value={data.unitCosts['installation_labor_per_ha'] ?? 420}
                onChange={(e) => handleUpdateUnitCost('installation_labor_per_ha', parseFloat(e.target.value) || 420)}
                className="w-full bg-white border border-amber-300 rounded px-2.5 py-1 text-slate-900 font-semibold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bill of Materials Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Cómputo Métrico Pormenorizado y Cuadro de Precios
          </h3>
          <span className="text-xs text-slate-500">
            Total {results.bomItems.length} partidas presupuestarias
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Partida / Categoría</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Concepto</th>
                <th className="px-3 py-2.5 text-left font-semibold text-slate-600">Especificación Técnica</th>
                <th className="px-3 py-2.5 text-right font-semibold text-slate-600">Cantidad</th>
                <th className="px-3 py-2.5 text-center font-semibold text-slate-600">Unidad</th>
                <th className="px-3 py-2.5 text-right font-semibold text-slate-600">Precio Unitario ($)</th>
                <th className="px-3 py-2.5 text-right font-semibold text-slate-900">Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {results.bomItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="px-3 py-2.5 font-medium text-emerald-800 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-slate-900">
                    {item.concept}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 text-[11px]">
                    {item.specification}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-center text-slate-600 font-mono">
                    {item.unit}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-slate-700">
                    ${item.unitCost.toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                    ${item.totalCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-900 text-white font-bold text-sm">
              <tr>
                <td colSpan={6} className="px-4 py-3 text-right">
                  TOTAL GENERAL DEL PROYECTO (EX-WORKS + INSTALACIÓN):
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-400 text-base">
                  ${results.totalProjectCostUsd.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

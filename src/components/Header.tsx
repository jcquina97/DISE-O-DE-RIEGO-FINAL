import React from 'react';
import { 
  Droplet, 
  FileText, 
  Download, 
  FileSpreadsheet,
  RotateCcw, 
  HelpCircle,
  Activity,
  Layers,
  Zap,
  DollarSign
} from 'lucide-react';
import { CalculationResults } from '../utils/hydraulicCalculations';
import { ProjectData } from '../types/irrigation';

interface HeaderProps {
  data: ProjectData;
  results: CalculationResults;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoadPreset: (presetType: 'palto_ladera' | 'citricos_ondulado' | 'hortaliza_plana') => void;
  onOpenReport: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  data,
  results,
  activeTab,
  setActiveTab,
  onLoadPreset,
  onOpenReport,
  onExportCsv,
  onExportExcel,
}) => {
  const tabs = [
    { id: 'agronomy', label: '1. Agronomía y Suelo' },
    { id: 'topography', label: '2. Curvas de Nivel y Topografía' },
    { id: 'hydraulics', label: '3. Hidráulica de Red' },
    { id: 'pumping', label: '4. Bombeo y Filtración' },
    { id: 'budget', label: '5. Presupuesto y Costos' },
    { id: 'formulas', label: '6. Memoria de Fórmulas' },
    { id: 'catalogs', label: '7. Catálogos Oficiales' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-xl sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl shadow-inner flex items-center justify-center">
            <Droplet className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                HydroAgro Design Suite
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRO v4.5
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Ingeniería de Riego Presurizado • Topografía Altimétrica • Normas ISO 9261 & FAO-56
            </p>
          </div>
        </div>

        {/* Quick Actions & Presets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <span className="text-slate-400 px-2 font-medium">Plantillas:</span>
            <button
              onClick={() => onLoadPreset('palto_ladera')}
              className="px-2.5 py-1 text-slate-200 hover:text-white hover:bg-slate-700 rounded transition font-medium"
              title="Palto en ladera con pendiente fuerte y goteros PC"
            >
              Palto en Ladera (12%)
            </button>
            <button
              onClick={() => onLoadPreset('citricos_ondulado')}
              className="px-2.5 py-1 text-slate-200 hover:text-white hover:bg-slate-700 rounded transition font-medium"
              title="Cítricos en relieve ondulado"
            >
              Cítricos Ondulado (4%)
            </button>
            <button
              onClick={() => onLoadPreset('hortaliza_plana')}
              className="px-2.5 py-1 text-slate-200 hover:text-white hover:bg-slate-700 rounded transition font-medium"
              title="Tomate intensivo en terreno plano"
            >
              Tomate Plano (0.8%)
            </button>
          </div>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg border border-emerald-500 font-bold shadow-xs transition"
            title="Descargar libro Excel profesional multi-hoja (.xlsx) sin necesidad de ajustes"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
            Excel (.xlsx)
          </button>

          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition font-medium"
            title="Exportar Cómputo Métrico y Presupuesto en CSV plano"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            CSV
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm transition"
            title="Generar Memoria Técnica Completa para Imprimir o Guardar en PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            Memoria / PDF
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 bg-slate-950/60 border-b border-slate-800/60">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Superficie:</span>
            <span className="font-semibold text-white">{data.totalAreaHa} ha ({data.sectorsCount} sectores)</span>
          </div>
          <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Caudal Sector:</span>
            <span className="font-semibold text-cyan-400">{results.subunitFlowM3h} m³/h ({results.subunitFlowLps} L/s)</span>
          </div>
          <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">HMT Bombeo:</span>
            <span className="font-semibold text-amber-400">{results.totalDynamicHeadHmtMca} mca ({(results.totalDynamicHeadHmtMca / 10).toFixed(1)} bar)</span>
          </div>
          <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Bomba Rec.:</span>
            <span className="font-semibold text-indigo-400">{results.motorRecommendedCommercialHp} HP ({results.motorPowerKw} kW)</span>
          </div>
          <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Uniformidad EU:</span>
            <span className={`font-semibold ${results.emissionUniformityEU >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {results.emissionUniformityEU}%
            </span>
          </div>
          <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Inversión Total:</span>
            <span className="font-semibold text-emerald-400">${results.totalProjectCostUsd.toLocaleString()} (${results.costPerHaUsd}/ha)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

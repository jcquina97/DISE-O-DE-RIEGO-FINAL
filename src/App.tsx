import React, { useState, useMemo } from 'react';
import { ProjectData } from './types/irrigation';
import { calculateIrrigationProject } from './utils/hydraulicCalculations';
import { exportProjectToExcel } from './utils/excelExporter';
import { exportProjectToCsv } from './utils/csvExporter';
import { CROPS_DATABASE } from './data/cropsData';
import { SOIL_DATABASE, EMITTER_DATABASE } from './data/soilData';
import { Header } from './components/Header';
import { AgronomicModule } from './components/AgronomicModule';
import { TopographyModule } from './components/TopographyModule';
import { HydraulicModule } from './components/HydraulicModule';
import { PumpingFiltrationModule } from './components/PumpingFiltrationModule';
import { CostBudgetModule } from './components/CostBudgetModule';
import { FormulaReferenceModule } from './components/FormulaReferenceModule';
import { CatalogLinksModule } from './components/CatalogLinksModule';
import { TechnicalReportModal } from './components/TechnicalReportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('agronomy');
  const [targetFormulaId, setTargetFormulaId] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Initial engineering project state
  const [projectData, setProjectData] = useState<ProjectData>(() => ({
    projectName: 'Finca Agrícola El Mirador - Diseño de Riego Presurizado',
    designerName: 'Ing. Consultor Hidráulico & Agronómico',
    location: 'Valle Central / Ladera Topográfica',
    totalAreaHa: 10.0,
    sectorsCount: 4,
    systemType: 'Goteo Superficial',

    // Crop (Palto default)
    crop: { ...CROPS_DATABASE[0] },
    cropPhase: 'Desarrollo/Media',

    // Soil (Franco default)
    soil: { ...SOIL_DATABASE[2] },

    // Climate & Demands
    etoMmDay: 5.6,
    effectiveRainfallMmDay: 0.0,
    waterSalinityECw: 0.85,
    applicationEfficiencyPerc: 90,
    wettedAreaPercent: 40,

    // Topography
    topography: {
      fieldLengthM: 250,
      fieldWidthM: 400,
      startElevationM: 100,
      endElevationM: 114,
      contourIntervalM: 2,
      lateralSlopeDirection: 'a_nivel', // Seguir curvas de nivel
      slopePercentLongitudinal: 5.6,
      slopePercentTransversal: 1.8,
      pointsCount: 20,
    },

    // Emitter (PC 2.0 L/h)
    emitter: { ...EMITTER_DATABASE[1] },

    // Hydraulics
    hydraulics: {
      lateralDiameterMm: 13.8, // 16mm nominal
      lateralRoughnessC: 145,
      lateralLengthM: 120,
      emittersPerLateral: 200,
      manifoldDiameterMm: 75,
      manifoldLengthM: 100,
      mainlineDiameterMm: 110,
      mainlineLengthM: 260,
      pipeMaterial: 'PVC',
    },

    // Pumping & Head
    pumping: {
      suctionLiftM: 2.5,
      filterHeadLossMca: 6.0,
      fertigationHeadLossMca: 5.0,
      accessoriesLossMca: 3.0,
      pumpEfficiencyPercent: 76,
      motorEfficiencyPercent: 92,
      dailyOperatingHoursAllowed: 18,
      energyCostPerKwh: 0.12,
    },

    unitCosts: {},
  }));

  // Reactive Hydraulic & Agronomic Engine calculation
  const results = useMemo(() => {
    return calculateIrrigationProject(projectData);
  }, [projectData]);

  // Jump to specific formula
  const handleJumpToFormula = (formulaId: string) => {
    setTargetFormulaId(formulaId);
    setActiveTab('formulas');
    setTimeout(() => {
      const el = document.getElementById(formulaId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Load Presets
  const handleLoadPreset = (presetType: 'palto_ladera' | 'citricos_ondulado' | 'hortaliza_plana') => {
    if (presetType === 'palto_ladera') {
      const palto = CROPS_DATABASE.find((c) => c.id === 'aguacate') || CROPS_DATABASE[0];
      const emitterPc = EMITTER_DATABASE.find((e) => e.id === 'drip_pc_2_0') || EMITTER_DATABASE[1];
      setProjectData((prev) => ({
        ...prev,
        projectName: 'Proyecto Palto en Ladera Fuerte (12% Desnivel)',
        totalAreaHa: 12.0,
        sectorsCount: 4,
        crop: { ...palto },
        cropPhase: 'Desarrollo/Media',
        etoMmDay: 6.0,
        emitter: { ...emitterPc },
        topography: {
          fieldLengthM: 300,
          fieldWidthM: 400,
          startElevationM: 100,
          endElevationM: 136, // 12% slope
          contourIntervalM: 2.5,
          lateralSlopeDirection: 'a_nivel',
          slopePercentLongitudinal: 12.0,
          slopePercentTransversal: 3.0,
          pointsCount: 20,
        },
        hydraulics: {
          ...prev.hydraulics,
          lateralLengthM: 110,
          manifoldDiameterMm: 90,
          mainlineDiameterMm: 125,
        },
      }));
    } else if (presetType === 'citricos_ondulado') {
      const citricos = CROPS_DATABASE.find((c) => c.id === 'citricos') || CROPS_DATABASE[1];
      const emitterPc = EMITTER_DATABASE.find((e) => e.id === 'drip_pc_3_8') || EMITTER_DATABASE[2];
      setProjectData((prev) => ({
        ...prev,
        projectName: 'Proyecto Cítricos en Relieve Ondulado (4%)',
        totalAreaHa: 8.0,
        sectorsCount: 3,
        crop: { ...citricos },
        cropPhase: 'Desarrollo/Media',
        etoMmDay: 5.2,
        emitter: { ...emitterPc, spacingM: 0.75 },
        topography: {
          fieldLengthM: 200,
          fieldWidthM: 400,
          startElevationM: 50,
          endElevationM: 58,
          contourIntervalM: 2,
          lateralSlopeDirection: 'a_nivel',
          slopePercentLongitudinal: 4.0,
          slopePercentTransversal: 1.5,
          pointsCount: 20,
        },
        hydraulics: {
          ...prev.hydraulics,
          lateralLengthM: 125,
          manifoldDiameterMm: 75,
          mainlineDiameterMm: 90,
        },
      }));
    } else if (presetType === 'hortaliza_plana') {
      const tomate = CROPS_DATABASE.find((c) => c.id === 'tomate') || CROPS_DATABASE[6];
      const emitterTurb = EMITTER_DATABASE.find((e) => e.id === 'drip_turb_1_6') || EMITTER_DATABASE[3];
      setProjectData((prev) => ({
        ...prev,
        projectName: 'Proyecto Tomate de Industria - Topografía Plana (0.8%)',
        totalAreaHa: 5.0,
        sectorsCount: 2,
        crop: { ...tomate },
        cropPhase: 'Desarrollo/Media',
        etoMmDay: 6.5,
        emitter: { ...emitterTurb, spacingM: 0.3 },
        topography: {
          fieldLengthM: 200,
          fieldWidthM: 250,
          startElevationM: 20,
          endElevationM: 21.6,
          contourIntervalM: 0.5,
          lateralSlopeDirection: 'a_nivel',
          slopePercentLongitudinal: 0.8,
          slopePercentTransversal: 0.2,
          pointsCount: 20,
        },
        hydraulics: {
          ...prev.hydraulics,
          lateralLengthM: 90,
          manifoldDiameterMm: 63,
          mainlineDiameterMm: 90,
        },
      }));
    }
  };

  // Export Excel (.xlsx) professional multi-sheet
  const handleExportExcel = () => {
    exportProjectToExcel(projectData, results);
  };

  // Export CSV estructurado con UTF-8 BOM y todas las secciones
  const handleExportCsv = () => {
    exportProjectToCsv(projectData, results);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Header with Navigation and KPIs */}
      <Header
        data={projectData}
        results={results}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadPreset={handleLoadPreset}
        onOpenReport={() => setIsReportOpen(true)}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'agronomy' && (
          <AgronomicModule
            data={projectData}
            results={results}
            onChangeData={setProjectData}
            onJumpToFormula={handleJumpToFormula}
          />
        )}

        {activeTab === 'topography' && (
          <TopographyModule
            data={projectData}
            results={results}
            onChangeData={setProjectData}
            onJumpToFormula={handleJumpToFormula}
          />
        )}

        {activeTab === 'hydraulics' && (
          <HydraulicModule
            data={projectData}
            results={results}
            onChangeData={setProjectData}
            onJumpToFormula={handleJumpToFormula}
          />
        )}

        {activeTab === 'pumping' && (
          <PumpingFiltrationModule
            data={projectData}
            results={results}
            onChangeData={setProjectData}
            onJumpToFormula={handleJumpToFormula}
          />
        )}

        {activeTab === 'budget' && (
          <CostBudgetModule
            data={projectData}
            results={results}
            onChangeData={setProjectData}
            onExportCsv={handleExportCsv}
            onExportExcel={handleExportExcel}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulaReferenceModule selectedFormulaId={targetFormulaId} />
        )}

        {activeTab === 'catalogs' && <CatalogLinksModule />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 text-xs text-center print:hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-300">
            HydroAgro Design Suite • Plataforma Especialista para Diseño y Presupuesto de Riego Presurizado
          </p>
          <p className="text-slate-500">
            Fundamentos conforme a FAO-56 Penman-Monteith, ISO 9261 (Emisores de Riego), UNE-EN 805 (Tuberías a Presión) y ASAE S398.1.
          </p>
        </div>
      </footer>

      {/* Technical Engineering Report Modal */}
      <TechnicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        data={projectData}
        results={results}
      />
    </div>
  );
}

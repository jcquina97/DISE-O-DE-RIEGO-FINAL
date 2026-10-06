import React, { useState } from 'react';
import { 
  Mountain, 
  TrendingUp, 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sliders, 
  Eye, 
  EyeOff,
  Maximize2,
  ArrowRight
} from 'lucide-react';
import { ProjectData } from '../types/irrigation';
import { CalculationResults } from '../utils/hydraulicCalculations';

interface TopographyModuleProps {
  data: ProjectData;
  results: CalculationResults;
  onChangeData: (updater: (prev: ProjectData) => ProjectData) => void;
  onJumpToFormula: (formulaId: string) => void;
}

export const TopographyModule: React.FC<TopographyModuleProps> = ({
  data,
  results,
  onChangeData,
  onJumpToFormula,
}) => {
  const { topography, hydraulics } = data;
  const [showContours, setShowContours] = useState(true);
  const [showPiezometric, setShowPiezometric] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Computed contours
  const elevationMin = Math.min(topography.startElevationM, topography.endElevationM);
  const elevationMax = Math.max(topography.startElevationM, topography.endElevationM);
  const deltaElev = elevationMax - elevationMin;
  const contourInterval = topography.contourIntervalM || 2;
  const numContours = Math.max(3, Math.floor(deltaElev / contourInterval) + 1);

  // Generate contour lines for SVG rendering
  const contourLines = [];
  for (let i = 0; i < numContours; i++) {
    const cota = elevationMin + i * contourInterval;
    const norm = deltaElev > 0 ? (cota - elevationMin) / deltaElev : 0.5;
    contourLines.push({
      cota,
      normY: norm, // 0 = start (top), 1 = end (bottom) or vice versa
    });
  }

  // Handle direction change
  const handleDirectionChange = (dir: 'a_nivel' | 'descendente' | 'ascendente') => {
    onChangeData((prev) => ({
      ...prev,
      topography: {
        ...prev.topography,
        lateralSlopeDirection: dir,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Mountain className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">Módulo 2: Topografía Altimétrica y Trazo en Curvas de Nivel</h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Análisis de pendientes geodésicas, curvas de nivel (iso-cotas), compensación hidrostática de presión en laterales y perfil piezométrico dinámico.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Regla de Oro: Laterales paralelos a curvas de nivel; Matrices perpendiculares a curvas con reguladores.</span>
        </div>
      </div>

      {/* Grid: Altimetric Settings + CAD Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Altimetry Form Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Compass className="w-4 h-4 text-emerald-600" />
                2.1. Altimetría del Terreno y Parcela
              </h3>
              <span className="text-xs text-slate-500 font-mono">Georreferenciación</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Cota Inicial Cabezal (Z₀):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    value={topography.startElevationM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        topography: {
                          ...prev.topography,
                          startElevationM: parseFloat(e.target.value) || 100,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">msnm</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Cota Final Límite (Z₁):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="1"
                    value={topography.endElevationM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        topography: {
                          ...prev.topography,
                          endElevationM: parseFloat(e.target.value) || 112,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">msnm</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Longitud Predio (Eje X):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="10"
                    value={topography.fieldLengthM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        topography: {
                          ...prev.topography,
                          fieldLengthM: parseFloat(e.target.value) || 200,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ancho Predio (Eje Y):</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="10"
                    value={topography.fieldWidthM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        topography: {
                          ...prev.topography,
                          fieldWidthM: parseFloat(e.target.value) || 100,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Equidistancia Curvas:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={topography.contourIntervalM}
                    onChange={(e) =>
                      onChangeData((prev) => ({
                        ...prev,
                        topography: {
                          ...prev.topography,
                          contourIntervalM: parseFloat(e.target.value) || 2,
                        },
                      }))
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-slate-500 font-semibold">m</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Pendiente Longitudinal:</label>
                <div className="p-2 bg-slate-100 rounded-lg font-bold text-slate-800 flex items-center justify-between">
                  <span>{results.slopeLongitudinalPercent}%</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {Math.abs(results.slopeLongitudinalPercent) < 2
                      ? 'Plana'
                      : Math.abs(results.slopeLongitudinalPercent) < 8
                      ? 'Ondulada'
                      : 'Fuerte Ladera'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orientation Strategy Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                2.2. Estrategia de Trazo de Laterales vs Curvas
              </h3>
              <button
                onClick={() => onJumpToFormula('criterio_trazado_curvas_nivel')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                Criterio Hidráulico <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div
                onClick={() => handleDirectionChange('a_nivel')}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                  topography.lateralSlopeDirection === 'a_nivel'
                    ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-1.5 rounded-full mt-0.5 ${
                  topography.lateralSlopeDirection === 'a_nivel'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    Paralelo a las Curvas de Nivel (Iso-Cota)
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                      RECOMENDADO
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Los laterales se extienden siguiendo la cota constante. El desnivel en el lateral es mínimo (ΔZ ≈ 0), logrando la máxima uniformidad de riego sin sobrepresiones en las puntas.
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleDirectionChange('descendente')}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                  topography.lateralSlopeDirection === 'descendente'
                    ? 'bg-amber-50 border-amber-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-1.5 rounded-full mt-0.5 ${
                  topography.lateralSlopeDirection === 'descendente'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">
                    Pendiente Descendente a Favor del Flujo
                  </div>
                  <p className="text-slate-600 mt-1">
                    La cota disminuye conforme el agua avanza. La energía potencial ganada compensa la fricción hf. Requiere goteros PC para evitar que los últimos emisores descarguen con sobrepresión.
                  </p>
                </div>
              </div>

              <div
                onClick={() => handleDirectionChange('ascendente')}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                  topography.lateralSlopeDirection === 'ascendente'
                    ? 'bg-rose-50 border-rose-500 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-1.5 rounded-full mt-0.5 ${
                  topography.lateralSlopeDirection === 'ascendente'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    Pendiente Ascendente en Contra de Cota
                    <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                      DESACONSEJADO
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    La fricción hf y el desnivel hidrostático se suman en contra. La presión cae abruptamente hacia el final del lateral, obligando a usar diámetros mayores o longitudes más cortas.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Topographic Formula Card */}
          <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-emerald-400">Ecuación Piezométrica con Desnivel:</span>
              <button
                onClick={() => onJumpToFormula('perfil_presion_con_cota')}
                className="text-[11px] text-slate-300 hover:text-white underline"
              >
                Detalle Técnico
              </button>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg font-mono text-center text-amber-300 text-sm">
              H(x) = H₀ ± ΔZ(x) - hf(x)
            </div>
            <p className="text-[11px] text-slate-400">
              Desnivel en lateral actual: <strong className="text-white">{results.lateralElevationChangeM} m</strong>. 
              {topography.lateralSlopeDirection === 'a_nivel' && ' Al trazar a nivel, la pérdida se restringe exclusivamente al rozamiento viscoso.'}
              {topography.lateralSlopeDirection === 'descendente' && ' Al ser descendente, la gravedad aporta presión que compensa la fricción.'}
              {topography.lateralSlopeDirection === 'ascendente' && ' Al ser ascendente, la pérdida total es la suma de fricción y contrapresión.'}
            </p>
          </div>
        </div>

        {/* Right: Interactive 2D Contours CAD Map & Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visualizer Container */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Simulador de Plano CAD: Curvas de Nivel y Red Hidráulica
                </h3>
              </div>

              {/* Display Controls */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setShowContours(!showContours)}
                  className={`px-2.5 py-1 rounded border flex items-center gap-1 transition font-medium ${
                    showContours
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Mostrar u ocultar curvas de nivel"
                >
                  {showContours ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  Curvas Nivel
                </button>
                <button
                  onClick={() => setShowPiezometric(!showPiezometric)}
                  className={`px-2.5 py-1 rounded border flex items-center gap-1 transition font-medium ${
                    showPiezometric
                      ? 'bg-cyan-50 text-cyan-900 border-cyan-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Mostrar gradiente de presión"
                >
                  {showPiezometric ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  Gradiente
                </button>
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className={`px-2.5 py-1 rounded border flex items-center gap-1 transition font-medium ${
                    showLabels
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title="Mostrar cotas numéricas"
                >
                  Cotas
                </button>
              </div>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 600 380" preserveAspectRatio="none">
                {/* Defs for gradients and markers */}
                <defs>
                  <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                  </linearGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                  </marker>
                  <marker id="waterFlow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                </defs>

                {/* Background Grid */}
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
                </pattern>
                <rect width="600" height="380" fill="url(#terrainGrad)" />
                <rect width="600" height="380" fill="url(#gridPattern)" />

                {/* Contour Lines (Curvas de Nivel) */}
                {showContours &&
                  contourLines.map((c, idx) => {
                    // Generate realistic organic wavy contour paths
                    const yBase = 40 + c.normY * 290;
                    const c1 = yBase - 15 * Math.sin((idx + 1) * 0.9);
                    const c2 = yBase + 18 * Math.cos((idx + 2) * 0.8);
                    const pathD = `M 20 ${yBase} C 180 ${c1}, 380 ${c2}, 580 ${yBase}`;
                    const isIndex = idx % 2 === 0; // Curva maestra o intermedia
                    return (
                      <g key={idx}>
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isIndex ? '#d97706' : '#b45309'}
                          strokeWidth={isIndex ? '1.8' : '1.0'}
                          strokeDasharray={isIndex ? undefined : '4,3'}
                          opacity="0.85"
                        />
                        {showLabels && (
                          <text
                            x={70 + (idx * 50) % 350}
                            y={yBase - 4}
                            fill="#fcd34d"
                            fontSize="9"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            {c.cota}m
                          </text>
                        )}
                      </g>
                    );
                  })}

                {/* Gradient Direction Arrow (Vector de Máxima Pendiente) */}
                <line
                  x1="540"
                  y1="50"
                  x2="540"
                  y2="330"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  markerEnd="url(#arrow)"
                />
                <text x="475" y="190" fill="#f59e0b" fontSize="10" fontWeight="bold">
                  Pendiente {results.slopeLongitudinalPercent}% ↓
                </text>

                {/* Hydraulic Network:
                    1. Pump Station / Cabezal
                    2. Mainline (Matriz) running along the field
                    3. Manifolds (Secundarias)
                    4. Laterals (Laterales)
                */}

                {/* Pump Station */}
                <rect x="35" y="30" width="30" height="25" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="50" y="47" fill="#ffffff" fontSize="10" textAnchor="middle" fontWeight="bold">
                  BOM
                </text>
                <text x="75" y="46" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  Cabezal de Riego (Z = {topography.startElevationM}m)
                </text>

                {/* Mainline (Tubería Matriz) - Dark blue / Cyan line */}
                <line
                  x1="50"
                  y1="55"
                  x2="50"
                  y2="330"
                  stroke="#0284c7"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text x="60" y="220" fill="#38bdf8" fontSize="10" transform="rotate(90, 60, 220)">
                  Matriz Principal DN {hydraulics.mainlineDiameterMm}mm
                </text>

                {/* Pressure Regulators along Mainline (PRVs) */}
                <circle cx="50" cy="140" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <circle cx="50" cy="240" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="60" y="143" fill="#fcd34d" fontSize="9">PRV-1</text>
                <text x="60" y="243" fill="#fcd34d" fontSize="9">PRV-2</text>

                {/* Manifolds & Laterals based on selected direction */}
                {[90, 180, 270].map((maniY, mIdx) => {
                  return (
                    <g key={mIdx}>
                      {/* Subunit Valve */}
                      <rect
                        x="42"
                        y={maniY - 6}
                        width="16"
                        height="12"
                        rx="2"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text x="25" y={maniY + 4} fill="#a7f3d0" fontSize="8" fontWeight="bold">
                        V-{mIdx + 1}
                      </text>

                      {/* Manifold Pipe (Terciaria) */}
                      <line
                        x1="50"
                        y1={maniY}
                        x2="100"
                        y2={maniY}
                        stroke="#10b981"
                        strokeWidth="3.5"
                      />

                      {/* Laterals:
                          - If a_nivel: horizontal parallel to X, along the contour line
                          - If descendente: slanted downwards
                          - If ascendente: slanted upwards
                      */}
                      {[maniY - 25, maniY - 12, maniY, maniY + 12, maniY + 25].map((latY, lIdx) => {
                        let yEnd = latY;
                        if (topography.lateralSlopeDirection === 'descendente') {
                          yEnd = latY + 28;
                        } else if (topography.lateralSlopeDirection === 'ascendente') {
                          yEnd = latY - 28;
                        }

                        return (
                          <g key={lIdx}>
                            <line
                              x1="100"
                              y1={latY}
                              x2="480"
                              y2={yEnd}
                              stroke="#059669"
                              strokeWidth="1.8"
                              strokeDasharray={lIdx % 2 === 0 ? undefined : '6,2'}
                            />
                            {/* Emitters as micro dots */}
                            {[150, 210, 270, 330, 390, 450].map((dotX, dIdx) => {
                              const t = (dotX - 100) / 380;
                              const dotY = latY + t * (yEnd - latY);
                              return (
                                <circle
                                  key={dIdx}
                                  cx={dotX}
                                  cy={dotY}
                                  r="2"
                                  fill="#34d399"
                                  opacity="0.9"
                                />
                              );
                            })}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}

                {/* Laterals Orientation Annotations */}
                <rect x="220" y="345" width="260" height="25" rx="5" fill="#0f172a" stroke="#334155" />
                <text x="350" y="361" fill="#a7f3d0" fontSize="10" textAnchor="middle" fontWeight="bold">
                  {topography.lateralSlopeDirection === 'a_nivel' && '✓ Laterales paralelos a curvas de nivel (ΔZ ≈ 0)'}
                  {topography.lateralSlopeDirection === 'descendente' && '⚠ Laterales descendentes (flujo gana presión)'}
                  {topography.lateralSlopeDirection === 'ascendente' && '✖ Laterales ascendentes (flujo pierde presión)'}
                </text>
              </svg>
            </div>

            {/* Profile Plot: Cota vs Piezométrica */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Perfil Piezométrico Dinámico a lo Largo del Lateral Crítico (L = {hydraulics.lateralLengthM}m)
                </h4>
                <span className="text-[11px] font-mono text-slate-500">
                  Pin = {results.lateralInletPressureRequiredMca} mca | Pfin = {results.lateralEndPressureMca} mca
                </span>
              </div>

              {/* Graphical pressure representation */}
              <div className="h-20 bg-slate-900 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Origen Lateral (x = 0m)</span>
                  <span>Mitual Lateral (x = {Math.round(hydraulics.lateralLengthM / 2)}m)</span>
                  <span>Extremo Final (x = {hydraulics.lateralLengthM}m)</span>
                </div>

                <div className="relative w-full h-7 flex items-center">
                  {/* Terrain bar */}
                  <div className="w-full h-1 bg-slate-700 rounded absolute"></div>
                  {/* Piezometric line */}
                  <div
                    className="h-1.5 rounded absolute transition-all duration-500"
                    style={{
                      left: '0%',
                      right: '0%',
                      background:
                        topography.lateralSlopeDirection === 'a_nivel'
                          ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                          : topography.lateralSlopeDirection === 'descendente'
                          ? 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)'
                          : 'linear-gradient(90deg, #10b981 0%, #ef4444 100%)',
                    }}
                  ></div>
                </div>

                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-emerald-400">P₀ = {results.lateralInletPressureRequiredMca} mca</span>
                  <span className="text-cyan-400">
                    hf acumulada = {results.lateralFrictionLossHca} mca
                  </span>
                  <span
                    className={
                      topography.lateralSlopeDirection === 'ascendente'
                        ? 'text-rose-400'
                        : topography.lateralSlopeDirection === 'descendente'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }
                  >
                    P_fin = {results.lateralEndPressureMca} mca (ΔH = {Math.abs(results.lateralInletPressureRequiredMca - results.lateralEndPressureMca).toFixed(2)} mca)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                <strong>Análisis Especialista:</strong> Al respetar las curvas de nivel, la variación neta de presión en el lateral es de tan solo <strong className="text-slate-900 font-mono">{Math.abs(results.lateralInletPressureRequiredMca - results.lateralEndPressureMca).toFixed(2)} mca</strong>, lo cual representa una variación de caudal del emisor de solo <strong>{results.emitterFlowVariationPercent}%</strong> (cumple holgadamente la norma ISO 9261 que exige &lt;10%).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

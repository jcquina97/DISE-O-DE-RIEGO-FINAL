import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  Tag,
  Calculator
} from 'lucide-react';
import { FORMULAS_DATABASE } from '../data/formulasData';
import { FormulaDocumentation } from '../types/irrigation';

interface FormulaReferenceModuleProps {
  selectedFormulaId?: string | null;
}

export const FormulaReferenceModule: React.FC<FormulaReferenceModuleProps> = ({
  selectedFormulaId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas las Fórmulas' },
    { id: 'Agronomía y Suelo', label: '1. Agronomía y Suelo' },
    { id: 'Curvas de Nivel y Topografía', label: '2. Curvas de Nivel y Topografía' },
    { id: 'Emisores y Uniformidad', label: '3. Emisores y Uniformidad' },
    { id: 'Hidráulica de Tuberías', label: '4. Hidráulica de Tuberías' },
    { id: 'Estación de Bombeo', label: '5. Estación de Bombeo' },
  ];

  const filteredFormulas = FORMULAS_DATABASE.filter((f) => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.formulaLaTeX.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.technicalCriteria.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Memoria Técnica y Compendio Riguroso de Fórmulas de Riego
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Fundamento físico-matemático de cada ecuación empleada en la suite: variables, unidades del Sistema Internacional, propósito en la toma de decisiones y criterios normativos internacionales (FAO-56, ISO 9261, ASAE).
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <Calculator className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Total de {FORMULAS_DATABASE.length} formulaciones fundamentales integradas.</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre, variable o criterio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Formulas List */}
      <div className="space-y-4">
        {filteredFormulas.map((formula) => {
          const isHighlighted = selectedFormulaId === formula.id;

          return (
            <div
              key={formula.id}
              id={formula.id}
              className={`bg-white rounded-xl border transition p-5 shadow-sm space-y-4 ${
                isHighlighted
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Formula Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <h3 className="text-base font-bold text-slate-900">{formula.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-500" />
                    {formula.category}
                  </span>
                </div>
              </div>

              {/* Mathematical Representation Box */}
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl border border-slate-800 font-mono text-center text-sm sm:text-base font-bold shadow-inner overflow-x-auto">
                {formula.formulaLaTeX}
              </div>

              {/* Formula Purpose: PARA QUÉ SIRVE */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-xl space-y-1">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  ¿Para qué sirve esta fórmula en el diseño del sistema?
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {formula.purpose}
                </p>
              </div>

              {/* Variables Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nomenclatura y Variables:
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Símbolo</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Parámetro</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Unidad</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Descripción / Significado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {formula.variables.map((v, vIdx) => (
                        <tr key={vIdx} className="hover:bg-slate-50/60">
                          <td className="px-3 py-2 font-mono font-bold text-emerald-700 whitespace-nowrap">
                            {v.symbol}
                          </td>
                          <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                            {v.name}
                          </td>
                          <td className="px-3 py-2 font-mono text-slate-500 whitespace-nowrap">
                            {v.unit}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {v.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technical Criteria & Norms */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Criterio Técnico del Especialista y Umbrales Normativos:
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {formula.technicalCriteria}
                </p>
              </div>

              {/* Example calculation if present */}
              {formula.exampleCalculation && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900 font-mono">
                  <span className="font-bold text-amber-950 font-sans block mb-0.5">Ejemplo Numérico Aplicado:</span>
                  {formula.exampleCalculation}
                </div>
              )}
            </div>
          );
        })}

        {filteredFormulas.length === 0 && (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
            No se encontraron fórmulas que coincidan con el término de búsqueda.
          </div>
        )}
      </div>
    </div>
  );
};

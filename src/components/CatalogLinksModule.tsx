import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Search, 
  Filter, 
  Layers, 
  Download, 
  CheckCircle2, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { CATALOGS_DATABASE } from '../data/catalogsData';
import { CatalogItem } from '../types/irrigation';

export const CatalogLinksModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos los Catálogos' },
    { id: 'Emisores y Laterales de Goteo', label: '1. Goteo y Microirrigación' },
    { id: 'Aspersión y Microaspersión', label: '2. Aspersión y Cañones' },
    { id: 'Filtración y Tratamiento', label: '3. Filtrado (Malla/Anillas/Grava)' },
    { id: 'Válvulas Hidráulicas y Ventosas', label: '4. Válvulas y Ventosas de Aire' },
    { id: 'Tuberías y Conducción', label: '5. Tuberías PEAD/PVC y Fitting' },
    { id: 'Bombas y Grupos de Presión', label: '6. Bombas y Grupos de Presión' },
    { id: 'Automatización y Fertirriego', label: '7. Fertirriego y Controladores' },
  ];

  const filteredCatalogs = CATALOGS_DATABASE.filter((cat) => {
    const matchesCat = selectedCategory === 'all' || cat.category === selectedCategory;
    const matchesSearch =
      cat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase());
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
              Directorio de Catálogos Técnicos Oficiales de Fabricantes
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Enlaces directos a la documentación técnica oficial, fichas de producto, curvas características Q-H, manuales de diseño y software de selección de los principales fabricantes globales del sector de riego.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{CATALOGS_DATABASE.length} catálogos técnicos certificados y plataformas de ingeniería.</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category selector */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar fabricante, emisor, filtro, bomba..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCatalogs.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Category & Badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">{item.category}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  {item.badge}
                </span>
              </div>

              {/* Title & Manufacturer */}
              <div>
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {item.manufacturer}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-1 group-hover:text-emerald-700 transition">
                  {item.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Actions: Direct link & Official site */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={item.officialSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-800 font-medium transition"
              >
                Sitio Oficial
              </a>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold shadow-xs transition"
              >
                Abrir Catálogo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredCatalogs.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-slate-500 text-sm">
          No se encontraron catálogos para el criterio de búsqueda seleccionado.
        </div>
      )}

      {/* Technical Footnote */}
      <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 text-xs space-y-2">
        <h4 className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4" />
          Nota Técnica para el Proyectista de Riego:
        </h4>
        <p className="text-slate-300 leading-relaxed">
          Los catálogos técnicos aquí citados constituyen la referencia de especificación de ingeniería para verificar presiones de rotura, curvas de gasto volumétrico (Q vs H), espesores milimétricos de pared, pérdidas singulares en accesorios y curvas características de bombas (NPSH requerido y rendimiento hidráulico BEP). En todo proyecto ejecutivo final, se debe contrastar el cálculo analítico con las curvas certificadas por el fabricante según la norma ISO 9261 (para emisores) e ISO 9906 (para bombas rotodinámicas).
        </p>
      </div>
    </div>
  );
};

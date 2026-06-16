import React, { useState } from 'react';
import PropertyCard from '../Components/PropertyCard';

export default function CatalogPage({ properties, onSelectProperty }) {
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('Todos');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  
  // Estado opcional por si el usuario prefiere accionar la búsqueda de golpe con el botón
  const [triggerBuscar, setTriggerBuscar] = useState(0);

  // Filtrado inteligente integrado
  const propiedadesFiltradas = properties.filter((item) => {
    const coincideBusqueda = item.title.toLowerCase().includes(busqueda.toLowerCase()) || 
                             item.location.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideTipo = tipoFiltro === 'Todos' || item.esquema === tipoFiltro;
    const coincideCategoria = categoriaFiltro === 'Todos' || item.categoria === categoriaFiltro;

    return coincideBusqueda && coincideTipo && coincideCategoria;
  });

  const handleBuscarClick = (e) => {
    e.preventDefault();
    // Fuerza el refresco del filtrado visual al dar clic
    setTriggerBuscar(prev => prev + 1);
  };

  return (
    /* pt-32 asegura espacio para que la Navbar flotante no tape el título */
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex-grow text-left animate-fadeIn">
      
      {/* ENCABEZADO DE LA PÁGINA */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-light text-[#333333] tracking-tight">
          Nuestro catálogo <span className="text-[#BD1B23] font-medium">completo</span>
        </h1>
        <p className="text-sm text-neutral-400 font-light mt-1.5">
          Explora de forma extendida todas las opciones residenciales y comerciales disponibles.
        </p>
      </div>

      {/* BUSCADOR FILTRADOR INTEGRADO (Copia fiel de temp_image_D157DFC8-2708-419E-8691-E8C2F9EC696A.WEBP) */}
      <div className="bg-[#F5F5F5] p-5 rounded-3xl w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          
          {/* FILTRO: TIPO (Ocupa 3 columnas) */}
          <div className="md:col-span-3 text-left w-full">
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-3">Tipo</label>
            <div className="relative">
              <select 
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full bg-white text-[#333333] text-sm rounded-full py-3 px-4 appearance-none border border-neutral-200/40 outline-none cursor-pointer font-medium"
              >
                <option value="Todos">Todos (Compra/Renta)</option>
                <option value="Venta">Compra</option>
                <option value="Renta">Renta</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
            </div>
          </div>
          
          {/* FILTRO: CATEGORÍA (Ocupa 3 columnas) */}
          <div className="md:col-span-3 text-left w-full">
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-3">Categoría</label>
            <div className="relative">
              <select 
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full bg-white text-[#333333] text-sm rounded-full py-3 px-4 appearance-none border border-neutral-200/40 outline-none cursor-pointer font-medium"
              >
                <option value="Todos">Todas las categorías</option>
                <option value="Casa">Casa Residencial</option>
                <option value="Departamento">Departamento Premium</option>
                <option value="Terreno">Terreno Comercial</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
            </div>
          </div>

          {/* INPUT DE BÚSQUEDA POR TEXTO (Se ajustó a 4 columnas para abrir espacio al botón) */}
          <div className="md:col-span-4 text-left w-full">
            <label className="block text-xs font-semibold text-transparent mb-1.5 hidden md:block">Ubicación</label>
            <input 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por zona, colonia, calle..." 
              className="w-full bg-white text-[#333333] text-sm rounded-full py-3 px-5 border border-neutral-200/40 outline-none placeholder:text-[#999999] font-normal"
            />
          </div>

          {/* 🔘 BOTÓN BUSCAR ROJO INTEGRADO (Ocupa las 2 columnas restantes) */}
          <div className="md:col-span-2 w-full">
            <button 
              type="button"
              onClick={handleBuscarClick}
              className="w-full py-3 bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full text-sm transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
            >
              Buscar
            </button>
          </div>
          
        </div>
      </div>

      {/* REJILLA DE TARJETAS */}
      {propiedadesFiltradas.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200 p-8 max-w-md mx-auto">
          <h4 className="text-base font-semibold text-[#333333] tracking-tight">Sin resultados</h4>
          <p className="text-xs text-neutral-400 font-light mt-1">No hay inmuebles que coincidan con los criterios de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {propiedadesFiltradas.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onClick={() => onSelectProperty(property)} 
            />
          ))}
        </div>
      )}
    </main>
  );
}
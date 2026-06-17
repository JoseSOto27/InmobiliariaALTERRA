import React from 'react';

export default function PropertyCard({ property, onClick }) {
  const formatPrice = (price) => {
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(price);
    return `MXN $${formatted}`;
  };

  const handleCardClick = (e) => {
    e.stopPropagation(); 
    if (onClick) onClick();
  };

  const esCarro = property.categoria === 'Vehículo de Gama';
  const esTerreno = property.categoria === 'Terreno Comercial' || property.categoria === 'Terreno Residencial';

  // 🌟 MAPEO DE COLORES CON TEXTO 100% ESTÁTICO Y EXPLÍCITO PARA EVITAR ERRORES EN EL COMPILADOR DE VERCEL
  let esquemaColorClass = "bg-neutral-900/90"; // Por defecto Renta
  if (property.esquema === 'Venta') {
    esquemaColorClass = "bg-[#BD1B23]/90";
  } else if (property.esquema === 'Preventa') {
    esquemaColorClass = "bg-amber-600/90";
  }

  return (
    <article 
      onClick={handleCardClick} 
      className="font-sans relative group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-neutral-100 transition-all duration-300 flex flex-col h-full cursor-pointer select-none"
    >
      {/* Contenedor de la Imagen */}
      <div className="relative overflow-hidden aspect-[4/3] bg-neutral-50">
        <img 
          src={property.image} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />
        
        {/* 🏷️ ETIQUETA IZQUIERDA: Categoría de Alta */}
        {(property.categoria || property.tag) && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#333333] font-medium text-[11px] px-3 py-1 rounded-full shadow-sm border border-neutral-200/40 tracking-tight z-10">
            {property.categoria || property.tag}
          </span>
        )}

        {/* 🏷️ ETIQUETA DERECHA: Esquema Comercial con Clase Estática Inyectada */}
        {property.esquema && (
          <span className={`absolute top-4 right-4 backdrop-blur-sm text-white font-semibold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10 border border-white/10 ${esquemaColorClass}`}>
            {property.esquema}
          </span>
        )}
      </div>

      {/* Contenido e Información Estructurada */}
      <div className="p-5 flex flex-col flex-grow text-left">
        <p className="text-xl font-bold text-[#1A1A1A] mb-1 tracking-tight">
          {formatPrice(property.price)}
        </p>

        <h3 className="text-base font-semibold text-[#333333] tracking-tight mb-0.5 line-clamp-1">
          {property.title}
        </h3>

        <div className="text-sm text-neutral-400 font-light mb-4">
          {property.location || 'Ubicación'}
        </div>

        {/* 🎠 CARRUSEL DE AMENIDADES */}
        <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 text-neutral-500 text-xs mt-auto font-light overflow-x-auto max-w-full no-scrollbar pb-1">
          {esCarro ? (
            <>
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 flex-shrink-0">
                <span className="font-medium text-[#333333]">{property.modelYear || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 flex-shrink-0">
                <span className="font-medium text-[#333333] uppercase text-[10px]">{property.transmission?.substring(0, 4) || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 flex-shrink-0">
                <span className="font-medium text-[#333333]">{property.kms ? `${(property.kms / 1000).toFixed(0)}k` : '0'} km</span>
              </div>
            </>
          ) : (
            <>
              {!esTerreno && (
                <>
                  <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12v6m0-6V6m16 6v6m0-6V6" />
                    </svg>
                    <span className="font-medium text-[#333333]">{property.beds || 0} Hab</span>
                  </div>
                  <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                    <span className="font-medium text-[#333333]">{property.baths || 0} Baños</span>
                  </div>
                  <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                    <span className="font-medium text-[#333333]">{property.parking || property.cochera || 0} Estac.</span>
                  </div>
                </>
              )}

              {property.areaConst > 0 && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                  <span className="font-medium text-[#333333]">{property.areaConst} m²</span>
                </div>
              )}

              {property.areaTerreno > 0 && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 bg-neutral-50/60 flex-shrink-0">
                  <span className="font-medium text-[#333333]">{property.areaTerreno} m²</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}
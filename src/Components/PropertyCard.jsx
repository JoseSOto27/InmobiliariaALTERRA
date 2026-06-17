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

  const esCarro = property.categoria === 'Carro';

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
        
        {/* 🏷️ ETIQUETA DINÁMICA CORREGIDA A .categoria */}
        {(property.categoria || property.tag || property.esquema) && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#333333] font-medium text-[11px] px-3 py-1 rounded-full shadow-sm border border-neutral-200/40 tracking-tight">
            {property.categoria || property.tag || property.esquema}
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
              {/* Calendario para el Año */}
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium text-[#333333]">{property.modelYear || 'N/A'}</span>
              </div>
              {/* Engrane para Transmisión */}
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium text-[#333333] uppercase text-[10px]">{property.transmission?.substring(0, 4) || 'N/A'}</span>
              </div>
              {/* Velocímetro para Kilómetros */}
              <div className="flex items-center gap-1 bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40 flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 002-2h2a2 2 0 002 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 002-2h2a2 2 0 002 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <span className="font-medium text-[#333333]">{property.kms ? `${(property.kms / 1000).toFixed(0)}k` : '0'} km</span>
              </div>
            </>
          ) : (
            <>
              {/* 1. Habitaciones (Cama) */}
              {property.categoria !== 'Terreno' && property.categoria !== 'Terreno Residencial' && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12v6m0-6V6m16 6v6m0-6V6" />
                  </svg>
                  <span className="font-medium text-[#333333]">{property.beds || 0} Hab</span>
                </div>
              )}

              {/* 2. Baños (Tina / Regadera) */}
              {property.categoria !== 'Terreno' && property.categoria !== 'Terreno Residencial' && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8" />
                  </svg>
                  <span className="font-medium text-[#333333]">{property.baths || 0} Baños</span>
                </div>
              )}

              {/* 3. Estacionamiento (Coche / Cochera) */}
              {property.categoria !== 'Terreno' && property.categoria !== 'Terreno Residencial' && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="font-medium text-[#333333]">{property.parking || property.cochera || 0} Estac.</span>
                </div>
              )}

              {/* 4. Metros Construidos (Regla de planos) */}
              {property.areaConst > 0 && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11m0 0h5" />
                  </svg>
                  <span className="font-medium text-[#333333]">{property.areaConst} m²</span>
                </div>
              )}

              {/* 5. Metros de Terreno (Límites / Escuadras) */}
              {property.areaTerreno > 0 && (
                <div className="flex items-center gap-1 border border-neutral-200/60 rounded-lg px-2.5 py-1 bg-neutral-50/60 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 18h16M4 6v12M20 6v12" />
                  </svg>
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
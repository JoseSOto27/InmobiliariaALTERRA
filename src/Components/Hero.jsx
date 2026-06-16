import React, { useState, useEffect } from 'react';

// Recibimos onViewChange desde App.jsx para controlar la navegación interna
export default function Hero({ onViewChange }) {
  // Arreglo de 10 imágenes con estética ultra moderna, sombría y nocturna
  const images = [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80", 
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80"  
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); 
  }, [images.length]);

  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="max-w-7xl mx-auto w-full flex flex-col justify-between flex-grow">
        
        {/* LAYOUT DE CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
          
          {/* TEXTOS EDITORIALES (Izquierda - Modificado el tamaño a 4rem de forma limpia) */}
          <div className="lg:col-span-5 text-left space-y-8">
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-[4rem] font-light text-[#222222] tracking-tight leading-[1.15]">
              Tu nueva propiedad <br />
              <span className="text-[#BD1B23] font-semibold">mas cerca que nunca</span>
            </h1>
            
            <div className="flex items-center gap-6 text-sm font-medium font-sans">
              <a href="#contacto" className="text-[#BD1B23] hover:opacity-80 transition-opacity font-semibold">
                Contactanos
              </a>
              
              {/* Modificado a botón interactivo para disparar el catálogo de Supabase */}
              <button 
                type="button"
                onClick={() => onViewChange && onViewChange('catalog')}
                className="text-[#666666] flex items-center gap-2 hover:text-[#BD1B23] transition-all cursor-pointer outline-none font-medium"
              >
                Nuestras propiedades <span className="text-lg">→</span>
              </button>
            </div>
          </div>

          {/* TARJETA DE RESIDENCIA CON CAMBIO DE IMAGEN AUTOMÁTICO */}
          <div className="lg:col-span-7 relative w-full h-[380px] sm:h-[480px] rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] bg-neutral-900 border border-neutral-100">
            
            {/* DETALLE CORPORATIVO REFINADO: TRIPLE COLOR DEL LOGO */}
            <div className="absolute left-0 top-0 bottom-0 w-[5px] z-20 flex flex-col">
              <div className="flex-1 bg-[#47717A]" title="Océano Profundo" />
              <div className="flex-1 bg-[#E2A84B]" title="Amarillo Mostaza" />
              <div className="flex-1 bg-[#BD1B23]" title="Rojo Carmesí" />
            </div>

            {/* FILTRO OSCURO CENITAL MOODY */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950/40 via-transparent to-neutral-950/10 pointer-events-none" />
            
            {/* CONTENEDOR DE IMÁGENES */}
            <div className="w-full h-full pl-[5px] relative">
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Residencia Contemporánea ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] transition-opacity duration-1000 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                  }`}
                />
              ))}
            </div>

            {/* PUNTOS INDICADORES DE IMAGEN */}
            <div className="absolute bottom-4 right-6 z-20 flex gap-1.5 bg-neutral-950/40 backdrop-blur-sm p-2 rounded-full">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'w-4 bg-[#BD1B23]' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

        {/* BUSCADOR INTEGRADO (Abajo) */}
        <div className="mt-12 bg-[#F5F5F5] p-5 rounded-3xl max-w-5xl w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* TIPO */}
            <div className="md:col-span-3 text-left w-full">
              <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-3">Tipo</label>
              <div className="relative">
                <select className="w-full bg-white text-[#333333] text-sm rounded-full py-3 px-4 appearance-none border border-neutral-200/40 outline-none cursor-pointer font-medium">
                  <option>Compra</option>
                  <option>Renta</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
              </div>
            </div>
            
            {/* CATEGORÍA */}
            <div className="md:col-span-3 text-left w-full">
              <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-3">Categoría</label>
              <div className="relative">
                <select className="w-full bg-white text-[#333333] text-sm rounded-full py-3 px-4 appearance-none border border-neutral-200/40 outline-none cursor-pointer font-medium">
                  <option>Departamento</option>
                  <option>Casa Residencial</option>
                  <option>Penthouse</option>
                  <option>Terreno</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
              </div>
            </div>

            {/* DIRECCIÓN / UBICACIÓN */}
            <div className="md:col-span-4 text-left w-full">
              <label className="block text-xs font-semibold text-transparent mb-1.5 hidden md:block">Ubicación</label>
              <input 
                type="text" 
                placeholder="Buscar por ubicación, dirección o calle..." 
                className="w-full bg-white text-[#333333] text-sm rounded-full py-3 px-5 border border-neutral-200/40 outline-none placeholder:text-[#999999]"
              />
            </div>

            {/* BOTÓN BUSCAR ROJO */}
            <div className="md:col-span-2 w-full">
              {/* Forzamos que este botón también ejecute la vista del catálogo completo de golpe */}
              <button 
                type="button"
                onClick={() => onViewChange && onViewChange('catalog')}
                className="w-full py-3 bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full text-sm transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
              >
                Buscar
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
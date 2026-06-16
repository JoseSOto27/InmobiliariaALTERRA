import React from 'react';

export default function AboutPage() {
  // Datos de los pilares o valores de la marca
  const pillars = [
    {
      title: "Transparencia total",
      description: "Cada proceso, contrato y tasación se maneja con claridad absoluta. Creemos que la confianza es el cimiento de cualquier inversión exitosa.",
      color: "bg-[#47717A]" // Azul Océano Profundo
    },
    {
      title: "Arquitectura y Vanguardia",
      description: "Nos apasionan los espacios con identidad propia. Curamos un catálogo selecto que destaca por su diseño contemporáneo, funcionalidad y valor estructural.",
      color: "bg-[#E2A84B]" // Amarillo Mostaza / Oro Mate
    },
    {
      title: "Compromiso Local",
      description: "Conocemos el terreno de manera profunda, conectando de forma personalizada a cada cliente con el entorno idóneo para su desarrollo residencial o comercial.",
      color: "bg-[#BD1B23]" // Rojo Carmesí / Paprika
    }
  ];

  return (
    <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex-grow text-left animate-fadeIn bg-white">
      
      {/* SECCIÓN 1: ENCABEZADO EDITORIAL IMPONENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        <div className="lg:col-span-6">
          <span className="text-xs font-semibold text-[#BD1B23] uppercase tracking-widest pl-1 block mb-3">
            Nuestra Esencia
          </span>
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-[3.5rem] font-light text-[#222222] tracking-tight leading-[1.15]">
            Creamos conexiones <br />
            <span className="text-[#333333] font-medium">inmobiliarias con identidad</span>
          </h1>
        </div>
        <div className="lg:col-span-6 pt-4 lg:pt-10">
          <p className="font-sans text-neutral-500 text-base leading-relaxed font-light">
            En <span className="font-medium text-[#222222]">Alterra Haus</span> redefinimos la experiencia de encontrar tu espacio ideal. No solo listamos propiedades; entendemos la arquitectura, la plusvalía y el valor emocional que representa cada inversión. Nuestro enfoque purificado elimina el ruido del mercado tradicional para ofrecerte un servicio de alta gama, ágil y transparente.
          </p>
        </div>
      </div>

      {/* SECCIÓN 2: TARJETA DE INFRAESTRUCTURA VISUAL CON LA TRIPLE LÍNEA */}
      <div className="relative w-full h-[300px] sm:h-[400px] rounded-[2rem] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.04)] bg-neutral-900 border border-neutral-100 mb-20">
        {/* Detalle corporativo de la triple línea súper fina (5px) */}
        <div className="absolute left-0 top-0 bottom-0 w-[5px] z-20 flex flex-col">
          <div className="flex-1 bg-[#47717A]" />
          <div className="flex-1 bg-[#E2A84B]" />
          <div className="flex-1 bg-[#BD1B23]" />
        </div>
        
        {/* Filtro sombrío sofisticado */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950/30 via-transparent to-transparent pointer-events-none" />
        
        {/* Imagen moody de concreto/arquitectura limpia */}
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" 
          alt="Alterra Haus Workspace" 
          className="w-full h-full object-cover pl-[5px] filter brightness-[0.85] contrast-[1.02]"
        />
      </div>

      {/* SECCIÓN 3: REJILLA DE PILARES Y VALORES */}
      <div className="space-y-6">
        <div className="border-b border-neutral-100 pb-4">
          <h2 className="text-xl font-light text-[#222222] tracking-tight uppercase sm:text-2xl">
            Nuestros <span className="text-[#BD1B23] font-medium">Fundamentos</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {pillars.map((pillar, index) => (
            <div 
              key={index} 
              className="bg-[#F5F5F5] p-8 rounded-[2rem] border border-transparent hover:border-neutral-200/50 transition-all duration-300 flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                {/* Indicador de color minimalista circular en sintonía con el logo */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${pillar.color}`} />
                  <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                    Pilar 0{index + 1}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-[#333333] tracking-tight group-hover:text-[#BD1B23] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
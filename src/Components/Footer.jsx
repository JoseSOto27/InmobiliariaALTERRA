import React, { useState } from 'react';

// Ruta de tu logotipo (manteniendo concordancia con la Navbar)
const LOGO_IMAGE_URL = '/logo.png'; 

export default function Footer() {
  const anioActual = new Date().getFullYear();
  const [imageError, setImageError] = useState(false);

  return (
    /* 🕋 FONDO OSCURO MATE SEGÚN LA BASE DE LA CAPTURA temp_image_8F1A5E97-9AD0-4A67-9801-73BD1EEF9BAB.WEBP */
    <footer className="font-sans bg-[#1A1A1A] text-neutral-400 border-t border-neutral-800/60 relative z-30">
      
      {/* SECCIÓN PRINCIPAL DEL FOOTER */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 text-left">
        
        {/* COLUMNA 1: Identidad Corporativa (Ocupa 5 columnas en escritorio) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            {LOGO_IMAGE_URL && !imageError ? (
              <img 
                src={LOGO_IMAGE_URL} 
                alt="castroagustin" 
                className="h-6 w-auto object-contain brightness-0 invert" 
                onError={() => setImageError(true)}
              />
            ) : (
              /* RESPALDO MINIMALISTA EXACTO EN NEUTRO */
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#BD1B23] rounded-[4px] flex items-center justify-center relative overflow-hidden">
                  <div className="w-2 h-2 bg-white rotate-45 mt-2"></div>
                </div>
                <span className="font-sans font-medium text-sm tracking-tight text-white">
                  castroagustin<span className="text-neutral-500 font-light">.com.ar</span>
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
            Nuestra seriedad y profesionalismo se enfocan en buscar el mejor lugar para ti. Descubre una experiencia inmobiliaria de alta gama diseñada a tu medida.
          </p>
        </div>

        {/* COLUMNA 2: Enlaces de Navegación (Ocupa 3 columnas en escritorio) */}
        <div className="md:col-span-3">
          <h4 className="text-white font-semibold text-sm tracking-tight mb-4">
            Menú
          </h4>
          <ul className="space-y-2.5 text-sm font-light text-neutral-400">
            <li>
              <a href="#inicio" className="hover:text-[#BD1B23] transition-colors">Inicio</a>
            </li>
            <li>
              <a href="#propiedades" className="hover:text-[#BD1B23] transition-colors">Propiedades</a>
            </li>
            <li>
              <a href="#sobre-nosotros" className="hover:text-[#BD1B23] transition-colors">Sobre nosotros</a>
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: Datos de Contacto (Ocupa 4 columnas en escritorio) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-white font-semibold text-sm tracking-tight mb-4">
            Contacto
          </h4>
          <ul className="space-y-3 text-sm font-light text-neutral-400">
            <li className="flex flex-col">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Ubicación</span>
              <span className="text-neutral-300 mt-0.5">Tulancingo de Bravo, Hidalgo, México.</span>
            </li>
            <li className="flex flex-col">
              <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Atención</span>
              <span className="text-neutral-300 mt-0.5">Lunes a Viernes: 9:00 AM - 6:00 PM</span>
            </li>
            <li className="pt-1">
              {/* Botón tipo cápsula gris oscuro idéntico a las amenidades del feed */}
              <a 
                href="https://wa.me/7751599597" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-xs text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/50 px-5 py-2.5 rounded-full transition-colors inline-block tracking-tight"
              >
                Conectar por WhatsApp
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: Derechos de Autor */}
      <div className="bg-[#111111] py-6 border-t border-neutral-800/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-500">
          <p>© {anioActual} CodeClick. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-[#BD1B23] transition-colors cursor-pointer">Aviso de privacidad</span>
            <span className="hover:text-[#BD1B23] transition-colors cursor-pointer">Términos de servicio</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
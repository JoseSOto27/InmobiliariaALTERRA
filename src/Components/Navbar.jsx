import React, { useState } from 'react';

// Tu logotipo oficial de Alterra Haus
const LOGO_IMAGE_URL = '/logo.png'; 

export default function Navbar({ isAdmin, onLogout, onOpenLogin, currentView, onViewChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleMobileLoginClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (onOpenLogin) onOpenLogin();
  };

  const handleNavigation = (viewName) => {
    setIsOpen(false); // Cierra el menú móvil al navegar
    if (onViewChange) {
      onViewChange(viewName);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* 🔮 1. BARRA DE NAVEGACIÓN PRINCIPAL (LIQUID GLASS UNIFICADO EN MÓVIL Y ESCRITORIO) */}
      <nav className="relative z-50 font-sans bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-full border border-white/40 transition-all duration-300">
        <div className="px-6 sm:px-8">
          <div className="flex justify-between h-14 items-center">
            
            {/* LOGO CORPORATIVO */}
            <div 
              onClick={() => handleNavigation('home')} 
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              {LOGO_IMAGE_URL && !imageError ? (
                <img 
                  src={LOGO_IMAGE_URL} 
                  alt="Alterra Haus" 
                  className="h-6 w-auto object-contain"
                  onError={() => setImageError(true)} 
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#BD1B23] rounded-[4px] flex items-center justify-center relative overflow-hidden">
                    <div className="w-2 h-2 bg-white rotate-45 mt-2"></div>
                  </div>
                  <span className="font-sans font-medium text-sm tracking-tight text-[#333333]">
                    alterra<span className="text-neutral-400 font-light">haus.com</span>
                  </span>
                </div>
              )}

              {isAdmin && (
                <span className="font-sans ml-2 bg-white/80 backdrop-blur-sm text-neutral-600 text-[10px] font-medium px-2 py-0.5 rounded-full border border-neutral-200/40">
                  Agente
                </span>
              )}
            </div>
            
            {/* ENLACES DE ESCRITORIO */}
            <div className="hidden md:flex items-center gap-6 text-sm font-normal text-[#333333]">
              <button 
                type="button"
                onClick={() => handleNavigation('home')} 
                className={`transition-colors duration-200 cursor-pointer outline-none px-2 py-1 ${currentView === 'home' ? 'text-[#BD1B23] font-semibold' : 'hover:text-[#BD1B23]'}`}
              >
                Inicio
              </button>
              
              <button 
                type="button"
                onClick={() => handleNavigation('catalog')} 
                className={`transition-colors duration-200 cursor-pointer outline-none px-2 py-1 ${currentView === 'catalog' ? 'text-[#BD1B23] font-semibold' : 'hover:text-[#BD1B23]'}`}
              >
                Propiedades
              </button>
              
              <button 
                type="button"
                onClick={() => handleNavigation('about')} 
                className={`transition-colors duration-200 cursor-pointer outline-none px-2 py-1 ${currentView === 'about' ? 'text-[#BD1B23] font-semibold' : 'hover:text-[#BD1B23]'}`}
              >
                Sobre nosotros
              </button>

              {/* BOTÓN ACCESO AGENTE EN CÁPSULA CRISTALINA */}
              {isAdmin ? (
                <button 
                  onClick={onLogout} 
                  className="px-4 py-1.5 border border-[#BD1B23] text-[#BD1B23] hover:bg-[#BD1B23] hover:text-white rounded-full text-xs font-medium transition-all cursor-pointer outline-none"
                >
                  Salir
                </button>
              ) : (
                <button 
                  onClick={onOpenLogin} 
                  className="px-4 py-1.5 border border-neutral-300/40 bg-white/40 hover:border-neutral-800 text-[#333333] hover:bg-neutral-900 hover:text-white rounded-full text-xs font-medium transition-all cursor-pointer outline-none shadow-sm"
                >
                  Acceso Agente
                </button>
              )}

              {/* BOTÓN DE CONTACTO EXCLUSIVO */}
              <a 
                href="#contacto" 
                className="text-[#BD1B23] font-semibold hover:opacity-80 transition-opacity pl-2 border-l border-neutral-300/40"
              >
                Contactanos
              </a>
            </div>

            {/* BOTÓN HAMBURGUESA (MÓVIL) - Mantenido arriba en z-50 */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-[#333333] p-1.5 rounded-full hover:bg-white/60 focus:outline-none cursor-pointer transition-all relative z-50"
                aria-label="Menú"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 2. DESPLEGABLE INTERNO MÓVIL (LIQUID GLASS DE PANTALLA COMPLETA) */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-2xl z-40 flex flex-col justify-between p-8 pt-28 animate-fadeIn md:hidden">
          
          {/* ENLACES INTERNOS EN REJILLA LIMPIA */}
          <div className="space-y-6 text-left pl-4">
            <button 
              onClick={() => handleNavigation('home')} 
              className={`w-full text-left block py-2 text-2xl tracking-tight ${currentView === 'home' ? 'text-[#BD1B23] font-semibold' : 'text-[#333333] font-light'}`}
            >
              Inicio
            </button>
            
            <button 
              onClick={() => handleNavigation('catalog')} 
              className={`w-full text-left block py-2 text-2xl tracking-tight ${currentView === 'catalog' ? 'text-[#BD1B23] font-semibold' : 'text-[#333333] font-light'}`}
            >
              Propiedades
            </button>
            
            <button 
              onClick={() => handleNavigation('about')} 
              className={`w-full text-left block py-2 text-2xl tracking-tight ${currentView === 'about' ? 'text-[#BD1B23] font-semibold' : 'text-[#333333] font-light'}`}
            >
              Sobre nosotros
            </button>
          </div>
          
          {/* SECCIÓN INFERIOR ACCIONES DE LOGEO / CONTACTO */}
          <div className="pt-6 border-t border-neutral-200/40 space-y-6 pl-4 text-left mb-8">
            {isAdmin ? (
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }} 
                className="w-full text-left block py-2 text-base text-[#BD1B23] font-medium"
              >
                Salir de cuenta
              </button>
            ) : (
              <button 
                onClick={handleMobileLoginClick} 
                className="flex items-center gap-2 justify-center w-full sm:w-auto px-5 py-2.5 border border-white/60 text-[#333333] font-medium text-sm rounded-full bg-white/60 backdrop-blur-sm active:bg-white/80 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Acceso Agente
              </button>
            )}
            
            <a 
              href="#contacto" 
              onClick={() => setIsOpen(false)} 
              className="inline-block w-full sm:w-auto px-8 py-3.5 font-semibold text-white bg-[#BD1B23] rounded-full text-sm text-center shadow-sm active:scale-95 transition-transform"
            >
              Contactanos
            </a>
          </div>

          {/* Sutil gradiente cenital que acentúa las sombras inferiores del dispositivo */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/20 to-transparent pointer-events-none -z-10" />

        </div>
      )}

    </div>
  );
}
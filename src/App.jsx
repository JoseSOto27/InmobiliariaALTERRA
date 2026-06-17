import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import Hero from './Components/Hero';
import PropertyCard from './Components/PropertyCard';
import PropertyMap from './Components/PropertyMap';
import PropertyModal from './Components/PropertyModal';
import LoginForm from './Components/LoginForm';
import Dashboard from './Components/Dashboard'; 
import Footer from './Components/Footer'; 
import CatalogPage from './pages/CatalogPage'; 
import AboutPage from './pages/AboutPage'; // 🌟 1. IMPORTACIÓN DE LA NUEVA PÁGINA SOBRE NOSOTROS
import { supabase } from './supabaseClient'; 

export default function App() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true); 
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'catalog' o 'about'

  // Carga desde Supabase
  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('publicaciones')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error("Error al sincronizar catálogo desde Supabase:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  const handleAddProperty = (newProperty) => {
    setProperties([newProperty, ...properties]);
  };

  const handleUpdateProperty = (updatedProperty) => {
    setProperties(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  // VISTA ADMINISTRATIVA AISLADA (Dashboard de Control)
  if (isAuthenticated) {
    return (
      <Dashboard 
        properties={properties}
        onAddProperty={handleAddProperty}
        onUpdateProperty={handleUpdateProperty}
        onDeleteProperty={handleDeleteProperty}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentView('home');
        }}
      />
    );
  }

  // INTERFAZ PÚBLICA GENERAL UNIFICADA
  return (
    <div className="font-sans min-h-screen bg-white text-[#333333] antialiased flex flex-col justify-between">
      
      {/* 1. NAVBAR COMÚN PARA TODAS LAS VISTAS */}
      <Navbar 
        isAdmin={isAuthenticated} 
        onLogout={() => setIsAuthenticated(false)}
        onOpenLogin={() => setShowLoginModal(true)} 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      {/* 2. CONTENIDO DINÁMICO MULTI-PÁGINA */}
      {currentView === 'home' ? (
        <div>
          <Hero onViewChange={setCurrentView} />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 text-neutral-400 gap-4">
                <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#BD1B23] rounded-full animate-spin"></div>
                <p className="text-sm font-light">Sincronizando catálogo...</p>
              </div>
            ) : (
              <>
                <PropertyMap properties={properties} />

                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-neutral-100 pb-5 text-left">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-light text-[#333333] tracking-tight">
                      Propiedades <span className="text-[#BD1B23] font-medium">Destacadas</span>
                    </h2>
                    <p className="text-sm text-neutral-400 font-light mt-1">
                      Explora nuestra selección exclusiva de inmuebles disponibles.
                    </p>
                  </div>
                  <span className="text-xs text-neutral-400 font-light mt-2 sm:mt-0 bg-neutral-50 px-3 py-1 rounded-full border border-neutral-200/60">
                    {properties.length} registros listados
                  </span>
                </div>

                {properties.length === 0 ? (
                  <div className="text-center py-20 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-[2rem] p-8 max-w-md mx-auto">
                    <h4 className="text-base font-semibold text-[#333333] tracking-tight">No hay publicaciones activas</h4>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {properties.slice(0, 6).map(property => (
                        <PropertyCard 
                          key={property.id} 
                          property={property} 
                          onClick={() => setSelectedProperty(property)}
                        />
                      ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                      <button 
                        type="button"
                        onClick={() => setCurrentView('catalog')}
                        className="px-6 py-2.5 border border-neutral-200 text-neutral-500 hover:text-[#BD1B23] hover:border-[#BD1B23] bg-white rounded-full text-xs font-normal transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        + ver más catálogo
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </main>
        </div>
      ) : currentView === 'catalog' ? (
        /* VISTA B: CATÁLOGO EXTENDIDO */
        <CatalogPage properties={properties} onSelectProperty={setSelectedProperty} />
      ) : (
        /* VISTA C: SOBRE NOSOTROS 🌟 (Aquí conectamos de forma explícita la AboutPage) */
        <AboutPage />
      )}

      {/* 3. CAPAS MODALES GLOBALES */}
      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}

      {showLoginModal && (
        <LoginForm 
          onLogin={() => setIsAuthenticated(true)} 
          onClose={() => setShowLoginModal(false)} 
        />
      )}

      {/* 4. UN SOLO FOOTER GLOBAL */}
      <Footer />
    </div>
  );
}
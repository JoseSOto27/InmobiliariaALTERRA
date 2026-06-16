import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Corrección de bug de Leaflet con entornos empaquetados
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function PropertyMap({ properties }) {
  {/* 📍 COORDENADAS EXACTAS ENFOCADAS EN TULANCINGO, HIDALGO CON ZOOM LOCAL OPTIMIZADO */}
  const centerPosition = [20.0841, -98.3690]; 
  const initialZoom = 11;

  return (
    /* CONTENEDOR TOTALMENTE BLANCO Y LIMPIO */
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 my-4">
      
      {/* BLOQUE DE ENCABEZADO INTEGRADO CON EL ESTILO DEL CONTENIDO */}
      <div className="max-w-7xl mx-auto mb-8 text-left">
        <h2 className="font-sans text-2xl sm:text-3xl font-light text-[#333333] tracking-tight">
          Propiedades <span className="text-[#BD1B23] font-medium">destacadas en el mapa</span>
        </h2>
        <p className="font-sans text-neutral-400 text-sm mt-1.5 font-light">
          Navega y ubica de manera visual las residencias disponibles en tu zona.
        </p>
      </div>

      {/* CONTENEDOR DEL MAPA CON BORDES REDONDEADOS SUAVES SIN BORDES COLOREADOS */}
      <div className="max-w-7xl mx-auto w-full h-[480px] rounded-[2rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-neutral-100 z-10 relative">
        <MapContainer 
          center={centerPosition} 
          zoom={initialZoom} 
          scrollWheelZoom={false}
          dragging={!L.Browser.mobile}
          tap={!L.Browser.mobile}
          className="w-full h-full"
        >
          {/* 🗺️ CAPA DE MAPA ULTRA-MINIMALISTA (POSITRON LIGHT) PARA INTEGRARSE CON EL BLANCO */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {properties.map((property) => (
            property.coordinates && (
              <Marker key={property.id} position={property.coordinates}>
                {/* POPUP RE-DISEÑADO MINIMALISTA */}
                <Popup>
                  <div className="p-0.5 max-w-[190px] bg-white font-sans">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-24 object-cover rounded-xl mb-2" 
                    />
                    {/* Detalles en minúsculas/formato normal */}
                    <h4 className="font-sans font-semibold text-sm text-[#333333] leading-tight mb-1">
                      {property.title}
                    </h4>
                    {/* Precio limpio en Rojo Carmesí */}
                    <p className="font-sans text-sm text-[#BD1B23] font-semibold">
                      MX {property.price.toLocaleString('en-US')}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
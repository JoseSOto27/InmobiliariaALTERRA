import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PropertyModal({ property, onClose }) {
  if (!property) return null;

  const images = property.images && property.images.length > 0 ? property.images : [property.image];
  const [activeImage, setActiveImage] = useState(0);

  // CONTROL DEL SEGUNDO MODAL DE CITAS
  const [mostrarModalCita, setMostrarModalCita] = useState(false);

  // ESTADOS PARA EL FORMULARIO DE LA CITA
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [agendando, setAgendando] = useState(false);

  // Formato adaptado para México manteniendo el estilo visual limpio de tus diseños
  const formatPrice = (price) => {
    const formatted = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0
    }).format(price);
    return `MXN $${formatted}`;
  };

  const esCarro = property.categoria === 'Carro';

  const handleAgendarCita = async (e) => {
    e.preventDefault();
    if (!nombre || !whatsapp || !fecha || !hora) {
      alert("Por favor llena todos los campos para solicitar la visita.");
      return;
    }

    setAgendando(true);

    try {
      const { error } = await supabase
        .from('citas')
        .insert([
          {
            publicacion_id: property.id,
            tipo_producto: property.categoria,
            nombre_cliente: nombre,
            whatsapp_cliente: whatsapp,
            fecha_cita: fecha,
            hora_cita: hora,
            status: 'Pendiente'
          }
        ]);

      if (error) throw error;

      alert(`¡Solicitud enviada con éxito! Un asesor se comunicará contigo a la brevedad.`);
      
      setNombre(''); setWhatsapp(''); setFecha(''); setHora('');
      setMostrarModalCita(false);
    } catch (err) {
      console.error(err);
      alert("Error al agendar la cita: " + err.message);
    } finally {
      setAgendando(false);
    }
  };

  const textoWhatsApp = esCarro 
    ? `Hola, me interesa obtener más información sobre el vehículo: "${property.title}" (Modelo ${property.modelYear || ''}), anunciado en ${property.location || ''} por ${formatPrice(property.price)}.`
    : `Hola, me interesa obtener más información sobre la propiedad: "${property.title}" en ${property.location || ''} (${formatPrice(property.price)}).`;

  const whatsappMessage = encodeURIComponent(textoWhatsApp);

  return (
    /* CAPA BASE TRASLÚCIDA MINIMALISTA OSCURA */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      
      {/* CONTENEDOR PRINCIPAL: BLANCO INTEGRAL */}
      <div className="font-sans relative w-full max-w-4xl bg-white rounded-[2rem] shadow-xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row border border-neutral-100 animate-fadeIn">
        
        {/* Botón Cerrar Principal Elegante */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-neutral-800 p-2 rounded-full border border-neutral-200/50 transition-colors focus:outline-none cursor-pointer shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 📐 COLUMNA IZQUIERDA BALANCEADA: Regresa a un 50% limpio para aprovechar el espacio */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-start border-r border-neutral-100 flex-shrink-0">
          
          {/* 📐 ESCALA DEFINITIVA EN COMPUTADORA: Ajustada a h-[550px] para emparejarse con el bloque de texto */}
          <div className="relative w-full h-64 md:h-[550px] overflow-hidden flex items-center justify-center bg-white flex-shrink-0">
            <img 
              src={images[activeImage]} 
              alt={property.title} 
              className="w-full h-full object-cover z-10" 
            />
            
            {/* Tag Informativo Superior Izquierdo Minimalista */}
            {(property.tag || property.esquema) && (
              <span className="absolute bottom-4 left-4 bg-white/95 text-neutral-800 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm z-20 border border-neutral-200/40">
                {property.tag || property.esquema}
              </span>
            )}
          </div>
          
          {/* Carrusel de Miniaturas pegado inmediatamente abajo de la foto */}
          <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t border-neutral-100 max-w-full justify-start md:justify-center flex-shrink-0 no-scrollbar">
            {images.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setActiveImage(index)} 
                className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${activeImage === index ? 'border-[#BD1B23] scale-95 shadow-sm' : 'border-neutral-200/60 opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 📐 COLUMNA DERECHA BALANCEADA: 50% de ancho con scroll interno independiente */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-[90vh] text-left">
          
          {/* PRECIO DESTACADO EN NEGRO PURO */}
          <p className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-0.5">{formatPrice(property.price)}</p>
          
          {/* TÍTULO EN FORMATO CONVENCIONAL MINÚSCULAS */}
          <h3 className="text-lg font-semibold text-[#333333] tracking-tight leading-snug mb-1">{property.title}</h3>
          
          {/* UBICACIÓN EN GRIS SECUNDARIO */}
          <span className="text-sm text-neutral-400 font-light mb-5">{property.location || 'Ubicación'}</span>

          {/* AMENIDADES EN LÍNEA ESTILO CÁPSULA CON ICONOS INTEGRADOS */}
          {esCarro ? (
            <div className="flex flex-wrap gap-2 mb-6 text-xs text-neutral-600 font-light">
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-neutral-400">Año:</span>
                <span className="font-medium text-[#333333]">{property.modelYear || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-neutral-400">Transmisión:</span>
                <span className="font-medium text-[#333333] uppercase">{property.transmission || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 002-2h2a2 2 0 002 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 002-2h2a2 2 0 002 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                <span className="font-medium text-[#333333]">{property.kms ? `${property.kms.toLocaleString('es-MX')} km` : '0 km'}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 mb-6 text-xs text-neutral-600 font-light">
              {property.categoria !== 'Terreno' && (
                <>
                  <div className="flex items-center gap-1.5 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4M4 12v6m0-6V6m16 6v6m0-6V6" />
                    </svg>
                    <span className="font-medium text-[#333333]">{property.beds || 0} Hab</span>
                  </div>
                  <div className="flex items-center gap-1.5 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8" />
                    </svg>
                    <span className="font-medium text-[#333333]">{property.baths || 0} Baños</span>
                  </div>
                  <div className="flex items-center gap-1.5 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                    <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    <span className="font-medium text-[#333333]">{property.parking || property.cochera || 0} Estac.</span>
                  </div>
                </>
              )}
              
              {property.areaConst > 0 && (
                <div className="flex items-center gap-1.5 border border-neutral-200/60 rounded-lg px-3 py-1.5">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0V11m0 0h5" />
                  </svg>
                  <span className="text-neutral-400">Construido:</span>
                  <span className="font-medium text-[#333333]">{property.areaConst} m²</span>
                </div>
              )}

              {property.areaTerreno > 0 && (
                <div className="flex items-center gap-1.5 border border-neutral-200/60 rounded-lg px-3 py-1.5 bg-neutral-50">
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 18h16M4 6v12M20 6v12" />
                  </svg>
                  <span className="font-medium text-[#333333]">{property.areaTerreno} m² Superficie</span>
                </div>
              )}
            </div>
          )}

          {/* Descripción Detallada Limpia */}
          <div className="mb-6 flex-grow">
            <h4 className="text-xs text-neutral-400 uppercase tracking-wider mb-2 border-b border-neutral-100 pb-1.5 font-medium">Detalles del Inmueble</h4>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line font-light">{property.description || "No se incluyeron especificaciones adicionales por el momento."}</p>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 mt-auto flex-shrink-0">
            <button 
              onClick={() => setMostrarModalCita(true)}
              className="py-3 bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full text-sm transition-colors cursor-pointer text-center"
            >
              {esCarro ? 'Probar Vehículo' : 'Agendar Visita'}
            </button>

            <a 
              href={`https://wa.me/521111234567?text=${whatsappMessage}`} 
              target="_blank" rel="noopener noreferrer"
              className="py-3 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-medium rounded-full text-sm transition-colors text-center cursor-pointer"
            >
              WhatsApp Directo
            </a>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SEGUNDO MODAL DE AGENDA                                                   */}
      {/* ========================================================================= */}
      {mostrarModalCita && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 md:p-8 shadow-xl relative border border-neutral-100 font-sans text-left">
            
            <button 
              type="button"
              onClick={() => setMostrarModalCita(false)} 
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#333333] tracking-tight">Planificar encuentro</h3>
              <p className="text-xs text-neutral-400 font-light mt-1">
                Solicitud para la propiedad: <span className="text-[#BD1B23] font-medium">"{property.title}"</span>
              </p>
            </div>

            <form onSubmit={handleAgendarCita} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Nombre completo</label>
                <input 
                  type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Juan Pérez" 
                  className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 font-normal border border-transparent focus:border-neutral-200 transition-colors" required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">WhatsApp de contacto</label>
                <input 
                  type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ej. 7751234567" 
                  className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 font-normal border border-transparent focus:border-neutral-200 transition-colors" required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Fecha</label>
                  <input 
                    type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                    className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none border border-transparent focus:border-neutral-200 transition-colors font-normal" required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Horario</label>
                  <div className="relative">
                    <select 
                      value={hora} onChange={(e) => setHora(e.target.value)}
                      className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 appearance-none outline-none border border-transparent focus:border-neutral-200 transition-colors font-normal cursor-pointer" required
                    >
                      <option value="">Selecciona...</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-100 mt-5">
                <button 
                  type="button" onClick={() => setMostrarModalCita(false)}
                  className="w-1/3 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium rounded-full text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" disabled={agendando}
                  className="w-2/3 py-2.5 bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full text-xs transition-colors disabled:opacity-50"
                >
                  {agendando ? 'Enviando...' : 'Confirmar'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
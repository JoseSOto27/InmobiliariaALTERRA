import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; 

export default function Dashboard({ properties, onAddProperty, onUpdateProperty, onDeleteProperty, onLogout }) {
  const [seccionActiva, setSeccionActiva] = useState('inventario'); 
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [tabFiltro, setTabFiltro] = useState('Todos');
  const [isCompressing, setIsCompressing] = useState(false); 
  
  const [citas, setCitas] = useState([]);
  const [loadingCitas, setLoadingCitas] = useState(false);

  const [formData, setFormData] = useState({
    categoria: 'Casa', esquema: 'Venta', title: '', location: '', price: '', description: '', tag: 'Entrega Inmediata', 
    images: [], 
    lat: '', lng: '', beds: '', baths: '', parking: '', areaConst: '', areaTerreno: '', brand: '', modelYear: '', kms: '', transmission: 'Automática',
    carColor: 'Blanco', interiorColor: 'Negro'
  });

  useEffect(() => {
    if (seccionActiva === 'citas') {
      cargarCitas();
    }
  }, [seccionActiva]);

  async function cargarCitas() {
    setLoadingCitas(true);
    try {
      const { data, error } = await supabase
        .from('citas')
        .select('*, publicaciones(title)')
        .order('fecha_cita', { ascending: true });
      
      if (error) throw error;
      setCitas(data || []);
    } catch (err) {
      console.error("Error al sincronizar la agenda de citas:", err.message);
    } finally {
      setLoadingCitas(false);
    }
  }

  const handleConcluirCita = async (id) => {
    if (window.confirm("¿Deseas marcar esta cita como concluida y removerla de la agenda activa?")) {
      try {
        const { error } = await supabase.from('citas').delete().eq('id', id);
        if (error) throw error;
        setCitas(citas.filter(c => c.id !== id));
      } catch (err) {
        alert("Error al eliminar la cita: " + err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const compressToWebP = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 900;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/webp', 0.75));
        };
      };
    });
  };

  const handleMultipleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsCompressing(true);
    try {
      const compressedUrls = await Promise.all(files.map(file => compressToWebP(file)));
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...compressedUrls] }));
    } catch (error) {
      console.error(error);
    } finally { setIsCompressing(false); }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, index) => index !== indexToRemove) }));
  };

  const handleEditClick = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      categoria: item.categoria || 'Casa',
      esquema: item.esquema || 'Venta',
      title: item.title,
      location: item.location,
      price: item.price,
      description: item.description || '',
      tag: item.tag,
      lat: item.coordinates ? item.coordinates[0] : '',
      lng: item.coordinates ? item.coordinates[1] : '',
      images: item.images || [],
      beds: item.beds || '',
      baths: item.baths || '',
      parking: item.parking || '',
      areaConst: item.areaConst || '',
      areaTerreno: item.areaTerreno || '',
      brand: item.brand || '',
      modelYear: item.modelYear || '',
      kms: item.kms || '',
      transmission: item.transmission || 'Automática',
      carColor: item.carColor || 'Blanco',
      interiorColor: item.interiorColor || 'Negro'
    });
    setSeccionActiva('publicar');
  };

  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){ u8arr[n] = bstr.charCodeAt(n); }
    return new Blob([u8arr], {type:mime});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || formData.images.length === 0) {
      alert("Introduce los campos obligatorios y al menos 1 foto.");
      return;
    }

    setIsCompressing(true);

    try {
      const finalStorageUrls = [];

      for (const base64Str of formData.images) {
        if (base64Str.startsWith('http')) {
          finalStorageUrls.push(base64Str);
          continue;
        }

        const blob = dataURLtoBlob(base64Str);
        const nombreArchivo = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.webp`;

        const { error: storageError } = await supabase.storage
          .from('imagenes')
          .upload(nombreArchivo, blob, { contentType: 'image/webp' });

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage.from('imagenes').getPublicUrl(nombreArchivo);
        finalStorageUrls.push(publicUrlData.publicUrl);
      }

      const itemPayload = {
        categoria: formData.categoria,
        esquema: formData.esquema,
        title: formData.title,
        location: formData.location,
        price: parseFloat(formData.price),
        description: formData.description,
        tag: formData.tag,
        image: finalStorageUrls[0],
        images: finalStorageUrls,
        coordinates: [parseFloat(formData.lat) || 23.6345, parseFloat(formData.lng) || -102.5528],
        ...(formData.categoria !== 'Carro' ? {
          beds: parseInt(formData.beds) || 0,
          baths: parseFloat(formData.baths) || 0,
          parking: parseInt(formData.parking) || 0,
          areaConst: parseInt(formData.areaConst) || 0,
          areaTerreno: parseInt(formData.areaTerreno) || 0,
          brand: null, modelYear: null, kms: null, transmission: null, carColor: null, interiorColor: null
        } : {
          brand: formData.brand,
          modelYear: formData.modelYear,
          kms: parseInt(formData.kms) || 0,
          transmission: formData.transmission,
          carColor: formData.carColor,
          interiorColor: formData.interiorColor,
          beds: null, baths: null, parking: null, areaConst: null, areaTerreno: null
        })
      };

      if (isEditing) {
        const { error } = await supabase.from('publicaciones').update(itemPayload).eq('id', currentId);
        if (error) throw error;
        onUpdateProperty({ ...itemPayload, id: currentId });
        alert("¡Registro modificado con éxito en Supabase!");
      } else {
        const { data, error } = await supabase.from('publicaciones').insert([itemPayload]).select();
        if (error) throw error;
        onAddProperty({ ...itemPayload, id: data[0].id });
        alert("¡Guardado exitosamente en la base de datos de Supabase!");
      }

      setFormData({
        categoria: 'Casa', esquema: 'Venta', title: '', location: '', price: '', description: '', tag: 'Entrega Inmediata', images: [], lat: '', lng: '', beds: '', baths: '', parking: '', areaConst: '', areaTerreno: '', brand: '', modelYear: '', kms: '', transmission: 'Automática', carColor: 'Blanco', interiorColor: 'Negro'
      });
      setIsEditing(false);
      setCurrentId(null);
      setSeccionActiva('inventario');

    } catch (err) {
      console.error(err);
      alert("Error al conectar con Supabase: " + err.message);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      categoria: 'Casa', esquema: 'Venta', title: '', location: '', price: '', description: '', tag: 'Entrega Inmediata', images: [], lat: '', lng: '', beds: '', baths: '', parking: '', areaConst: '', areaTerreno: '', brand: '', modelYear: '', kms: '', transmission: 'Automática', carColor: 'Blanco', interiorColor: 'Negro'
    });
    setSeccionActiva('inventario');
  };

  const filteredProperties = properties.filter(p => {
    if (tabFiltro === 'Todos') return true;
    if (tabFiltro === 'Inmuebles') return p.categoria !== 'Carro';
    if (tabFiltro === 'Terreno') return p.categoria === 'Terreno';
    if (tabFiltro === 'Carros') return p.categoria === 'Carro';
    return p.categoria === tabFiltro;
  });

  return (
    /* CONTENEDOR MAESTRO BLANCO MINIMALISTA CON TEXTOS NEUTROS OSCUROS */
    <div className="font-sans min-h-screen bg-white text-[#333333] flex flex-col md:flex-row h-screen overflow-hidden antialiased">
      
      {/* 🕋 BARRA LATERAL (SIDEBAR): COLOR ANTRACITA MATE INTEGRAL DE LA MARCA */}
      <aside className="w-full md:w-72 bg-[#1A1A1A] p-6 flex flex-col justify-between shadow-lg z-20 shrink-0 border-r border-neutral-800">
        <div>
          {/* Logotipo Comercial en Escala de Grises Monocromática (Blanco y Negro) */}
          <div className="flex justify-start mb-10 border-b border-neutral-800 pb-6">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="h-9 w-auto object-contain brightness-0 invert opacity-90" 
            />
          </div>
          
          <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-4 px-2">Administración</p>
          <nav className="space-y-1">
            <button onClick={() => setSeccionActiva('inventario')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-light tracking-tight flex items-center gap-3 cursor-pointer transition-all ${seccionActiva === 'inventario' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}>
              Catálogo activo
            </button>
            <button onClick={() => { setIsEditing(false); setSeccionActiva('publicar'); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-light tracking-tight flex items-center gap-3 cursor-pointer transition-all ${seccionActiva === 'publicar' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}>
              Registrar entrada
            </button>
            <button onClick={() => setSeccionActiva('citas')} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-light tracking-tight flex items-center gap-3 cursor-pointer transition-all ${seccionActiva === 'citas' ? 'bg-white text-[#1A1A1A] font-medium' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'}`}>
              Agenda de citas
            </button>
          </nav>
        </div>
        
        {/* BOTÓN SALIR: TOTALMENTE REDONDEADO EN BASE GRIS OSCURA */}
        <button onClick={onLogout} className="w-full bg-neutral-800 hover:bg-neutral-700 text-white text-center py-2.5 rounded-full text-xs font-medium transition-colors cursor-pointer">
          Cerrar módulo
        </button>
      </aside>

      {/* 🚀 ÁREA PRINCIPAL CENTRAL DE OPERACIONES */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen bg-white">
        
        {/* SECCIÓN 1: INVENTARIO DE REGISTROS */}
        {seccionActiva === 'inventario' && (
          <div className="animate-fadeIn space-y-6 text-left">
            <div className="border-b border-neutral-100 pb-5">
              <h1 className="text-2xl sm:text-3xl font-light text-[#333333] tracking-tight">
                Inventario <span className="text-[#BD1B23] font-medium">unificado</span>
              </h1>
              <p className="text-neutral-400 text-sm mt-1 font-light">Sincronización y auditoría del catálogo activo en la nube.</p>
            </div>

            {/* Selector de Pestañas Tipo Píldora Gris */}
            <div className="flex flex-wrap gap-1 bg-[#F5F5F5] p-1 rounded-full border border-neutral-200/40 w-fit">
              {['Todos', 'Inmuebles', 'Terreno', 'Carros'].map((filtro) => (
                <button key={filtro} onClick={() => setTabFiltro(filtro)} className={`px-4 py-1.5 rounded-full text-xs font-normal transition-all cursor-pointer ${tabFiltro === filtro ? 'bg-white text-[#333333] shadow-sm font-medium' : 'text-neutral-500 hover:text-[#333333]'}`}>
                  {filtro === 'Todos' && 'Firma completa'}
                  {filtro === 'Inmuebles' && 'Propiedades'}
                  {filtro === 'Terreno' && 'Terrenos'}
                  {filtro === 'Carros' && 'Motores'}
                </button>
              ))}
            </div>

            {/* Tabla Limpia Minimalista sin Cabeceras de Color Bruscas */}
            <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-neutral-100 text-neutral-400 text-xs font-medium uppercase tracking-wider bg-neutral-50/50">
                    <th className="py-4 px-6">Identificador / Ficha</th>
                    <th className="py-4">Segmento</th>
                    <th className="py-4">Esquema</th>
                    <th className="py-4">Valor de Lista</th>
                    <th className="py-4 text-center">Operaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-[#333333] font-light">
                  {filteredProperties.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/40 transition-colors">
                      <td className="py-4 px-6 flex items-center gap-3">
                        <img src={item.images?.[0] || item.image} alt="" className="w-12 h-9 object-cover rounded-lg border border-neutral-100 bg-neutral-50" />
                        <div>
                          <p className="font-semibold text-[#333333] text-sm tracking-tight">{item.title}</p>
                          <p className="text-xs text-neutral-400 mt-0.5 font-light">Zona: {item.location}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs border border-neutral-200 rounded-md px-2 py-0.5 bg-neutral-50 text-neutral-600 font-medium">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="py-4 text-neutral-500">{item.esquema}</td>
                      <td className="py-4 font-semibold text-[#333333]">MXN ${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(item.price)}</td>
                      <td className="py-4">
                        <div className="flex justify-center gap-2 px-4">
                          <button onClick={() => handleEditClick(item)} className="bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 text-neutral-700 px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer">
                            Editar
                          </button>
                          <button 
                            onClick={async () => { 
                              if(confirm("¿Remover de forma permanente este registro?")) {
                                try {
                                  const { error } = await supabase.from('publicaciones').delete().eq('id', item.id);
                                  if (error) throw error;
                                  onDeleteProperty(item.id);
                                } catch(e) { alert("Error: " + e.message); }
                              } 
                            }} 
                            className="bg-red-50 hover:bg-red-100 border border-red-200/40 text-[#BD1B23] px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: FORMULARIO ADMINISTRATIVO (ESTILO CÁPSULA REDONDEADA) */}
        {seccionActiva === 'publicar' && (
          <div className="animate-fadeIn max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-[2rem] border border-neutral-100 shadow-[0_10px_40px_rgba(0,0,0,0.01)] text-left">
            <div className="mb-6 border-b border-neutral-100 pb-4">
              <h1 className="text-2xl sm:text-3xl font-light text-[#333333] tracking-tight">
                {isEditing ? "Corregir datos de" : "Alta de registro"} <span className="text-[#BD1B23] font-medium">universal</span>
              </h1>
              <p className="text-neutral-400 text-sm mt-1 font-light">La compresión a WebP y estructuración se realizan antes de sincronizar los archivos.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm font-normal text-[#333333]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Segmentación</label>
                  <div className="relative">
                    <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 appearance-none outline-none border border-transparent focus:border-neutral-200 transition-colors cursor-pointer font-normal">
                      <option value="Casa">Casa Residencial</option>
                      <option value="Departamento">Departamento Premium</option>
                      <option value="Terreno">Terreno Comercial</option>
                      <option value="Carro">Vehículo de Gama</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Esquema comercial</label>
                  <div className="relative">
                    <select name="esquema" value={formData.esquema} onChange={handleChange} className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 appearance-none outline-none border border-transparent focus:border-neutral-200 transition-colors cursor-pointer font-normal">
                      <option value="Venta">En Venta</option>
                      <option value="Renta">En Renta</option>
                      <option value="Preventa">Preventa</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Título de la ficha comercial *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej. Residencia Minimalista Inteligente" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-colors font-normal" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Valor solicitado (Neto MXN) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Monto Total" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none border border-transparent focus:border-neutral-200 transition-colors font-normal" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Zona / Fraccionamiento</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ej. Lomas del Valle" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none border border-transparent focus:border-neutral-200 transition-colors font-normal" />
                </div>
              </div>

              {/* Secciones Condicionales Moduladas a Gris Claro */}
              {formData.categoria === 'Carro' ? (
                <div key="car-section" className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4 animate-fadeIn">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Especificaciones del motor</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-neutral-400 text-[11px] block mb-1 pl-1">Marca</label>
                      <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl text-sm outline-none font-normal" />
                    </div>
                    <div>
                      <label className="text-neutral-400 text-[11px] block mb-1 pl-1">Año modelo</label>
                      <input type="number" name="modelYear" value={formData.modelYear} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl text-sm outline-none font-normal" />
                    </div>
                  </div>
                </div>
              ) : (
                <div key="inmo-section" className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4 animate-fadeIn">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Atributos arquitectónicos</p>
                  {formData.categoria !== 'Terreno' && (
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div><label className="text-neutral-400 text-[11px] block mb-1">Habitaciones</label><input type="number" name="beds" value={formData.beds} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl text-center outline-none font-normal" /></div>
                      <div><label className="text-neutral-400 text-[11px] block mb-1">Baños</label><input type="number" step="0.5" name="baths" value={formData.baths} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl text-center outline-none font-normal" /></div>
                      <div><label className="text-neutral-400 text-[11px] block mb-1">Cochera</label><input type="number" name="parking" value={formData.parking} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl text-center outline-none font-normal" /></div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-neutral-400 text-[11px] block mb-1 pl-1">M² Superficie</label><input type="number" name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl outline-none font-normal" /></div>
                    {formData.categoria !== 'Terreno' && (
                      <div><label className="text-neutral-400 text-[11px] block mb-1 pl-1">M² Construidos</label><input type="number" name="areaConst" value={formData.areaConst} onChange={handleChange} className="w-full p-2 bg-white border border-neutral-200/60 rounded-xl outline-none font-normal" /></div>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Descripción narrativa de la ficha</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-2xl p-4 outline-none resize-none font-normal border border-transparent focus:border-neutral-200 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-3">
                <div><label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Geolocalización latitud</label><input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} placeholder="23.6345" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none font-normal" /></div>
                <div><label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Geolocalización longitud</label><input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} placeholder="-102.5528" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none font-normal" /></div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Cargar archivos autorizados *</label>
                <input type="file" accept="image/*" multiple onChange={handleMultipleImagesChange} disabled={isCompressing} className="w-full mt-1 text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-600 hover:file:bg-neutral-200 cursor-pointer disabled:opacity-50" />
              </div>

              {isCompressing && (
                <div className="p-3 bg-red-50 text-[#BD1B23] text-xs font-light rounded-xl animate-pulse text-center">
                  Modulando resoluciones y transmitiendo binarios a la nube... Por favor, espera.
                </div>
              )}

              {formData.images.length > 0 && (
                <div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                    {formData.images.map((url, idx) => (
                      <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-200 bg-white">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-1 right-1 bg-[#BD1B23] text-white p-1 rounded-full text-xs cursor-pointer">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-neutral-100">
                <button type="submit" disabled={isCompressing} className="flex-1 bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full py-3 text-sm transition-colors cursor-pointer disabled:opacity-50">
                  Publicar catálogo
                </button>
                <button type="button" onClick={handleCancel} className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-medium rounded-full py-3 px-6 text-sm transition-colors cursor-pointer">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECCIÓN 3: AGENDA DE CITAS SOLICITADAS */}
        {seccionActiva === 'citas' && (
          <div className="animate-fadeIn space-y-6 text-left">
            <div className="border-b border-neutral-100 pb-5">
              <h1 className="text-2xl sm:text-3xl font-light text-[#333333] tracking-tight">
                Agenda de <span className="text-[#BD1B23] font-medium">prospección</span>
              </h1>
              <p className="text-neutral-400 text-sm mt-1 font-light">Solicitudes de visitas recibidas desde el portal comercial.</p>
            </div>

            {loadingCitas ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
                <div className="w-6 h-6 border-2 border-neutral-200 border-t-[#BD1B23] rounded-full animate-spin"></div>
                <p className="text-xs font-light text-neutral-400">Consultando registros activos...</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400 text-xs font-medium uppercase tracking-wider bg-neutral-50/50">
                      <th className="py-4 px-6">Cliente Prospecto</th>
                      <th className="py-4 px-6">Anuncio de Interés</th>
                      <th className="py-4 px-6">Fecha Solicitada</th>
                      <th className="py-4 px-6">Horario</th>
                      <th className="py-4 px-6 text-center">Seguimiento / Cierre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-sm text-[#333333] font-light">
                    {citas.map((cita) => (
                      <tr key={cita.id} className="hover:bg-neutral-50/40 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-[#333333] text-sm tracking-tight">{cita.nombre_cliente}</p>
                          <span className="text-xs text-neutral-400 font-light">Ref: #{cita.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-neutral-700 truncate max-w-[240px] text-sm tracking-tight">
                            {cita.publicaciones?.title || 'Anuncio no disponible'}
                          </p>
                          <span className="text-[11px] border border-neutral-200 rounded-md px-1.5 py-0.5 mt-1 inline-block bg-neutral-50 text-neutral-500">
                            {cita.tipo_producto}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[#BD1B23] font-medium text-xs">{cita.fecha_cita}</td>
                        <td className="py-4 px-6 text-neutral-500 font-normal">{cita.hora_cita}</td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-2 px-4">
                            <a 
                              href={`https://wa.me/52${cita.whatsapp_cliente}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200/60 px-4 py-1.5 rounded-full text-xs transition-colors flex items-center gap-1 font-normal"
                            >
                              Contactar
                            </a>
                            <button 
                              onClick={() => handleConcluirCita(cita.id)}
                              className="bg-red-50 hover:bg-red-100 border border-red-200/40 text-[#BD1B23] px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer"
                            >
                              Concluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {citas.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-20 text-neutral-400 font-light bg-white text-xs tracking-wide">
                          Sin solicitudes activas en este período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  ); 
}
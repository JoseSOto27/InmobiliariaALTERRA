import React, { useState } from 'react';

export default function AdminForm({ onAddProperty }) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    beds: '',
    baths: '',
    parking: '',
    area: '',
    tag: 'Entrega Inmediata',
    lat: '',
    lng: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.image) {
      alert("Por favor, llena los campos principales y selecciona una imagen.");
      return;
    }

    const newProperty = {
      id: Date.now(),
      title: formData.title,
      location: formData.location || "Ubicación General",
      price: parseFloat(formData.price),
      beds: parseInt(formData.beds) || 0,
      baths: parseFloat(formData.baths) || 0,
      parking: parseInt(formData.parking) || 0,
      area: parseInt(formData.area) || 0,
      tag: formData.tag,
      image: formData.image,
      coordinates: [
        parseFloat(formData.lat) || 23.6345, 
        parseFloat(formData.lng) || -102.5528
      ]
    };

    onAddProperty(newProperty);

    setFormData({
      title: '', location: '', price: '', beds: '', baths: '', parking: '', area: '', tag: 'Entrega Inmediata', lat: '', lng: '', image: null
    });
    alert("¡Propiedad agregada con éxito al catálogo!");
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-neutral-100 my-8 font-sans text-left">
      
      {/* ENCABEZADO MINIMALISTA (Guiado en temp_image_8F1A5E97-9AD0-4A67-9801-73BD1EEF9BAB.WEBP) */}
      <div className="mb-8 border-b border-neutral-100 pb-5">
        <h2 className="text-2xl sm:text-3xl font-light text-[#333333] tracking-tight">
          Publicar <span className="text-[#BD1B23] font-medium">nueva propiedad</span>
        </h2>
        <p className="text-neutral-400 text-sm mt-1 font-light">Llena los datos para dar de alta un inmueble en el catálogo en tiempo real.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 text-sm font-normal text-[#333333]">
        
        {/* Fila 1: Título y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Título de la propiedad *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej: Residencia con Alberca" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Zona / Colonia *</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Lomas Altas" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" required />
          </div>
        </div>

        {/* Fila 2: Precio, Tipo de Etiqueta e Imagen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Precio (MXN) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Ej: 2500000" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Etiqueta de estado</label>
            <div className="relative">
              <select name="tag" value={formData.tag} onChange={handleChange} className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 appearance-none outline-none border border-transparent focus:border-neutral-200 transition-all font-normal cursor-pointer">
                <option>Entrega Inmediata</option>
                <option>Preventa</option>
                <option>Destacada</option>
                <option>Oportunidad</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-neutral-400 text-[10px]">▼</div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Foto del inmueble *</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-neutral-100 file:text-neutral-600 hover:file:bg-neutral-200 cursor-pointer" />
          </div>
        </div>

        {/* Fila 3: Características Técnicas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Habitaciones</label>
            <input type="number" name="beds" value={formData.beds} onChange={handleChange} placeholder="0" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Baños</label>
            <input type="number" step="0.5" name="baths" value={formData.baths} onChange={handleChange} placeholder="0" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Estacionamientos</label>
            <input type="number" name="parking" value={formData.parking} onChange={handleChange} placeholder="0" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">M² de const.</label>
            <input type="number" name="area" value={formData.area} onChange={handleChange} placeholder="0" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" />
          </div>
        </div>

        {/* Fila 4: Coordenadas Geográficas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Latitud (Opcional - mapa)</label>
            <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} placeholder="Ej: 19.4326" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Longitud (Opcional - mapa)</label>
            <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} placeholder="Ej: -99.1332" className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 border border-transparent focus:border-neutral-200 transition-all font-normal" />
          </div>
        </div>

        {/* Previsualización de Imagen Estilizada */}
        {formData.image && (
          <div className="mt-4 pl-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Vista previa:</p>
            <img src={formData.image} alt="Previsualización" className="w-32 h-24 object-cover rounded-2xl border border-neutral-200/60 shadow-sm" />
          </div>
        )}

        {/* BOTÓN DE ACCIÓN REDONDEADO EN ROJO CARMESÍ (#BD1B23) */}
        <button type="submit" className="w-full bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full py-3.5 text-sm transition-colors mt-6 cursor-pointer shadow-sm active:scale-[0.98]">
          Guardar y publicar propiedad
        </button>
      </form>
    </section>
  );
}
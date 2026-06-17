import React, { useState } from 'react';

const LOGO_IMAGE_URL = '/logo.png'; 

export default function LoginForm({ onLogin, onClose }) {
  const EMAIL_PREDETERMINADO = 'adolfo@alterrahaus.com';
  const PASSWORD_PREDETERMINADO = 'adolfo12345';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [imageError, setImageError] = useState(false); 

  // Esta función ahora solo se ejecuta AL ENVIAR el formulario, no mientras escriben
  const sanitizeInput = (value) => {
    if (!value) return '';
    return value
      .replace(/<[^>]*>/g, '') // Elimina etiquetas HTML completas (ej. <script>)
      .replace(/[<>'"&]/g, ''); // Remueve caracteres de escape peligrosos
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');

    // Sanitizamos los valores justo antes de evaluarlos
    const sanitizedEmail = sanitizeInput(email.trim().toLowerCase());
    const sanitizedPassword = password.trim(); 

    // Mensaje de error genérico para mitigar enumeración de usuarios
    if (sanitizedEmail === EMAIL_PREDETERMINADO && sanitizedPassword === PASSWORD_PREDETERMINADO) {
      onLogin(); 
      onClose(); 
    } else {
      setError('Credenciales inválidas. Por favor, verifica tus datos de acceso.');
    }
    
    setLoading(false); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
      <div className="font-sans relative w-full max-w-md bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-neutral-100 animate-fadeIn text-left">
        
        {/* Botón Cerrar */}
        <button onClick={onClose} disabled={loading} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-colors disabled:opacity-50" aria-label="Cerrar">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <div className="mb-3 flex justify-center">
            {LOGO_IMAGE_URL && !imageError ? (
              <img 
                src={LOGO_IMAGE_URL} 
                alt="castroagustin" 
                className="h-10 w-auto object-contain" 
                onError={() => setImageError(true)} 
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#BD1B23] rounded-[5px] flex items-center justify-center relative overflow-hidden">
                  <div className="w-2.5 h-2.5 bg-white rotate-45 mt-2.5"></div>
                </div>
                <span className="font-sans font-medium text-base tracking-tight text-[#333333]">
                  castroagustin<span className="text-neutral-400 font-light">.com.ar</span>
                </span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-[#333333] tracking-tight">Acceso de agentes</h3>
          <p className="text-xs text-neutral-400 font-light mt-0.5">Ingresa al panel de control administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-normal text-[#333333]">
          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Correo electrónico</label>
            <input 
              type="email" 
              value={email} 
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)} // Ahora pueden escribir libremente sin bloqueos
              placeholder="nombreagente@alterrahaus.com" 
              className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 font-normal border border-transparent focus:border-neutral-200 transition-all disabled:opacity-60"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#BD1B23] mb-1.5 pl-2">Contraseña</label>
            <input 
              type="password" 
              value={password} 
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)} // Escritura fluida para caracteres especiales de la contraseña
              placeholder="••••••••" 
              className="w-full bg-[#F5F5F5] text-[#333333] text-sm rounded-full py-2.5 px-4 outline-none placeholder:text-neutral-400 font-normal border border-transparent focus:border-neutral-200 transition-all disabled:opacity-60"
              required 
            />
          </div>

          {error && (
            <p className="text-xs font-light text-[#BD1B23] bg-red-50 p-3 rounded-2xl border border-red-100 text-center leading-relaxed">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#BD1B23] hover:bg-[#a3161c] text-white font-medium rounded-full py-3 text-sm transition-colors mt-6 cursor-pointer active:scale-[0.98] disabled:bg-neutral-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando seguridad...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // 👈 Solo dejamos el CSS limpio de Tailwind
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
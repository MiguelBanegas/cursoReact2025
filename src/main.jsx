import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { registerServiceWorker } from './registerSW'
import { HeadProvider } from 'react-head';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>,
)

// Registra el Service Worker para detectar actualizaciones
registerServiceWorker();
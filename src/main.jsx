import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PropiedadesProvider } from './context/PropiedadesContext'
import { ToastProvider } from './context/ToastContext'
import { ContactModalProvider } from './context/ContactModalContext'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

function renderApp() {
  const root = document.getElementById('root')
  if (!root) return
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <PropiedadesProvider>
                <ToastProvider>
                  <ContactModalProvider>
                    <App />
                  </ContactModalProvider>
                </ToastProvider>
              </PropiedadesProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>,
    )
  } catch (err) {
    console.error('App failed to mount:', err)
    root.innerHTML = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1rem;font-family:system-ui;background:#f9fafb;">
        <div style="max-width:28rem;background:#fff;padding:1.5rem;border-radius:0.5rem;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="font-size:1.25rem;font-weight:600;color:#111;margin-bottom:0.5rem;">Error al cargar</h1>
          <p style="color:#6b7280;font-size:0.875rem;margin-bottom:1rem;">Revisa la consola (F12) o que las variables de entorno estén configuradas en Render (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).</p>
          <pre style="font-size:0.75rem;background:#f3f4f6;padding:0.75rem;border-radius:0.25rem;overflow:auto;color:#374151;">${String(err?.message || err)}</pre>
        </div>
      </div>
    `
  }
}

renderApp()

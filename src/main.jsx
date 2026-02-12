import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PropiedadesProvider } from './context/PropiedadesContext'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PropiedadesProvider>
          <App />
        </PropiedadesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

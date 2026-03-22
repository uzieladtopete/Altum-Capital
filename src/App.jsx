import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import AdminRoute from './components/AdminRoute'
import HomePage from './pages/HomePage'
import NosotrosPage from './pages/NosotrosPage'
import BolsaDeTrabajoPage from './pages/BolsaDeTrabajoPage'
import ResultsPage from './pages/ResultsPage'
import PropiedadDetailPage from './pages/PropiedadDetailPage'
import LoginPage from './pages/LoginPage'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import AdminPropiedadesPage from './pages/admin/AdminPropiedadesPage'
import CrearPropiedadPage from './pages/admin/CrearPropiedadPage'
import EditarPropiedadPage from './pages/admin/EditarPropiedadPage'
import AdminConsultasPage from './pages/admin/AdminConsultasPage'
import ContactPage from './pages/ContactPage'
import AvisoPrivacidadPage from './pages/AvisoPrivacidadPage'
import WhatsAppFloatButton from './components/WhatsAppFloatButton'

function App() {
  return (
    <>
      <WhatsAppFloatButton />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<NosotrosPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/aviso-de-privacidad" element={<AvisoPrivacidadPage />} />
          <Route path="/bolsa-de-trabajo" element={<BolsaDeTrabajoPage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route path="/propiedad/:id" element={<PropiedadDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="propiedades" element={<AdminPropiedadesPage />} />
              <Route path="crear" element={<CrearPropiedadPage />} />
              <Route path="editar/:id" element={<EditarPropiedadPage />} />
              <Route path="consultas" element={<AdminConsultasPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

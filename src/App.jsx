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
import CrearPropiedadPage from './pages/admin/CrearPropiedadPage'
import EditarPropiedadPage from './pages/admin/EditarPropiedadPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/nosotros" element={<NosotrosPage />} />
        <Route path="/bolsa-de-trabajo" element={<BolsaDeTrabajoPage />} />
        <Route path="/resultados" element={<ResultsPage />} />
        <Route path="/propiedad/:id" element={<PropiedadDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="crear" element={<CrearPropiedadPage />} />
            <Route path="editar/:id" element={<EditarPropiedadPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App

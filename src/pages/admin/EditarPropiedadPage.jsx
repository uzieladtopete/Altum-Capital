import { Link } from 'react-router-dom'

export default function EditarPropiedadPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
        Editar propiedad
      </h1>
      <p className="text-gray-600 mb-4">
        Formulario de edición (próximamente).
      </p>
      <Link
        to="/admin"
        className="text-gray-600 hover:text-gray-900 underline"
      >
        Volver al panel
      </Link>
    </div>
  )
}

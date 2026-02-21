import { useNavigate } from 'react-router-dom'
import ImagenPropiedad from '../ImagenPropiedad'

function formatPrice(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const availabilityStyles = {
  Disponible: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'En construcción': 'bg-amber-50 text-amber-800 border-amber-200',
  'En preventa': 'bg-amber-50 text-amber-800 border-amber-200',
  Vendido: 'bg-gray-100 text-gray-700 border-gray-200',
  Finalizado: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function ProjectCard({ project, compact = false }) {
  const navigate = useNavigate()
  
  // Soporta tanto la estructura antigua (mockProjects) como la nueva (propiedades)
  const name = project.name || project.titulo
  const location = project.location || (project.zona ? `${project.ciudad} · ${project.zona}` : project.ciudad)
  const price = project.price || project.precio
  const availability = project.availability || project.estado
  const image = project.image || project.imagen
  const id = project.id

  const handleClick = () => {
    if (id) {
      navigate(`/propiedad/${id}`, { state: { from: '/' } })
    }
  }

  return (
    <article 
      onClick={handleClick}
      className="group bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className={`relative ${compact ? 'aspect-[4/3]' : 'aspect-[3/2]'}`}>
        <ImagenPropiedad
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
        <span
          className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded border ${availabilityStyles[availability] ?? availabilityStyles.Finalizado}`}
        >
          {availability}
        </span>
      </div>
      <div className="p-4">
        <h3 className={`font-serif font-semibold text-accent ${compact ? 'text-lg' : 'text-xl'}`}>
          {name}
        </h3>
        <p className="mt-1 text-gray-600 text-sm">{location}</p>
        <p className="mt-2 font-medium text-accent">{formatPrice(price)}</p>
      </div>
    </article>
  )
}

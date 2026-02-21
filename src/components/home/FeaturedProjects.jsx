import { Link } from 'react-router-dom'
import { usePropiedades } from '../../context/PropiedadesContext'
import ProjectCard from '../results/ProjectCard'

export default function FeaturedProjects() {
  const { list } = usePropiedades()
  // Mostrar las primeras 6 propiedades
  const recent = list.slice(0, 6)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-accent mb-2">
          Proyectos recientes
        </h2>
        <p className="text-gray-600 max-w-2xl mb-12">
          Una selección de nuestros trabajos más recientes en arquitectura residencial y comercial.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recent.map((propiedad) => (
            <ProjectCard key={propiedad.id} project={propiedad} compact />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/resultados"
            className="inline-flex items-center px-6 py-3 border border-accent text-accent font-medium rounded-lg hover:bg-accent hover:text-white transition-colors"
          >
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  )
}

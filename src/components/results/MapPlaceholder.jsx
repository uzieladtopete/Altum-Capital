export default function MapPlaceholder() {
  return (
    <div className="w-full h-full min-h-[280px] bg-gray-100 flex items-center justify-center border border-gray-200 rounded-lg overflow-hidden">
      <div className="text-center p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-500 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">Mapa interactivo</p>
        <p className="text-gray-500 text-sm mt-1">(placeholder)</p>
      </div>
    </div>
  )
}

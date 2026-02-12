import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import ImagenPropiedad from './ImagenPropiedad'

const CENTER_GDJ = [20.6597, -103.3496]
const DEFAULT_ZOOM = 12

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Tiles claros y minimalistas (CartoDB Positron)
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Marcador minimalista: círculo oscuro
const markerIcon = new L.DivIcon({
  className: 'map-marker-custom',
  html: '<span class="map-marker-dot"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function hasValidCoords(prop) {
  const lat = Number(prop.lat)
  const lng = Number(prop.lng)
  return !Number.isNaN(lat) && !Number.isNaN(lng)
}

function FitBounds({ propiedadesConCoords }) {
  const map = useMap()
  useEffect(() => {
    if (propiedadesConCoords.length === 0) {
      map.setView(CENTER_GDJ, DEFAULT_ZOOM)
      return
    }
    if (propiedadesConCoords.length === 1) {
      map.setView([propiedadesConCoords[0].lat, propiedadesConCoords[0].lng], 15)
      return
    }
    const bounds = L.latLngBounds(propiedadesConCoords.map((p) => [p.lat, p.lng]))
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 })
    }
  }, [map, propiedadesConCoords])
  return null
}

function FlyToSelected({ selectedId, propiedadesConCoords, markerRefs }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedId || !propiedadesConCoords.length) return
    const prop = propiedadesConCoords.find((p) => p.id === selectedId)
    if (!prop) return
    map.flyTo([prop.lat, prop.lng], 15, { duration: 0.5 })
    const marker = markerRefs.current?.[selectedId]
    if (marker && typeof marker.openPopup === 'function') {
      setTimeout(() => marker.openPopup(), 600)
    }
  }, [map, selectedId, propiedadesConCoords, markerRefs])
  return null
}

export default function Mapa({ propiedades = [], selectedId = null }) {
  const markerRefs = useRef({})
  const propiedadesConCoords = propiedades.filter(hasValidCoords)
  const isEmpty = propiedades.length === 0

  return (
    <div className="mapa-wrapper w-full h-full min-h-[300px] lg:min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
      {isEmpty ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/95 z-10 backdrop-blur-[2px]">
          <p className="text-gray-500 font-serif text-lg text-center px-8 max-w-sm">
            No se encontraron propiedades con estos filtros.
          </p>
        </div>
      ) : null}
      <MapContainer
        center={CENTER_GDJ}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full min-h-[300px] lg:min-h-[500px] mapa-container"
        style={{ opacity: isEmpty ? 0.35 : 1 }}
        scrollWheelZoom
      >
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
        <FitBounds propiedadesConCoords={propiedadesConCoords} />
        {selectedId && propiedadesConCoords.length > 0 && (
          <FlyToSelected
            selectedId={selectedId}
            propiedadesConCoords={propiedadesConCoords}
            markerRefs={markerRefs}
          />
        )}
        {propiedadesConCoords.map((prop) => (
          <Marker
            key={prop.id}
            position={[prop.lat, prop.lng]}
            icon={markerIcon}
            ref={(ref) => {
              if (ref?.instance) markerRefs.current[prop.id] = ref.instance
            }}
          >
            <Popup className="mapa-popup" minWidth={240} maxWidth={280}>
              <div className="mapa-popup-content">
                <ImagenPropiedad
                  src={prop.imagen}
                  alt={prop.titulo}
                  className="mapa-popup-img"
                />
                <h3 className="mapa-popup-title">{prop.titulo}</h3>
                <p className="mapa-popup-precio">{formatPrecio(prop.precio)}</p>
                <p className="mapa-popup-m2">{prop.m2} m²</p>
                <span className="mapa-popup-estado">{prop.estado}</span>
                <a href="#" className="mapa-popup-btn">
                  Ver propiedad
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'

const CENTER_GDJ = [20.6597, -103.3496]
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; OpenStreetMap &copy; CARTO'

const markerIcon = new L.DivIcon({
  className: 'map-marker-custom',
  html: '<span class="map-marker-dot"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

function MapUpdater({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.setView([center.lat, center.lng], zoom ?? 15)
  }, [map, center?.lat, center?.lng, zoom])
  return null
}

export default function MapaPreview({ center = null, markerPosition = null, className = '' }) {
  const viewCenter = center ? [center.lat, center.lng] : CENTER_GDJ
  const zoom = 15

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      <MapContainer
        center={viewCenter}
        zoom={zoom}
        className="w-full h-full"
        style={{ height: 220 }}
        scrollWheelZoom={false}
      >
        <TileLayer attribution={TILE_ATTRIBUTION} url={TILE_URL} />
        <MapUpdater center={center} zoom={zoom} />
        {markerPosition && (
          <Marker
            position={[markerPosition.lat, markerPosition.lng]}
            icon={markerIcon}
          />
        )}
      </MapContainer>
    </div>
  )
}

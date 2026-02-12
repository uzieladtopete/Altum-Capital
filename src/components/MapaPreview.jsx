import { useEffect, useRef, useMemo } from 'react'
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
  const lastCenterRef = useRef(null)
  const userInteractedRef = useRef(false)

  useEffect(() => {
    const onInteraction = () => { userInteractedRef.current = true }
    map.on('zoomstart', onInteraction)
    map.on('movestart', onInteraction)
    return () => {
      map.off('zoomstart', onInteraction)
      map.off('movestart', onInteraction)
    }
  }, [map])

  useEffect(() => {
    if (!center) return
    const key = `${center.lat}-${center.lng}`
    if (lastCenterRef.current === key && userInteractedRef.current) return
    lastCenterRef.current = key
    userInteractedRef.current = false
    map.setView([center.lat, center.lng], zoom ?? 15)
  }, [map, center?.lat, center?.lng, zoom])
  return null
}

export default function MapaPreview({ center = null, markerPosition = null, onMarkerMove = null, className = '' }) {
  const viewCenter = center ? [center.lat, center.lng] : CENTER_GDJ
  const zoom = 15
  const isDraggable = Boolean(onMarkerMove)

  const markerPos = useMemo(() => {
    if (!markerPosition) return null
    return [markerPosition.lat, markerPosition.lng]
  }, [markerPosition?.lat, markerPosition?.lng])

  const markerKey = markerPos ? `${markerPos[0]}-${markerPos[1]}` : 'none'

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
        {markerPos && (
          <Marker
            key={markerKey}
            position={markerPos}
            icon={markerIcon}
            draggable={isDraggable}
            eventHandlers={
              isDraggable
                ? {
                    dragend: (e) => {
                      const latlng = e.target.getLatLng()
                      onMarkerMove(latlng.lat, latlng.lng)
                    },
                  }
                : undefined
            }
          />
        )}
      </MapContainer>
    </div>
  )
}

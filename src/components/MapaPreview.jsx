import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = [20.6597, -103.3496] // [lat, lng] para Leaflet
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

// Icono por defecto de Leaflet (evita que se rompa el marcador)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function SetViewWhenCenterChanges({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center && center.lat != null && center.lng != null) {
      map.setView([center.lat, center.lng], map.getZoom())
    }
  }, [center?.lat, center?.lng, map])
  return null
}

function MapClickHandler({ canInteract, onMapClick, onMarkerMove }) {
  useMapEvents({
    click(e) {
      if (!canInteract) return
      const { lat, lng } = e.latlng
      onMarkerMove?.(lat, lng)
      onMapClick?.(lat, lng)
    },
  })
  return null
}

export default function MapaPreview({ center = null, markerPosition = null, onMarkerMove = null, onMarkerMoveEnd = null, onMapClick = null, interactive = false, className = '' }) {
  const canInteract = !!(onMarkerMove || onMarkerMoveEnd || onMapClick) || interactive
  const [markerPos, setMarkerPos] = useState(() => {
    if (markerPosition != null && typeof markerPosition.lat === 'number' && typeof markerPosition.lng === 'number') {
      return [markerPosition.lat, markerPosition.lng]
    }
    return null
  })

  const centerLat = center?.lat ?? DEFAULT_CENTER[0]
  const centerLng = center?.lng ?? DEFAULT_CENTER[1]
  const initialCenter = [centerLat, centerLng]

  useEffect(() => {
    if (markerPosition != null && typeof markerPosition.lat === 'number' && typeof markerPosition.lng === 'number') {
      setMarkerPos([markerPosition.lat, markerPosition.lng])
    } else {
      setMarkerPos(null)
    }
  }, [markerPosition?.lat, markerPosition?.lng])

  const displayPos = markerPos ?? (markerPosition != null && typeof markerPosition?.lat === 'number' ? [markerPosition.lat, markerPosition.lng] : null)

  const handleMarkerDragEnd = useCallback(
    (e) => {
      const { lat, lng } = e.target.getLatLng()
      setMarkerPos([lat, lng])
      onMarkerMove?.(lat, lng)
      onMarkerMoveEnd?.(lat, lng)
    },
    [onMarkerMove, onMarkerMoveEnd]
  )

  const markerIcon = L.divIcon({
    className: 'custom-marker-preview',
    html: `<div style="
      width: 40px; height: 40px;
      background: #111; border: 2px solid white; border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex; align-items: center; justify-content: center;
    "><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })

  return (
    <div className={`rounded-lg overflow-hidden border border-gray-200 ${className}`} style={{ height: '100%' }}>
      <MapContainer
        center={initialCenter}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
        <SetViewWhenCenterChanges center={center} />
        {canInteract && <MapClickHandler canInteract={canInteract} onMapClick={onMapClick} onMarkerMove={onMarkerMove} />}
        {displayPos && (
          <Marker
            position={displayPos}
            icon={markerIcon}
            draggable={!!(onMarkerMove || onMarkerMoveEnd)}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          >
            {!canInteract && <Popup>Ubicación</Popup>}
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

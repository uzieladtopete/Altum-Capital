import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { BedDouble, Bath, Car } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import ImagenPropiedad from './ImagenPropiedad'

const CENTER_GDJ = [20.6597, -103.3496]
const DEFAULT_ZOOM = 12
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function hasValidCoords(prop) {
  const lat = Number(prop.lat)
  const lng = Number(prop.lng)
  return !Number.isNaN(lat) && !Number.isNaN(lng)
}

const MEXICO_BOUNDS = {
  minLat: 14.5,
  maxLat: 32.7,
  minLng: -118.4,
  maxLng: -86.8,
}

function isInMexico(prop) {
  const lat = Number(prop.lat)
  const lng = Number(prop.lng)
  return (
    lat >= MEXICO_BOUNDS.minLat &&
    lat <= MEXICO_BOUNDS.maxLat &&
    lng >= MEXICO_BOUNDS.minLng &&
    lng <= MEXICO_BOUNDS.maxLng
  )
}

function safeCount(value) {
  const n = value == null || value === '' ? NaN : Number(value)
  return Number.isNaN(n) ? null : n
}

function MapViewUpdater({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, zoom ?? map.getZoom())
    }
  }, [center, zoom, map])
  return null
}

export default function Mapa({ propiedades = [], selectedId = null, onSelect = null }) {
  const [viewCenter, setViewCenter] = useState(CENTER_GDJ)
  const [viewZoom, setViewZoom] = useState(DEFAULT_ZOOM)
  const [popupInfo, setPopupInfo] = useState(null)
  const markerRefs = useRef({})

  const propiedadesArray = Array.isArray(propiedades) ? propiedades : []
  const propiedadesConCoords = propiedadesArray.filter(hasValidCoords)
  const propiedadesValidas = propiedadesConCoords.filter(isInMexico)
  const isEmpty = propiedadesArray.length === 0

  useEffect(() => {
    if (propiedadesValidas.length === 0) {
      setViewCenter(CENTER_GDJ)
      setViewZoom(DEFAULT_ZOOM)
      return
    }
    if (propiedadesValidas.length === 1) {
      setViewCenter([Number(propiedadesValidas[0].lat), Number(propiedadesValidas[0].lng)])
      setViewZoom(13)
      return
    }
    const bounds = propiedadesValidas.reduce(
      (acc, prop) => {
        const lat = Number(prop.lat)
        const lng = Number(prop.lng)
        if (!acc.minLat || lat < acc.minLat) acc.minLat = lat
        if (!acc.maxLat || lat > acc.maxLat) acc.maxLat = lat
        if (!acc.minLng || lng < acc.minLng) acc.minLng = lng
        if (!acc.maxLng || lng > acc.maxLng) acc.maxLng = lng
        return acc
      },
      { minLat: null, maxLat: null, minLng: null, maxLng: null }
    )
    if (bounds.minLat != null) {
      const centerLat = (bounds.minLat + bounds.maxLat) / 2
      const centerLng = (bounds.minLng + bounds.maxLng) / 2
      const latDiff = bounds.maxLat - bounds.minLat
      const lngDiff = bounds.maxLng - bounds.minLng
      const maxDiff = Math.max(latDiff, lngDiff)
      let zoom = 12
      if (maxDiff < 0.01) zoom = 14
      else if (maxDiff < 0.05) zoom = 13
      else if (maxDiff < 0.1) zoom = 12
      else zoom = 11
      setViewCenter([centerLat, centerLng])
      setViewZoom(zoom)
    }
  }, [propiedadesValidas.length])

  // Clave estable para no re-ejecutar en cada render (propiedadesValidas es nuevo cada vez y traba el mapa)
  const propIdsKey = propiedadesValidas.map((p) => p.id).sort().join(',')
  useEffect(() => {
    if (!selectedId || !propiedadesValidas.length) {
      setPopupInfo(null)
      return
    }
    const prop = propiedadesValidas.find((p) => p.id === selectedId)
    if (prop) {
      setViewCenter([Number(prop.lat), Number(prop.lng)])
      setViewZoom(14)
      setPopupInfo(prop)
      setTimeout(() => {
        const marker = markerRefs.current[prop.id]
        if (marker) marker.openPopup()
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- propIdsKey evita re-runs por referencia de array
  }, [selectedId, propIdsKey])

  const handleMarkerClick = useCallback(
    (prop) => {
      setPopupInfo(prop)
      onSelect?.(prop.id)
    },
    [onSelect]
  )

  const markerIcon = (selected) =>
    L.divIcon({
      className: 'custom-marker-mapa',
      html: `<div style="
        width: 24px; height: 24px; background: #111; border: 2px solid white;
        border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transform: scale(${selected ? 1.1 : 1});
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    })

  return (
    <div className="mapa-wrapper w-full h-full min-h-[300px] lg:min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
      {isEmpty ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50/95 z-[1000] backdrop-blur-[2px]">
          <p className="text-gray-500 font-serif text-lg text-center px-8 max-w-sm">
            No se encontraron propiedades con estos filtros.
          </p>
        </div>
      ) : null}
      <MapContainer
        center={viewCenter}
        zoom={viewZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
        <MapViewUpdater center={viewCenter} zoom={viewZoom} />
        {propiedadesValidas.map((prop) => (
          <Marker
            key={prop.id}
            ref={(el) => {
              if (el) markerRefs.current[prop.id] = el
            }}
            position={[Number(prop.lat), Number(prop.lng)]}
            icon={markerIcon(popupInfo?.id === prop.id)}
            eventHandlers={{
              click: () => handleMarkerClick(prop),
            }}
          >
            <Popup
              className="mapa-popup-circular"
              onClose={() => {
                setPopupInfo(null)
                onSelect?.(null)
              }}
              closeButton={true}
            >
              <div className="mapa-popup-content w-[260px]" onClick={(e) => e.stopPropagation()}>
                <div className="relative mapa-popup-image-wrap">
                  {prop.tipo ? (
                    <span className="mapa-popup-operacion absolute left-2 top-2 z-[1] max-w-[calc(100%-1rem)] rounded bg-black/75 px-2 py-1 text-xs font-semibold leading-tight text-white shadow-sm">
                      {prop.tipo}
                    </span>
                  ) : null}
                  <ImagenPropiedad
                    src={prop.imagen}
                    alt={prop.titulo}
                    className="mapa-popup-img w-full object-cover"
                  />
                </div>
                <div className="mapa-popup-body">
                  <h3 className="mapa-popup-title font-serif font-semibold text-gray-900 leading-tight line-clamp-2">
                    {prop.titulo}
                  </h3>
                  <p className="mapa-popup-precio font-bold text-gray-900">
                    {formatPrecio(prop.precio)}
                  </p>
                  <div className="mapa-popup-stats-row flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <div className="mapa-popup-stats flex flex-wrap items-center gap-x-2 gap-y-0.5 text-gray-600">
                      {(() => {
                        const r = safeCount(prop.recamaras)
                        const b = safeCount(prop.banos)
                        const e = safeCount(prop.estacionamientos)
                        const parts = []
                        if (r != null) {
                          parts.push(
                            <span key="r" className="inline-flex items-center gap-0.5 text-xs">
                              <BedDouble className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                              {r}
                            </span>
                          )
                        }
                        if (b != null) {
                          parts.push(
                            <span key="b" className="inline-flex items-center gap-0.5 text-xs">
                              <Bath className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                              {b}
                            </span>
                          )
                        }
                        if (e != null) {
                          parts.push(
                            <span key="e" className="inline-flex items-center gap-0.5 text-xs">
                              <Car className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                              {e}
                            </span>
                          )
                        }
                        return parts.length ? parts : <span className="text-xs text-gray-400">—</span>
                      })()}
                    </div>
                    <p className="mapa-popup-m2 shrink-0 text-xs font-medium text-gray-700">{prop.m2} m²</p>
                  </div>
                  {prop.estado ? (
                    <span className="mapa-popup-estado inline-block text-xs font-medium">
                      {prop.estado}
                    </span>
                  ) : null}
                  <Link to={`/propiedad/${prop.id}`} className="mapa-popup-btn">
                    Ver propiedad
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

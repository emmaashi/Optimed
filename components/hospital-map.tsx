"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, Phone, X, AlertCircle } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"

interface HospitalMapProps {
  selectedHospital: string | null
  onHospitalSelect: (hospital: string) => void
}

const hospitals = [
  {
    id: "toronto-general",
    name: "Toronto General Hospital",
    address: "200 Elizabeth St, Toronto",
    waitTime: "45 min",
    status: "moderate",
    distance: "2.3 km",
    phone: "(416) 340-4800",
    coordinates: [-79.3857, 43.6596], // [longitude, latitude]
  },
  {
    id: "mount-sinai",
    name: "Mount Sinai Hospital",
    address: "600 University Ave, Toronto",
    waitTime: "1h 20min",
    status: "busy",
    distance: "1.8 km",
    phone: "(416) 596-4200",
    coordinates: [-79.3889, 43.6563],
  },
  {
    id: "st-michaels",
    name: "St. Michael's Hospital",
    address: "30 Bond St, Toronto",
    waitTime: "25 min",
    status: "low",
    distance: "3.1 km",
    phone: "(416) 360-4000",
    coordinates: [-79.3759, 43.653],
  },
  {
    id: "sunnybrook",
    name: "Sunnybrook Health Sciences Centre",
    address: "2075 Bayview Ave, Toronto",
    waitTime: "35 min",
    status: "moderate",
    distance: "8.5 km",
    phone: "(416) 480-6100",
    coordinates: [-79.3832, 43.7243],
  },
  {
    id: "toronto-western",
    name: "Toronto Western Hospital",
    address: "399 Bathurst St, Toronto",
    waitTime: "55 min",
    status: "busy",
    distance: "3.8 km",
    phone: "(416) 603-5800",
    coordinates: [-79.4112, 43.6558],
  },
]

export function HospitalMap({ selectedHospital, onHospitalSelect }: HospitalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [selectedHospitalData, setSelectedHospitalData] = useState<(typeof hospitals)[0] | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Get Mapbox access token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "#10b981" // emerald-500
      case "moderate":
        return "#eab308" // yellow-500
      case "busy":
        return "#ef4444" // red-500
      default:
        return "#6b7280" // gray-500
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-100"
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-100"
      case "busy":
        return "bg-red-50 text-red-700 border-red-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-100"
    }
  }

  const createMarkerElement = (hospital: (typeof hospitals)[0]) => {
    const el = document.createElement("div")
    el.className = "hospital-marker"
    el.style.cssText = `
      width: 24px;
      height: 24px;
      background-color: ${getStatusColor(hospital.status)};
      border: 3px solid white;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
      position: relative;
      z-index: 1;
    `

    // Add pulsing animation for better visibility
    const pulse = document.createElement("div")
    pulse.style.cssText = `
      position: absolute;
      top: -6px;
      left: -6px;
      width: 36px;
      height: 36px;
      background-color: ${getStatusColor(hospital.status)};
      border-radius: 50%;
      opacity: 0.3;
      animation: pulse 2s infinite;
      z-index: 0;
    `
    el.appendChild(pulse)

    // Add hospital icon
    const icon = document.createElement("div")
    icon.innerHTML = "+"
    icon.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: bold;
      font-size: 12px;
      z-index: 2;
    `
    el.appendChild(icon)

    el.addEventListener("mouseenter", () => {
      el.style.transform = "scale(1.2)"
      el.style.zIndex = "1000"
    })

    el.addEventListener("mouseleave", () => {
      el.style.transform = "scale(1)"
      el.style.zIndex = "1"
    })

    el.addEventListener("click", () => {
      onHospitalSelect(hospital.id)
      setSelectedHospitalData(hospital)
    })

    return el
  }

  useEffect(() => {
    // Check if Mapbox token is available
    if (!mapboxToken) {
      setMapError(
        "Mapbox access token is not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment variables.",
      )
      return
    }

    if (!mapContainer.current) return

    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-79.3832, 43.6532], // Toronto coordinates
        zoom: 11,
        attributionControl: false,
      })

      // Add attribution control
      map.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        }),
      )

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "top-right",
      )

      // Handle map load
      map.current.on("load", () => {
        setIsMapLoaded(true)
        setMapError(null)

        // Add hospital markers after map loads
        hospitals.forEach((hospital) => {
          const marker = new mapboxgl.Marker({
            element: createMarkerElement(hospital),
          })
            .setLngLat(hospital.coordinates as [number, number])
            .addTo(map.current!)

          markers.current.push(marker)
        })

        // Fit map to show all hospitals
        const bounds = new mapboxgl.LngLatBounds()
        hospitals.forEach((hospital) => {
          bounds.extend(hospital.coordinates as [number, number])
        })

        map.current!.fitBounds(bounds, {
          padding: 50,
          maxZoom: 13,
        })
      })

      // Handle map errors
      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapError("Failed to load map. Please check your internet connection and try again.")
      })
    } catch (error) {
      console.error("Error initializing map:", error)
      setMapError("Failed to initialize map. Please refresh the page and try again.")
    }

    // Cleanup function
    return () => {
      markers.current.forEach((marker) => marker.remove())
      markers.current = []
      map.current?.remove()
      map.current = null
    }
  }, [mapboxToken])

  // Handle external hospital selection
  useEffect(() => {
    if (selectedHospital && map.current && isMapLoaded) {
      const hospital = hospitals.find((h) => h.id === selectedHospital)
      if (hospital) {
        map.current.flyTo({
          center: hospital.coordinates as [number, number],
          zoom: 15,
          duration: 1000,
        })
        setSelectedHospitalData(hospital)
      }
    }
  }, [selectedHospital, isMapLoaded])

  const handleDirections = (hospital: (typeof hospitals)[0]) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates[1]},${hospital.coordinates[0]}`
    window.open(url, "_blank")
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const FallbackMap = () => (
    <div className="relative h-full bg-slate-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Street lines */}
            <line x1="0" y1="30" x2="100" y2="30" stroke="#64748b" strokeWidth="0.5" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="#64748b" strokeWidth="0.5" />
            <line x1="30" y1="0" x2="30" y2="100" stroke="#64748b" strokeWidth="0.5" />
            <line x1="70" y1="0" x2="70" y2="100" stroke="#64748b" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Hospital Markers */}
      {hospitals.map((hospital, index) => (
        <div
          key={hospital.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${30 + index * 15}%`,
            top: `${35 + (index % 2) * 20}%`,
          }}
          onClick={() => {
            onHospitalSelect(hospital.id)
            setSelectedHospitalData(hospital)
          }}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse`}
            style={{ backgroundColor: getStatusColor(hospital.status) }}
          />
        </div>
      ))}

      {/* User Location */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-ping" />
      </div>
    </div>
  )

  return (
    <div className="relative h-full">
      <Card className="border-none shadow-sm h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="w-5 h-5 text-emerald-500" />
            Nearby Healthcare Facilities
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          {mapError ? (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
              <p className="text-sm text-slate-600 text-center mb-4 max-w-md">{mapError}</p>
              <div className="text-xs text-slate-500 mb-4">Using fallback map view</div>
              <FallbackMap />
            </div>
          ) : (
            <>
              <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-slate-600">Loading map...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Hospital Info Popup */}
      {selectedHospitalData && (
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-slate-100 min-w-[280px] z-10">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-slate-900">{selectedHospitalData.name}</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-slate-100"
              onClick={() => {
                setSelectedHospitalData(null)
                onHospitalSelect("")
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mb-3">{selectedHospitalData.address}</p>

          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600">Wait time: {selectedHospitalData.waitTime}</span>
            <Badge className={`text-xs ${getStatusBadge(selectedHospitalData.status)}`}>
              {selectedHospitalData.status}
            </Badge>
          </div>

          <div className="text-xs text-slate-500 mb-3">Distance: {selectedHospitalData.distance}</div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="text-xs h-7 flex-1 bg-emerald-500 hover:bg-emerald-600"
              onClick={() => handleDirections(selectedHospitalData)}
            >
              <Navigation className="w-3 h-3 mr-1" />
              Directions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 flex-1"
              onClick={() => handleCall(selectedHospitalData.phone)}
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
          </div>
        </div>
      )}

      {/* Add CSS for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

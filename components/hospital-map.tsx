"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, Phone } from "lucide-react"

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
    coordinates: { x: 45, y: 35 },
  },
  {
    id: "mount-sinai",
    name: "Mount Sinai Hospital",
    address: "600 University Ave, Toronto",
    waitTime: "1h 20min",
    status: "busy",
    distance: "1.8 km",
    phone: "(416) 596-4200",
    coordinates: { x: 55, y: 45 },
  },
  {
    id: "st-michaels",
    name: "St. Michael's Hospital",
    address: "30 Bond St, Toronto",
    waitTime: "25 min",
    status: "low",
    distance: "3.1 km",
    phone: "(416) 360-4000",
    coordinates: { x: 35, y: 55 },
  },
]

export function HospitalMap({ selectedHospital, onHospitalSelect }: HospitalMapProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-emerald-500"
      case "moderate":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "low":
        return "bg-emerald-100 text-emerald-700"
      case "moderate":
        return "bg-yellow-100 text-yellow-700"
      case "busy":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Nearby Healthcare Facilities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-full bg-slate-100 rounded-lg overflow-hidden">
          {/* Simplified Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300">
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
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${hospital.coordinates.x}%`,
                top: `${hospital.coordinates.y}%`,
              }}
              onClick={() => onHospitalSelect(hospital.id)}
            >
              <div
                className={`w-4 h-4 rounded-full ${getStatusColor(hospital.status)} border-2 border-white shadow-lg animate-pulse`}
              />
              {selectedHospital === hospital.id && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-lg shadow-lg border min-w-[200px] z-10">
                  <h4 className="font-semibold text-sm">{hospital.name}</h4>
                  <p className="text-xs text-slate-600 mb-2">{hospital.address}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{hospital.waitTime}</span>
                    <Badge className={`text-xs ${getStatusBadge(hospital.status)}`}>{hospital.status}</Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" className="text-xs h-6">
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs h-6">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* User Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full opacity-20 animate-ping" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

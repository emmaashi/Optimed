"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Users, Search } from "lucide-react"

interface Hospital {
  id: string
  name: string
  address: string
  waitTime: number
  status: "low" | "moderate" | "busy"
  distance: number
  currentQueue: number
  specialties: string[]
  phone: string
  coordinates: [number, number]
}

interface WaitTimesListProps {
  onJoinQueue: (hospital: Hospital) => void
  activeQueueId?: string
}

const hospitals: Hospital[] = [
  {
    id: "toronto-general",
    name: "Toronto General Hospital",
    address: "200 Elizabeth St, Toronto",
    waitTime: 45,
    status: "moderate",
    distance: 2.3,
    currentQueue: 12,
    specialties: ["Emergency", "Cardiology", "Surgery"],
    phone: "(416) 340-4800",
    coordinates: [-79.3857, 43.6596],
  },
  {
    id: "st-michaels",
    name: "St. Michael's Hospital",
    address: "30 Bond St, Toronto",
    waitTime: 25,
    status: "low",
    distance: 3.1,
    currentQueue: 6,
    specialties: ["Emergency", "Trauma", "Neurology"],
    phone: "(416) 360-4000",
    coordinates: [-79.3759, 43.653],
  },
  {
    id: "mount-sinai",
    name: "Mount Sinai Hospital",
    address: "600 University Ave, Toronto",
    waitTime: 80,
    status: "busy",
    distance: 1.8,
    currentQueue: 18,
    specialties: ["Emergency", "Maternity", "Oncology"],
    phone: "(416) 596-4200",
    coordinates: [-79.3889, 43.6563],
  },
  {
    id: "sunnybrook",
    name: "Sunnybrook Health Sciences Centre",
    address: "2075 Bayview Ave, Toronto",
    waitTime: 35,
    status: "moderate",
    distance: 8.2,
    currentQueue: 9,
    specialties: ["Emergency", "Trauma", "Veterans Care"],
    phone: "(416) 480-6100",
    coordinates: [-79.3832, 43.7243],
  },
  {
    id: "toronto-western",
    name: "Toronto Western Hospital",
    address: "399 Bathurst St, Toronto",
    waitTime: 55,
    status: "busy",
    distance: 3.8,
    currentQueue: 14,
    specialties: ["Emergency", "Neurosurgery", "Orthopedics"],
    phone: "(416) 603-5800",
    coordinates: [-79.4112, 43.6558],
  },
]

export function WaitTimesList({ onJoinQueue, activeQueueId }: WaitTimesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"distance" | "waitTime">("waitTime")
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals)

  useEffect(() => {
    const filtered = hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    filtered.sort((a, b) => {
      if (sortBy === "distance") return a.distance - b.distance
      return a.waitTime - b.waitTime
    })

    setFilteredHospitals(filtered)
  }, [searchTerm, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "moderate":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "busy":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search hospitals or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === "waitTime" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("waitTime")}
              >
                <Clock className="w-4 h-4 mr-2" />
                Wait Time
              </Button>
              <Button
                variant={sortBy === "distance" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("distance")}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Distance
              </Button>
            </div>
          </div>

      {/* Hospital List */}
      <div className="space-y-3">
        {filteredHospitals.map((hospital) => (
          <Card key={hospital.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{hospital.name}</h3>
                      <div className="flex items-center gap-2 text-slate-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hospital.address}</span>
                        <span className="text-sm">• {hospital.distance} km</span>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="font-semibold text-emerald-600 text-lg">
                            {formatWaitTime(hospital.waitTime)}
                          </span>
                          <Badge className={getStatusColor(hospital.status)}>{hospital.status}</Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{hospital.currentQueue} in queue</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {hospital.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <Button
                        onClick={() => onJoinQueue(hospital)}
                        disabled={activeQueueId !== undefined}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        {activeQueueId ? "In Queue" : "Join Queue"}
                      </Button>
                      <Button variant="outline" size="sm">
                        Call Hospital
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

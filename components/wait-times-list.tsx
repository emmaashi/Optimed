"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, Search } from "lucide-react"

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



  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Hospital Wait Times</h2>
        <p className="text-sm text-gray-500 mt-1">Find the best option for your visit</p>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search hospitals or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-gray-200 rounded-xl bg-gray-50 border-0"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "waitTime" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("waitTime")}
              className={sortBy === "waitTime" ? "bg-emerald-500 hover:bg-emerald-600" : "border-gray-200 hover:bg-gray-50"}
            >
              <Clock className="w-4 h-4 mr-2" />
              Wait Time
            </Button>
            <Button
              variant={sortBy === "distance" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("distance")}
              className={sortBy === "distance" ? "bg-emerald-500 hover:bg-emerald-600" : "border-gray-200 hover:bg-gray-50"}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Distance
            </Button>
          </div>
        </div>

        {/* Hospital List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredHospitals.map((hospital) => (
            <div key={hospital.id} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-4 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-lg transition-all duration-200">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-gray-50/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base truncate">{hospital.name}</h3>
                      <div className="flex items-center gap-1.5 text-gray-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-sm truncate">{hospital.address}</span>
                        <span className="text-sm">• {hospital.distance} km</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="text-right">
                        <div className="font-bold text-emerald-600 text-lg leading-none">
                          {formatWaitTime(hospital.waitTime)}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{hospital.currentQueue} in queue</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        hospital.status === 'low' ? 'bg-emerald-400' :
                        hospital.status === 'moderate' ? 'bg-amber-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {hospital.specialties.slice(0, 3).map((specialty) => (
                        <span key={specialty} className="text-xs text-gray-600 bg-gray-100/80 px-2 py-0.5 rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <span className="text-xs text-gray-500">+{hospital.specialties.length - 3}</span>
                      )}
                    </div>

                    <div className="flex gap-2 ml-3">
                      <Button
                        onClick={() => onJoinQueue(hospital)}
                        disabled={activeQueueId !== undefined}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-3 py-1.5 h-auto rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        {activeQueueId ? "In Queue" : "Join Queue"}
                      </Button>
                      <Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-xs px-3 py-1.5 h-auto rounded-full">
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

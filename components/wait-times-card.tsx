import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Phone, Calendar } from "lucide-react"

interface WaitTimesCardProps {
  selectedHospital: string | null
}

const waitTimes = [
  {
    id: "toronto-general",
    name: "Toronto General Hospital",
    waitTime: "45 min",
    status: "moderate",
    distance: "2.3 km",
    updated: "2 min ago",
  },
  {
    id: "st-michaels",
    name: "St. Michael's Hospital",
    waitTime: "25 min",
    status: "low",
    distance: "3.1 km",
    updated: "5 min ago",
  },
  {
    id: "mount-sinai",
    name: "Mount Sinai Hospital",
    waitTime: "1h 20min",
    status: "busy",
    distance: "1.8 km",
    updated: "1 min ago",
  },
  {
    id: "sunnybrook",
    name: "Sunnybrook Hospital",
    waitTime: "35 min",
    status: "moderate",
    distance: "8.2 km",
    updated: "3 min ago",
  },
]

export function WaitTimesCard({ selectedHospital }: WaitTimesCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "busy":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-emerald-600" />
          Live Wait Times
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {waitTimes.map((hospital) => (
          <div
            key={hospital.id}
            className={`p-3 rounded-lg border transition-all ${
              selectedHospital === hospital.id
                ? "bg-emerald-50 border-emerald-200"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm text-slate-900">{hospital.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-xs text-slate-600">{hospital.distance}</span>
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(hospital.status)}`}>{hospital.status}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-emerald-600">{hospital.waitTime}</span>
              </div>
              <span className="text-xs text-slate-500">Updated {hospital.updated}</span>
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Book
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

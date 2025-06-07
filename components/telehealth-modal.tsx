"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Phone, Video, Clock, User } from "lucide-react"

interface TelehealthModalProps {
  onClose: () => void
}

const availableDoctors = [
  {
    id: "dr-smith",
    name: "Dr. Sarah Smith",
    specialty: "Family Medicine",
    rating: 4.8,
    nextAvailable: "15 min",
    status: "available",
  },
  {
    id: "dr-johnson",
    name: "Dr. Michael Johnson",
    specialty: "Internal Medicine",
    rating: 4.9,
    nextAvailable: "30 min",
    status: "available",
  },
  {
    id: "dr-brown",
    name: "Dr. Emily Brown",
    specialty: "Urgent Care",
    rating: 4.7,
    nextAvailable: "45 min",
    status: "busy",
  },
]

export function TelehealthModal({ onClose }: TelehealthModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [consultationType, setConsultationType] = useState<"video" | "phone">("video")

  const handleStartConsultation = () => {
    if (!selectedDoctor) {
      alert("Please select a doctor")
      return
    }

    const doctor = availableDoctors.find((d) => d.id === selectedDoctor)
    alert(`Starting ${consultationType} consultation with ${doctor?.name}. You will be connected shortly.`)
    onClose()
  }

  const getStatusColor = (status: string) => {
    return status === "available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600" />
              Telehealth Consultation
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Consultation Type</h3>
            <div className="flex gap-2">
              <Button
                variant={consultationType === "video" ? "default" : "outline"}
                onClick={() => setConsultationType("video")}
                className="flex-1"
              >
                <Video className="w-4 h-4 mr-2" />
                Video Call
              </Button>
              <Button
                variant={consultationType === "phone" ? "default" : "outline"}
                onClick={() => setConsultationType("phone")}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone Call
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Available Doctors</h3>
            <div className="space-y-3">
              {availableDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedDoctor === doctor.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-yellow-600">★ {doctor.rating}</span>
                          <Badge className={getStatusColor(doctor.status)}>{doctor.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{doctor.nextAvailable}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">What to expect:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Secure, HIPAA-compliant video/phone consultation</li>
              <li>• Average consultation time: 15-20 minutes</li>
              <li>• Prescription can be sent directly to your pharmacy</li>
              <li>• Follow-up care recommendations provided</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleStartConsultation} className="flex-1" disabled={!selectedDoctor}>
              <Video className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

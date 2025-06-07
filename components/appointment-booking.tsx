"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Calendar, MapPin } from "lucide-react"

interface AppointmentBookingProps {
  onClose: () => void
}

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
]

const appointmentTypes = [
  { id: "general", label: "General Consultation", duration: "30 min" },
  { id: "urgent", label: "Urgent Care", duration: "45 min" },
  { id: "followup", label: "Follow-up", duration: "15 min" },
  { id: "specialist", label: "Specialist Referral", duration: "60 min" },
]

export function AppointmentBooking({ onClose }: AppointmentBookingProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [reason, setReason] = useState("")

  const handleBooking = () => {
    if (!selectedDate || !selectedTime || !selectedType) {
      alert("Please fill in all required fields")
      return
    }

    // Simulate booking
    alert(`Appointment booked for ${selectedDate} at ${selectedTime}. Confirmation will be sent to your email.`)
    onClose()
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Book Appointment
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointment-type">Appointment Type *</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {appointmentTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    onClick={() => setSelectedType(type.id)}
                    className="justify-start h-auto p-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs opacity-70">{type.duration}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Preferred Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={getTomorrowDate()}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Preferred Time *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      size="sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for the appointment..."
              className="w-full mt-1 p-3 border rounded-md resize-none h-20"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Location</span>
            </div>
            <p className="text-sm text-blue-800">Toronto General Hospital - Family Medicine Clinic</p>
            <p className="text-xs text-blue-600">200 Elizabeth St, Toronto, ON M5G 2C4</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleBooking} className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
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

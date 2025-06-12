"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

interface QueueJoinModalProps {
  hospital: any
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  prefilledInjury?: string
}

const injuryTypes = [
  "Minor cut or scrape",
  "Sprain or strain",
  "Fever or flu symptoms",
  "Chest pain",
  "Severe headache",
  "Abdominal pain",
  "Breathing difficulties",
  "Allergic reaction",
  "Burns",
  "Other",
]

export function QueueJoinModal({ hospital, isOpen, onClose, onSuccess, prefilledInjury }: QueueJoinModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
    healthCardNumber: "",
    phoneNumber: user?.user_metadata?.phone || "",
    injuryType: prefilledInjury || "",
    injuryDescription: "",
    severity: 2,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const estimatedWaitTime = hospital.waitTime + Math.floor(Math.random() * 20) - 10
      const position = Math.floor(Math.random() * 10) + 1

      const checkInDeadline = new Date()
      checkInDeadline.setMinutes(checkInDeadline.getMinutes() + estimatedWaitTime + 15)

      const { error } = await supabase.from("queue_entries").insert({
        user_id: user?.id,
        hospital_id: hospital.id,
        full_name: formData.fullName,
        health_card_number: formData.healthCardNumber,
        phone_number: formData.phoneNumber,
        injury_type: formData.injuryType,
        injury_description: formData.injuryDescription,
        severity_level: formData.severity,
        estimated_wait_time: estimatedWaitTime,
        position_in_queue: position,
        check_in_code: checkInCode,
        check_in_deadline: checkInDeadline.toISOString(),
        status: "waiting",
      })

      if (error) throw error

      alert(`Successfully joined queue! Your check-in code is: ${checkInCode}`)
      onSuccess()
    } catch (error) {
      console.error("Error joining queue:", error)
      alert("Failed to join queue. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Join Queue at {hospital.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hospital Info */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">{hospital.address}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-emerald-600">~{hospital.waitTime} min wait</span>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                Position #{Math.floor(Math.random() * 10) + 1}
              </Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="healthCardNumber">Health Card Number *</Label>
              <Input
                id="healthCardNumber"
                value={formData.healthCardNumber}
                onChange={(e) => setFormData({ ...formData, healthCardNumber: e.target.value })}
                required
              />
            </div>

            {/* Injury Information */}
            <div>
              <Label htmlFor="injuryType">Type of Injury/Condition *</Label>
              <Select
                value={formData.injuryType}
                onValueChange={(value) => setFormData({ ...formData, injuryType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select injury type" />
                </SelectTrigger>
                <SelectContent>
                  {injuryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="injuryDescription">Description (Optional)</Label>
              <Textarea
                id="injuryDescription"
                value={formData.injuryDescription}
                onChange={(e) => setFormData({ ...formData, injuryDescription: e.target.value })}
                placeholder="Provide additional details about your condition..."
                rows={3}
              />
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Important:</p>
                  <ul className="text-amber-700 space-y-1">
                    <li>• You must arrive within 15 minutes of being called</li>
                    <li>• Bring valid ID and health card</li>
                    <li>• You'll receive SMS updates about your queue status</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                {loading ? "Joining Queue..." : "Join Queue"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

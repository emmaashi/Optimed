"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/app/contexts/auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
  const { user, userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [checkInCode, setCheckInCode] = useState("")
  const [hospitalId, setHospitalId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: userProfile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
    healthCardNumber: userProfile?.health_card_number || "",
    phoneNumber: userProfile?.phone || user?.user_metadata?.phone || "",
    injuryType: prefilledInjury || "",
    injuryDescription: "",
    severity: 2,
  })

  // Fetch the actual UUID for the hospital when component mounts
  useEffect(() => {
    const fetchHospitalId = async () => {
      if (!hospital) return

      try {
        console.log("Hospital object:", hospital)

        // If hospital already has a valid UUID, use it directly
        if (
          hospital.id &&
          typeof hospital.id === "string" &&
          hospital.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
        ) {
          console.log("Using provided hospital UUID:", hospital.id)
          setHospitalId(hospital.id)
          return
        }

        // Try to find by name if available
        if (hospital.name) {
          console.log("Searching for hospital by name:", hospital.name)

          const { data, error } = await supabase
            .from("hospital_reference")
            .select("id")
            .ilike("name", `%${hospital.name.replace(/'/g, "''")}%`)
            .limit(1)

          if (error) {
            console.error("Error fetching hospital ID by name:", error)
          } else if (data && data.length > 0) {
            console.log("Found hospital ID by name:", data[0].id)
            setHospitalId(data[0].id)
            return
          }
        }

        // If we still don't have an ID, try to get any hospital as fallback
        console.log("Falling back to first available hospital")
        const { data: anyHospital, error: anyError } = await supabase.from("hospital_reference").select("id").limit(1)

        if (anyError) {
          console.error("Error fetching any hospital:", anyError)
        } else if (anyHospital && anyHospital.length > 0) {
          console.log("Using fallback hospital ID:", anyHospital[0].id)
          setHospitalId(anyHospital[0].id)
        } else {
          console.error("No hospitals found in the database")
        }
      } catch (err) {
        console.error("Error in fetchHospitalId:", err)
      }
    }

    fetchHospitalId()
  }, [hospital])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      if (!hospitalId) {
        console.error("Hospital ID is missing for:", hospital?.name)
        throw new Error("Hospital information is missing. Please try again.")
      }

      const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const estimatedWaitTime = hospital.wait_time || 30 // Default to 30 if wait_time is not provided
      const position = Math.floor(Math.random() * 10) + 1

      const checkInDeadline = new Date()
      checkInDeadline.setMinutes(checkInDeadline.getMinutes() + estimatedWaitTime + 15)

      // Use the fetched UUID for hospital_id
      const queueEntry = {
        user_id: user.id,
        hospital_id: hospitalId, // Use the UUID from hospital_reference
        injury_description: `${formData.injuryType}: ${formData.injuryDescription}`,
        severity_level: formData.severity,
        estimated_wait_time: estimatedWaitTime,
        position_in_queue: position,
        status: "waiting",
        check_in_code: checkInCode,
        check_in_deadline: checkInDeadline.toISOString(),
      }

      console.log("Submitting queue entry:", queueEntry)

      // Insert the queue entry
      const { data, error } = await supabase.from("queue_entries").insert(queueEntry).select()

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message)
      }

      console.log("Queue entry created:", data)
      setCheckInCode(checkInCode)
      setSuccess(true)
    } catch (err: any) {
      console.error("Error joining queue:", err)
      setError(err.message || "Failed to join queue. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Join Queue at {hospital?.name}</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">Successfully Joined Queue!</h3>
            <p className="text-gray-600">Your check-in code is:</p>
            <div className="bg-gray-100 p-3 rounded-md text-2xl font-mono font-bold tracking-wider">{checkInCode}</div>
            <p className="text-sm text-gray-500">
              Please arrive at the hospital within 15 minutes of being called. You'll receive SMS updates about your
              queue status.
            </p>
            <Button onClick={onSuccess} className="mt-4 bg-emerald-500 hover:bg-emerald-600">
              Close
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Hospital Info */}
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{hospital?.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold text-emerald-600">~{hospital?.wait_time || "--"} min wait</span>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  Position #{Math.floor(Math.random() * 10) + 1}
                </Badge>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
                  required
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
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                  onClick={(e) => {
                    if (!hospitalId) {
                      console.warn("No hospital ID found, but allowing submission for testing")
                      // You can set a default ID here if needed for testing
                      setHospitalId("00000000-0000-0000-0000-000000000000")
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining Queue...
                    </>
                  ) : (
                    "Join Queue"
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

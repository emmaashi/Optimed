"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, Heart, User, AlertCircle, UserPlus, Calendar } from "lucide-react"
import { useAuth } from "@/app/contexts/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import type React from "react"

function ProfileContent() {
  const { user, userProfile, error: authError, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    health_card_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    medical_conditions: "",
    allergies: "",
    current_medications: "",
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        setLoading(true)

        if (userProfile) {
          // Use the userProfile from AuthProvider if available
          setFormData({
            full_name: userProfile.full_name || "",
            email: userProfile.email || user.email || "",
            phone: userProfile.phone || "",
            date_of_birth: userProfile.date_of_birth || "",
            health_card_number: userProfile.health_card_number || "",
            emergency_contact_name: userProfile.emergency_contact_name || "",
            emergency_contact_phone: userProfile.emergency_contact_phone || "",
            medical_conditions: Array.isArray(userProfile.medical_conditions)
              ? userProfile.medical_conditions.join(", ")
              : userProfile.medical_conditions || "",
            allergies: Array.isArray(userProfile.allergies)
              ? userProfile.allergies.join(", ")
              : userProfile.allergies || "",
            current_medications: Array.isArray(userProfile.current_medications)
              ? userProfile.current_medications.join(", ")
              : userProfile.current_medications || "",
          })
        }
      } catch (err: any) {
        console.error("Error setting up profile form:", err)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [user, userProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSaveSuccess(false)

    try {
      // Convert comma-separated strings to arrays for certain fields
      const profileData = {
        full_name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        health_card_number: formData.health_card_number,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        medical_conditions: formData.medical_conditions
          ? formData.medical_conditions.split(",").map((item) => item.trim())
          : [],
        allergies: formData.allergies ? formData.allergies.split(",").map((item) => item.trim()) : [],
        current_medications: formData.current_medications
          ? formData.current_medications.split(",").map((item) => item.trim())
          : [],
      }

      const { error } = await updateProfile(profileData)

      if (error) {
        throw error
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError(err.message || "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal and medical information</p>
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full">
          <Heart className="w-6 h-6 text-emerald-600" />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(416) 555-0123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="health_card_number">Health Card Number</Label>
              <Input
                id="health_card_number"
                name="health_card_number"
                value={formData.health_card_number}
                onChange={handleInputChange}
                placeholder="1234-567-890-XX"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-500" />
              Emergency Contact
            </CardTitle>
            <CardDescription>Who should we contact in case of emergency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleInputChange}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleInputChange}
                  placeholder="(416) 555-0123"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-500" />
              Medical Information
            </CardTitle>
            <CardDescription>Your medical history and conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Medical Conditions</Label>
              <Textarea
                id="medical_conditions"
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleInputChange}
                placeholder="List any medical conditions, separated by commas"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="List any allergies, separated by commas"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_medications">Current Medications</Label>
              <Textarea
                id="current_medications"
                name="current_medications"
                value={formData.current_medications}
                onChange={handleInputChange}
                placeholder="List any medications you're currently taking, separated by commas"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

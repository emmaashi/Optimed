"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, Calendar, Phone, AlertTriangle, Heart } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface QuickActionsProps {
  onActionClick: (action: string) => void
}

const quickActions = [
  {
    id: "symptom-checker",
    title: "Symptom Checker",
    description: "AI-powered health assessment",
    icon: Stethoscope,
    color: "bg-blue-500 hover:bg-blue-600",
    urgent: false,
  },
  {
    id: "book-appointment",
    title: "Book Appointment",
    description: "Schedule your visit",
    icon: Calendar,
    color: "bg-emerald-500 hover:bg-emerald-600",
    urgent: false,
  },
  {
    id: "emergency",
    title: "Emergency",
    description: "Call 911 immediately",
    icon: AlertTriangle,
    color: "bg-red-500 hover:bg-red-600",
    urgent: true,
  },
  {
    id: "telehealth",
    title: "Telehealth",
    description: "Virtual consultation",
    icon: Phone,
    color: "bg-purple-500 hover:bg-purple-600",
    urgent: false,
  },
]

export function QuickActions({ onActionClick }: QuickActionsProps) {
  const [emergencyDialogOpen, setEmergencyDialogOpen] = useState(false)

  const handleActionClick = (actionId: string) => {
    if (actionId === "emergency") {
      setEmergencyDialogOpen(true)
    } else {
      onActionClick(actionId)
    }
  }

  const handleEmergencyConfirm = () => {
    setEmergencyDialogOpen(false)
    onActionClick("emergency")
  }

  return (
    <>
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="w-5 h-5 text-emerald-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleActionClick(action.id)}
                className={`h-auto py-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105 shadow-sm`}
              >
                <action.icon className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={emergencyDialogOpen} onOpenChange={setEmergencyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emergency Services</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to call 911 emergency services. This should only be used for genuine medical emergencies
              that require immediate attention.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEmergencyConfirm} className="bg-red-600 hover:bg-red-700">
              Call 911
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

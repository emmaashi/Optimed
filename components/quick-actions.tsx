"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, Calendar, Phone, AlertTriangle, Heart } from "lucide-react"

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
  return (
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
              onClick={() => onActionClick(action.id)}
              className={`h-auto py-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} ${
                action.urgent ? "animate-pulse" : ""
              } transition-all duration-200 hover:scale-105 shadow-sm`}
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
  )
}

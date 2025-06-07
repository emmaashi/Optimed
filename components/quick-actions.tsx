import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stethoscope, Calendar, Phone, AlertTriangle, Heart } from "lucide-react"

const quickActions = [
  {
    title: "Symptom Checker",
    description: "AI-powered health assessment",
    icon: Stethoscope,
    color: "bg-blue-500 hover:bg-blue-600",
    urgent: false,
  },
  {
    title: "Book Appointment",
    description: "Schedule your visit",
    icon: Calendar,
    color: "bg-emerald-500 hover:bg-emerald-600",
    urgent: false,
  },
  {
    title: "Emergency",
    description: "Call 911 immediately",
    icon: AlertTriangle,
    color: "bg-red-500 hover:bg-red-600",
    urgent: true,
  },
  {
    title: "Telehealth",
    description: "Virtual consultation",
    icon: Phone,
    color: "bg-purple-500 hover:bg-purple-600",
    urgent: false,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Heart className="w-5 h-5 text-emerald-600" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className={`h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} ${
              action.urgent ? "animate-pulse" : ""
            }`}
          >
            <action.icon className="w-6 h-6" />
            <div className="text-center">
              <div className="font-medium text-sm">{action.title}</div>
              <div className="text-xs opacity-90">{action.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}

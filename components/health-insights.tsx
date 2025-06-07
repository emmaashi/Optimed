import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, FileText, AlertCircle } from "lucide-react"

const insights = [
  {
    title: "Flu Season Alert",
    description: "Higher than usual flu activity in your area. Consider getting vaccinated.",
    type: "warning",
    action: "Find Vaccination Sites",
  },
  {
    title: "Annual Checkup Due",
    description: "Your last physical exam was 13 months ago. Schedule your annual checkup.",
    type: "reminder",
    action: "Book Appointment",
  },
  {
    title: "Prescription Refill",
    description: "Your blood pressure medication expires in 5 days.",
    type: "urgent",
    action: "Refill Now",
  },
]

export function HealthInsights() {
  const getInsightStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "reminder":
        return "border-blue-200 bg-blue-50"
      case "urgent":
        return "border-red-200 bg-red-50"
      default:
        return "border-slate-200 bg-white"
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertCircle
      case "reminder":
        return Calendar
      case "urgent":
        return FileText
      default:
        return TrendingUp
    }
  }

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "reminder":
        return "bg-blue-100 text-blue-700"
      case "urgent":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Health Insights & Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = getInsightIcon(insight.type)
          return (
            <div key={index} className={`p-4 rounded-lg border ${getInsightStyle(insight.type)}`}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 mt-0.5 text-slate-600" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-900">{insight.title}</h4>
                    <Badge className={`text-xs ${getBadgeStyle(insight.type)}`}>{insight.type}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{insight.description}</p>
                  <Button size="sm" variant="outline" className="h-8">
                    {insight.action}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

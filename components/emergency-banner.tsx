"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Phone, X } from "lucide-react"
import { useState } from "react"

export function EmergencyBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-red-800">
            <strong>Emergency?</strong> For life-threatening situations, call 911 immediately.
          </span>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white h-8">
            <Phone className="w-3 h-3 mr-1" />
            Call 911
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
        >
          <X className="w-4 h-4" />
        </Button>
      </AlertDescription>
    </Alert>
  )
}

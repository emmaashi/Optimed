"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "./ui/progress"
import { MapPin, Phone, Navigation, AlertTriangle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ActiveQueueCardProps {
  queue: any
  onUpdate: () => void
}

export function ActiveQueueCard({ queue, onUpdate }: ActiveQueueCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [arrivalDeadline, setArrivalDeadline] = useState<string>("")
  const [isExpiringSoon, setIsExpiringSoon] = useState(false)

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()
      const estimatedCallTime = new Date(queue.created_at)
      estimatedCallTime.setMinutes(estimatedCallTime.getMinutes() + queue.estimated_wait_time)

      const deadline = new Date(queue.check_in_deadline)

      // Calculate time remaining until called
      const timeDiff = estimatedCallTime.getTime() - now.getTime()

      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeRemaining(hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`)
      } else {
        setTimeRemaining("You should be called soon!")
      }

      // Format arrival deadline
      setArrivalDeadline(deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

      // Check if expiring soon (within 30 minutes)
      const timeToDeadline = deadline.getTime() - now.getTime()
      setIsExpiringSoon(timeToDeadline < 30 * 60 * 1000 && timeToDeadline > 0)
    }

    updateTimes()
    const interval = setInterval(updateTimes, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [queue])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "called":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const handleCancelQueue = async () => {
    if (confirm("Are you sure you want to cancel your queue position?")) {
      try {
        const { error } = await supabase.from("queue_entries").update({ status: "cancelled" }).eq("id", queue.id)

        if (error) throw error
        onUpdate()
      } catch (error) {
        console.error("Error cancelling queue:", error)
        alert("Failed to cancel queue position")
      }
    }
  }

  const progress = Math.max(
    0,
    Math.min(100, ((queue.estimated_wait_time - Number.parseInt(timeRemaining)) / queue.estimated_wait_time) * 100),
  )

  return (
    <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm ${isExpiringSoon ? "border-amber-300 bg-amber-50" : ""}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Queue Status</h2>
        <p className="text-sm text-gray-500 mt-1">Your active queue position</p>
      </div>
      <div className="p-6 space-y-4">
        {/* Hospital Info */}
        <div>
          <h3 className="font-bold text-gray-900">{queue.hospitals?.name}</h3>
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <MapPin className="w-3 h-3" />
            <span className="text-sm">{queue.hospitals?.address}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge className={`${getStatusColor(queue.status)} text-xs px-2 py-1 rounded-full`}>
            {queue.status === "waiting" ? "In Queue" : "Called - Check In Required"}
          </Badge>
          {queue.status === "called" && <Badge className="bg-red-50 text-red-700 border-red-200 text-xs px-2 py-1 rounded-full">Urgent</Badge>}
        </div>

        {/* Queue Position & Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Position in queue:</span>
            <span className="font-bold text-lg">#{queue.position_in_queue}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimated wait:</span>
              <span className="font-bold text-emerald-600">{timeRemaining}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Arrival Deadline */}
        <div
          className={`p-3 rounded-xl border ${isExpiringSoon ? "bg-amber-100 border-amber-300" : "bg-blue-50 border-blue-200"}`}
        >
          <div className="flex items-center gap-2">
            {isExpiringSoon ? (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-blue-600" />
            )}
            <div>
              <p className={`text-sm font-medium ${isExpiringSoon ? "text-amber-800" : "text-blue-800"}`}>
                {queue.status === "called" ? "Arrive by:" : "Must arrive by:"}
              </p>
              <p className={`text-lg font-bold ${isExpiringSoon ? "text-amber-900" : "text-blue-900"}`}>
                {arrivalDeadline}
              </p>
            </div>
          </div>
        </div>

        {/* Check-in Code (if called) */}
        {queue.status === "called" && (
          <div className="bg-gray-100 p-3 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Check-in Code:</p>
            <p className="text-xl font-mono font-bold text-gray-900">{queue.check_in_code}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 rounded-xl">
              <Navigation className="w-3 h-3 mr-1" />
              Directions
            </Button>
            <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 rounded-xl">
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCancelQueue}
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-xl"
          >
            Cancel Queue Position
          </Button>
        </div>
      </div>
    </div>
  )
}

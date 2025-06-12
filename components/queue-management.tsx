"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, MapPin, CheckCircle, AlertCircle, Phone, Navigation, Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface QueueEntry {
  id: string
  hospital_name: string
  injury_description: string
  severity_level: number
  position_in_queue: number
  estimated_wait_time: number
  status: string
  check_in_code: string
  check_in_deadline: string
  created_at: string
}

interface QueueManagementProps {
  userId?: string // Made optional to handle undefined
}

export function QueueManagement({ userId }: QueueManagementProps) {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([])
  const [checkInCode, setCheckInCode] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Don't fetch if no userId
    if (!userId) {
      setLoading(false)
      return
    }

    fetchQueueEntries()

    const subscription = supabase
      .channel("queue_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue_entries",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchQueueEntries()
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const fetchQueueEntries = async () => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from("queue_entries")
        .select(`
          *,
          hospitals (name)
        `)
        .eq("user_id", userId)
        .in("status", ["waiting", "called"])
        .order("created_at", { ascending: false })

      if (error) throw error

      const formattedEntries =
        data?.map((entry) => ({
          ...entry,
          hospital_name: entry.hospitals?.name || "Unknown Hospital",
        })) || []

      setQueueEntries(formattedEntries)
    } catch (error) {
      console.error("Error fetching queue entries:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (queueId: string) => {
    try {
      const { error } = await supabase
        .from("queue_entries")
        .update({
          status: "checked_in",
          updated_at: new Date().toISOString(),
        })
        .eq("id", queueId)
        .eq("check_in_code", checkInCode)

      if (error) throw error

      setCheckInCode("")
      fetchQueueEntries()
    } catch (error) {
      console.error("Error checking in:", error)
      alert("Invalid check-in code or entry not found")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "called":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "checked_in":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "bg-red-50 text-red-700 border-red-200"
    if (severity >= 3) return "bg-orange-50 text-orange-700 border-orange-200"
    if (severity >= 2) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-emerald-50 text-emerald-700 border-emerald-200"
  }

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`
    }
    return `${minutes}m remaining`
  }

  // Show login prompt if no userId
  if (!userId) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5 text-emerald-500" />
            Your Queue Status
          </CardTitle>
          <p className="text-sm text-slate-600">Track your position in hospital queues</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">Please log in</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              Log in to view your queue status and join hospital queues
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (queueEntries.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5 text-emerald-500" />
            Your Queue Status
          </CardTitle>
          <p className="text-sm text-slate-600">Track your position in hospital queues</p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">No active queue entries</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-sm">
              Use the AI assistant to assess your injury and join a queue at a nearby hospital
            </p>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Plus className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="w-5 h-5 text-emerald-500" />
          Your Queue Status
        </CardTitle>
        <p className="text-sm text-slate-600">Track your position in hospital queues</p>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {queueEntries.map((entry) => (
          <div key={entry.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900">{entry.hospital_name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="text-sm text-slate-600">{entry.injury_description}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(entry.status)}>{entry.status.replace("_", " ")}</Badge>
                <Badge className={getSeverityColor(entry.severity_level)}>Level {entry.severity_level}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium">Position: #{entry.position_in_queue}</p>
                  <p className="text-xs text-slate-600">~{entry.estimated_wait_time} min wait</p>
                </div>
              </div>

              {entry.status === "called" && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-blue-700">Check-in Required</p>
                    <p className="text-xs text-slate-600">{formatTimeRemaining(entry.check_in_deadline)}</p>
                  </div>
                </div>
              )}
            </div>

            {entry.status === "called" && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-3">
                  <strong>You've been called!</strong> Please check in at the hospital within the time limit.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter check-in code"
                    value={checkInCode}
                    onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                    className="flex-1 h-8"
                  />
                  <Button onClick={() => handleCheckIn(entry.id)} size="sm" className="h-8" disabled={!checkInCode}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Check In
                  </Button>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8">
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8">
                    <Phone className="w-3 h-3 mr-1" />
                    Call Hospital
                  </Button>
                </div>
              </div>
            )}

            {entry.status === "waiting" && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>In Queue:</strong> You'll receive a notification when it's your turn. Make sure to arrive
                  within 15 minutes of being called.
                </p>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

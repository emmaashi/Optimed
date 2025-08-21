"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  userId?: string
  onStartAssessment?: () => void
}

export function QueueManagement({ userId, onStartAssessment }: QueueManagementProps) {
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([])
  const [checkInCode, setCheckInCode] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  const handleStartAssessment = () => {
    if (onStartAssessment) {
      onStartAssessment()
    } else {
      // Fallback - open the AI chatbot or symptom checker
      const chatbotButton = document.querySelector("[data-chatbot-trigger]") as HTMLElement
      if (chatbotButton) {
        chatbotButton.click()
      } else {
        // Alternative: trigger symptom checker modal
        window.dispatchEvent(new CustomEvent("openSymptomChecker"))
      }
    }
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

  if (!userId) {
    return (
      <div className="bg-white rounded-3xl h-full flex flex-col shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Queue Status</h2>
          <p className="text-sm text-gray-500 mt-1">Track your position in hospital queues</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Please log in</h3>
              <p className="text-sm text-gray-500">
                Log in to view your queue status
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-3xl h-full flex flex-col shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Queue Status</h2>
          <p className="text-sm text-gray-500 mt-1">Track your position in hospital queues</p>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (queueEntries.length === 0) {
    return (
      <div className="bg-white rounded-3xl h-full flex flex-col shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Queue Status</h2>
          <p className="text-sm text-gray-500 mt-1">Track your position in hospital queues</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">No active queues</h3>
              <p className="text-sm text-gray-500 text-center">
                Use the AI assistant to assess your symptoms
              </p>
            </div>
            <Button
              onClick={handleStartAssessment}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-6 py-2 rounded-full mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl h-full flex flex-col shadow-sm border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900">Queue Status</h2>
        <p className="text-sm text-gray-500 mt-1">Track your position in hospital queues</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {queueEntries.map((entry) => (
          <div key={entry.id} className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-3 hover:bg-white/80 hover:border-gray-300/50 hover:shadow-md transition-all duration-200">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-gray-50/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            
            <div className="relative space-y-2">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{entry.hospital_name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 truncate">{entry.injury_description}</span>
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    entry.status === 'waiting' ? 'bg-amber-400' : 
                    entry.status === 'called' ? 'bg-blue-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-500">L{entry.severity_level}</span>
                </div>
              </div>

              {/* Queue Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs font-medium">#{entry.position_in_queue}</span>
                  <span className="text-xs text-gray-500">• ~{entry.estimated_wait_time}min</span>
                </div>
                {entry.status === "called" && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{formatTimeRemaining(entry.check_in_deadline)}</span>
                  </div>
                )}
              </div>

              {/* Action Areas */}
              {entry.status === "called" && (
                <div className="bg-blue-50/80 backdrop-blur-sm p-2.5 rounded-lg border border-blue-200/50 space-y-2">
                  <p className="text-xs text-blue-800">
                    <strong>You've been called!</strong> Check in within the time limit.
                  </p>
                  <div className="flex gap-1.5">
                    <Input
                      placeholder="Check-in code"
                      value={checkInCode}
                      onChange={(e) => setCheckInCode(e.target.value.toUpperCase())}
                      className="flex-1 h-8 text-xs rounded-lg border-gray-200 bg-white/80"
                    />
                    <Button
                      onClick={() => handleCheckIn(entry.id)}
                      className="h-8 px-2.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-xs"
                      disabled={!checkInCode}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Check In
                    </Button>
                  </div>
                  <div className="flex gap-1.5">
                    <Button variant="outline" className="flex-1 h-8 rounded-lg border-gray-200 text-xs bg-white/80">
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <Button variant="outline" className="flex-1 h-8 rounded-lg border-gray-200 text-xs bg-white/80">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              )}

              {entry.status === "waiting" && (
                <div className="bg-amber-50/80 backdrop-blur-sm p-2.5 rounded-lg border border-amber-200/50">
                  <p className="text-xs text-amber-800">
                    <strong>In Queue:</strong> You'll be notified when it's your turn.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { WaitTimesList } from "@/components/wait-times-list"
import { QueueJoinModal } from "@/components/queue-join-model"
import { ActiveQueueCard } from "@/components/active-queue-entries"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/app/contexts/auth-provider"
import { supabase } from "@/lib/supabase"

export default function WaitTimesPage() {
  const { user } = useAuth()
  const [selectedHospital, setSelectedHospital] = useState<any>(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [activeQueue, setActiveQueue] = useState<any>(null)
  const [injuryInfo, setInjuryInfo] = useState<any>(null)

  useEffect(() => {
    if (user) {
      checkActiveQueue()
    }
  }, [user])

  const checkActiveQueue = async () => {
    const { data } = await supabase
    .from("queue_entries")
    .select(`
        *,
        hospitals (name, address)
    `)
    .eq("user_id", user?.id)
    .in("status", ["waiting", "called"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

    if (data) {
    setActiveQueue(data)
    }
  }

  const handleJoinQueue = (hospital: any, injury?: any) => {
    setSelectedHospital(hospital)
    setInjuryInfo(injury)
    setShowJoinModal(true)
  }

  const handleQueueJoined = () => {
    setShowJoinModal(false)
    checkActiveQueue()
  }

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-slate-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            <div className="flex-1 p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pl-1.5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Live Wait Times</h1>
                    <p className="text-slate-600">Find the shortest wait times at nearby hospitals</p>
                  </div>
                  {activeQueue && (
                    <div className="text-sm text-emerald-600 font-medium">
                      ✓ You're currently in queue at {activeQueue.hospitals?.name}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <WaitTimesList onJoinQueue={handleJoinQueue} activeQueueId={activeQueue?.id} />
                  </div>

                  {/* Active Queue Status */}
                  <div>
                    {activeQueue ? (
                      <ActiveQueueCard queue={activeQueue} onUpdate={checkActiveQueue} />
                    ) : (
                      <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="font-medium text-slate-900 mb-2">No Active Queue</h3>
                        <p className="text-sm text-slate-500">Join a hospital queue to see your status here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {showJoinModal && (
          <QueueJoinModal
            hospital={selectedHospital}
            isOpen={showJoinModal}
            onClose={() => setShowJoinModal(false)}
            onSuccess={handleQueueJoined}
            prefilledInjury={injuryInfo?.type}
          />
        )}
      </SidebarProvider>
    </ProtectedRoute>
  )
}

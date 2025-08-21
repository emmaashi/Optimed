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
        <div className="flex min-h-screen w-full bg-white">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            
            <div className="flex-1 flex flex-col">
              {/* Header Bar */}
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Live Wait Times</h1>
                    <p className="text-sm text-gray-500 mt-1">Find the shortest wait times at nearby hospitals</p>
                  </div>
                  {activeQueue && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm text-emerald-700 font-medium">
                        In queue at {activeQueue.hospitals?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content - Apple-style layout */}
              <div className="flex-1 p-6 flex gap-6">
                {/* Hospital List - Takes up most of the screen */}
                <div className="flex-1">
                  <WaitTimesList onJoinQueue={handleJoinQueue} activeQueueId={activeQueue?.id} />
                </div>

                {/* Active Queue Status - Compact sidebar */}
                <div className="w-80 flex-shrink-0">
                  {activeQueue ? (
                    <ActiveQueueCard queue={activeQueue} onUpdate={checkActiveQueue} />
                  ) : (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-fit">
                      <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Queue Status</h2>
                        <p className="text-sm text-gray-500 mt-1">Your active queue position</p>
                      </div>
                      <div className="p-6 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Queue</h3>
                        <p className="text-sm text-gray-500">Join a hospital queue to see your status here</p>
                      </div>
                    </div>
                  )}
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

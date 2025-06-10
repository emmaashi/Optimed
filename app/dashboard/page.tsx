"use client"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { WaitTimesCard } from "@/components/wait-times-card"
import { HospitalMap } from "@/components/hospital-map"
import { QuickActions } from "@/components/quick-actions"
import { EmergencyBanner } from "@/components/emergency-banner"
import { AIChatbot } from "@/components/ai-chatbot"
import { QueueManagement } from "@/components/queue-management"
import { SymptomChecker } from "@/components/symptom-checker"
import { AppointmentBooking } from "@/components/appointment-booking"
import { TelehealthModal } from "@/components/telehealth-modal"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const { user } = useAuth() // Remove loading from here since ProtectedRoute handles it
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      // Get current user profile from our users table
      const getCurrentUser = async () => {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()
          
          if (error) {
            console.error('Error fetching user:', error)
            return
          }
          
          setCurrentUser(data)
        } catch (error) {
          console.error('Error in getCurrentUser:', error)
        }
      }
      getCurrentUser()
    }
  }, [user])

  const handleQueueJoin = async (assessment: any, hospitalId: string) => {
    if (!currentUser) return

    try {
      const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const checkInDeadline = new Date()
      checkInDeadline.setHours(checkInDeadline.getHours() + 2) // 2 hour window

      const { data, error } = await supabase.from("queue_entries").insert({
        user_id: currentUser.id,
        hospital_id: hospitalId,
        injury_description: assessment.recommendedAction,
        severity_level: assessment.severity,
        estimated_wait_time: assessment.estimatedWaitTime,
        position_in_queue: Math.floor(Math.random() * 10) + 1, // Simulated
        check_in_code: checkInCode,
        check_in_deadline: checkInDeadline.toISOString(),
        status: "waiting",
      })

      if (error) throw error

      alert(`Successfully joined queue! Your check-in code is: ${checkInCode}`)
    } catch (error) {
      console.error("Error joining queue:", error)
      alert("Failed to join queue. Please try again.")
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "symptom-checker":
        setActiveModal("symptom-checker")
        break
      case "book-appointment":
        setActiveModal("appointment-booking")
        break
      case "emergency":
        window.open("tel:911", "_self")
        break
      case "telehealth":
        setActiveModal("telehealth")
        break
      default:
        break
    }
  }

  return (
    <ProtectedRoute>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-slate-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <DashboardHeader />
            <div className="flex-1 p-6 space-y-6">
              <EmergencyBanner />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Map Section */}
                <div className="lg:col-span-2">
                  <HospitalMap selectedHospital={selectedHospital} onHospitalSelect={setSelectedHospital} />
                </div>

                {/* Wait Times Sidebar */}
                <div className="space-y-6">
                  <WaitTimesCard selectedHospital={selectedHospital} />
                  <QuickActions onActionClick={handleQuickAction} />
                </div>
              </div>

              <QueueManagement userId={currentUser?.id} />
            </div>

            {currentUser && <AIChatbot userId={currentUser.id} onQueueJoin={handleQueueJoin} />}

            {activeModal === "symptom-checker" && <SymptomChecker onClose={() => setActiveModal(null)} />}
            {activeModal === "appointment-booking" && <AppointmentBooking onClose={() => setActiveModal(null)} />}
            {activeModal === "telehealth" && <TelehealthModal onClose={() => setActiveModal(null)} />}
          </main>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
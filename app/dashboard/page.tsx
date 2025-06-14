"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { HospitalMap } from "@/components/hospital-map"
import { QuickActions } from "@/components/quick-actions"
import { EmergencyBanner } from "@/components/emergency-banner"
import { AIChatbot } from "@/components/ai-chatbot"
import { QueueManagement } from "@/components/queue-management"
import { SymptomChecker } from "@/components/symptom-checker"
import { AppointmentBooking } from "@/components/appointment-booking"
import { TelehealthModal } from "@/components/telehealth-modal"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/app/contexts/auth-provider"
import { supabase } from "@/lib/supabase"

function DashboardContent() {
  const { user } = useAuth()
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleQueueJoin = async (assessment: any, hospitalId: string) => {
    if (!user) return

    try {
      const { data: queueCount, error: countError } = await supabase
        .from("queue_entries")
        .select("id", { count: "exact" })
        .eq("hospital_id", hospitalId)
        .eq("status", "waiting")

      if (countError) throw countError

      const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const checkInDeadline = new Date()
      checkInDeadline.setHours(checkInDeadline.getHours() + 2)

      const positionInQueue = (queueCount?.length || 0) + 1

      const { data, error } = await supabase.from("queue_entries").insert({
        user_id: user.id,
        hospital_id: hospitalId,
        injury_description: assessment.recommendedAction,
        severity_level: assessment.severity,
        estimated_wait_time: assessment.estimatedWaitTime,
        position_in_queue: positionInQueue,
        check_in_code: checkInCode,
        check_in_deadline: checkInDeadline.toISOString(),
        status: "waiting",
      })

      if (error) throw error
      alert(`Successfully joined queue! Your check-in code is: ${checkInCode}. You are position #${positionInQueue} in line.`)
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

  const handleStartAssessment = () => {
    setActiveModal("symptom-checker")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />

          <div className="flex-1 p-4 md:p-6 overflow-auto">

            <div className="mb-4 md:mb-6">
              <QuickActions onActionClick={handleQuickAction} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="h-[400px] lg:h-[600px]">
                <HospitalMap selectedHospital={selectedHospital} onHospitalSelect={setSelectedHospital} />
              </div>

              <div className="h-[400px] lg:h-[600px] overflow-auto">
                <QueueManagement userId={user?.id} onStartAssessment={handleStartAssessment} />
              </div>
            </div>
          </div>

          {user && <AIChatbot userId={user.id} onQueueJoin={handleQueueJoin} />}

          {activeModal === "symptom-checker" && <SymptomChecker onClose={() => setActiveModal(null)} />}
          {activeModal === "appointment-booking" && <AppointmentBooking onClose={() => setActiveModal(null)} />}
          {activeModal === "telehealth" && <TelehealthModal onClose={() => setActiveModal(null)} />}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { HospitalMap } from "@/components/hospital-map"

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
      const checkInCode = Math.random().toString(36).substring(2, 8).toUpperCase()
      const checkInDeadline = new Date()
      checkInDeadline.setHours(checkInDeadline.getHours() + 2)

      const { error } = await supabase.from("queue_entries").insert({
        user_id: user.id,
        hospital_id: hospitalId,
        injury_description: assessment.recommendedAction,
        severity_level: assessment.severity,
        estimated_wait_time: assessment.estimatedWaitTime,
        position_in_queue: Math.floor(Math.random() * 10) + 1,
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

  const handleStartAssessment = () => {
    setActiveModal("symptom-checker")
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-white">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <DashboardHeader />

          <div className="flex-1 flex flex-col">
            {/* Quick Actions - Minimal, Apple-style floating bar */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleQuickAction("symptom-checker")}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  Symptom Check
                </button>

                <button
                  onClick={() => handleQuickAction("book-appointment")}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full text-sm font-medium hover:bg-emerald-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Book
                </button>

                <button
                  onClick={() => handleQuickAction("telehealth")}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Telehealth
                </button>

                <button
                  onClick={() => handleQuickAction("emergency")}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Emergency
                </button>
              </div>
            </div>

            {/* Main Content - Map-centric layout with perfect margins */}
            <div className="flex-1 p-6 flex gap-6">
              {/* Map Section - Takes up most of the screen */}
              <div className="flex-1">
                <HospitalMap selectedHospital={selectedHospital} onHospitalSelect={setSelectedHospital} />
              </div>

              {/* Queue Management - Compact sidebar */}
              <div className="w-80 flex-shrink-0">
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

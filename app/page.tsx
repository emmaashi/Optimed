"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { WaitTimesCard } from "@/components/wait-times-card"
import { HospitalMap } from "@/components/hospital-map"
import { QuickActions } from "@/components/quick-actions"
import { HealthInsights } from "@/components/health-insights"
import { EmergencyBanner } from "@/components/emergency-banner"

export default function Dashboard() {
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null)

  return (
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
                <QuickActions />
              </div>
            </div>

            <HealthInsights />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

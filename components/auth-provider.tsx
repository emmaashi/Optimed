"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface UserProfile {
  id: string
  email: string
  full_name?: string
  phone?: string
  health_card_number?: string
  date_of_birth?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ data: any; error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  updateProfile: async () => ({ data: null, error: null }),
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔄 AuthProvider useEffect starting")

    let mounted = true

    const initAuth = async () => {
      try {
        console.log("📡 Checking Supabase connection...")

        // Force set loading to false after 3 seconds as a failsafe
        const failsafe = setTimeout(() => {
          if (mounted) {
            console.log("⏰ Failsafe timeout - setting loading to false")
            setLoading(false)
          }
        }, 3000)

        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("❌ Session error:", error)
        } else {
          console.log("✅ Session check complete:", session ? "User found" : "No user")
        }

        if (mounted) {
          setUser(session?.user ?? null)
          clearTimeout(failsafe)
          setLoading(false)
          console.log("🏁 Auth initialization complete")
        }
      } catch (error) {
        console.error("💥 Auth initialization error:", error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Start initialization
    initAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Auth state changed:", event)
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      console.log("🧹 Cleaning up auth provider")
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    console.log("👋 Signing out...")
    await supabase.auth.signOut()
    setUserProfile(null)
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return { data: null, error: "No user logged in" }
    }

    const { data, error } = await supabase.from("users").update(profileData).eq("id", user.id).select().single()

    if (!error && data) {
      setUserProfile(data)
    }

    return { data, error }
  }

  console.log("🔍 AuthProvider render - loading:", loading, "user:", user?.email || "No user")

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

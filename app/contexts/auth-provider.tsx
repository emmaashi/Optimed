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
  medical_conditions?: string[] | string
  allergies?: string[] | string
  current_medications?: string[] | string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ data: any; error: any }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
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
  const [error, setError] = useState<string | null>(null)

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null)
        return
      }

      try {
        console.log("📡 Fetching user profile for:", user.id)
        const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single()

        if (error) {
          console.error("❌ Error fetching user profile:", error)
          setError(error.message)
        } else if (data) {
          console.log("✅ User profile fetched:", data.email)
          setUserProfile(data)
        } else {
          console.log("⚠️ No user profile found, creating one...")
          // Create a profile if it doesn't exist
          const newProfile = {
            id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || "",
            phone: user.user_metadata?.phone || "",
          }

          const { data: createdProfile, error: createError } = await supabase
            .from("users")
            .insert(newProfile)
            .select()
            .single()

          if (createError) {
            console.error("❌ Error creating user profile:", createError)
            setError(createError.message)
          } else if (createdProfile) {
            console.log("✅ User profile created:", createdProfile.email)
            setUserProfile(createdProfile)
          }
        }
      } catch (err: any) {
        console.error("💥 Error in fetchUserProfile:", err)
        setError(err.message || "Failed to fetch user profile")
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

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
          setError(error.message)
        } else {
          console.log("✅ Session check complete:", session ? "User found" : "No user")
        }

        if (mounted) {
          setUser(session?.user ?? null)
          clearTimeout(failsafe)
          setLoading(false)
          console.log("🏁 Auth initialization complete")
        }
      } catch (error: any) {
        console.error("💥 Auth initialization error:", error)
        setError(error.message || "Authentication initialization failed")
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
    setError(null)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("❌ Sign out error:", error)
        setError(error.message)
      }
      setUserProfile(null)
    } catch (err: any) {
      console.error("💥 Error in signOut:", err)
      setError(err.message || "Failed to sign out")
    }
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    setError(null)
    if (!user) {
      const error = "No user logged in"
      setError(error)
      return { data: null, error }
    }

    try {
      console.log("✏️ Updating profile for:", user.id, profileData)
      const { data, error } = await supabase.from("users").update(profileData).eq("id", user.id).select().single()

      if (error) {
        console.error("❌ Profile update error:", error)
        setError(error.message)
      } else if (data) {
        console.log("✅ Profile updated successfully")
        setUserProfile((prev) => (prev ? { ...prev, ...data } : data))
      }

      return { data, error }
    } catch (err: any) {
      console.error("💥 Error in updateProfile:", err)
      const errorMsg = err.message || "Failed to update profile"
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  console.log("🔍 AuthProvider render - loading:", loading, "user:", user?.email || "No user")

  const value = {
    user,
    userProfile,
    loading,
    error,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

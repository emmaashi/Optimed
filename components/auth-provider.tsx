"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect running')
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('📡 Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
        } else {
          console.log('✅ Initial session:', session?.user?.email || 'No user')
        }
        
        setUser(session?.user ?? null)
        setLoading(false)
        console.log('🏁 Initial auth loading complete')
      } catch (error) {
        console.error('💥 Exception in getInitialSession:', error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state change:', event, session?.user?.email || 'No user')
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log('🧹 Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    console.log('👋 Signing out...')
    await supabase.auth.signOut()
  }

  console.log('🔍 AuthProvider render - loading:', loading, 'user:', user?.email || 'No user')

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}
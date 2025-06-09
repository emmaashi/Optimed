import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          date_of_birth: string | null
          health_card_number: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          medical_conditions: string[] | null
          allergies: string[] | null
          current_medications: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          date_of_birth?: string | null
          health_card_number?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_conditions?: string[] | null
          allergies?: string[] | null
          current_medications?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          date_of_birth?: string | null
          health_card_number?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          medical_conditions?: string[] | null
          allergies?: string[] | null
          current_medications?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      hospitals: {
        Row: {
          id: string
          name: string
          address: string
          phone: string | null
          latitude: number | null
          longitude: number | null
          current_wait_time: number | null
          capacity: number | null
          current_load: number | null
          status: string | null
          created_at: string
          updated_at: string
        }
      }
      queue_entries: {
        Row: {
          id: string
          user_id: string
          hospital_id: string
          injury_description: string
          severity_level: number
          estimated_wait_time: number | null
          position_in_queue: number | null
          status: string | null
          check_in_code: string | null
          check_in_deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hospital_id: string
          injury_description: string
          severity_level: number
          estimated_wait_time?: number | null
          position_in_queue?: number | null
          status?: string | null
          check_in_code?: string | null
          check_in_deadline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          messages: any
          injury_assessment: any | null
          recommended_action: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages?: any
          injury_assessment?: any | null
          recommended_action?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

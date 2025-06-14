import { supabase } from "./supabase"

export interface QueueEntry {
  user_id: string
  hospital_id: string
  injury_description: string
  severity_level: number
  estimated_wait_time?: number
  position_in_queue?: number
  status: string
  check_in_code?: string
  check_in_deadline?: string
}

export async function joinQueue(queueEntry: QueueEntry) {
  try {
    const requiredFields: (keyof QueueEntry)[] = ["user_id", "hospital_id", "injury_description", "severity_level"]

    for (const field of requiredFields) {
      if (!queueEntry[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Insert the queue entry
    const { data, error } = await supabase.from("queue_entries").insert(queueEntry).select()

    if (error) {
      console.error("Error joining queue:", error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in joinQueue:", error)
    throw error
  }
}

export async function getUserQueueEntries(userId: string) {
  try {
    const { data, error } = await supabase
      .from("queue_entries")
      .select("*, hospitals(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching user queue entries:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    console.error("Error in getUserQueueEntries:", error)
    throw error
  }
}

export async function updateQueueEntryStatus(entryId: string, status: string) {
  try {
    const { data, error } = await supabase
      .from("queue_entries")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", entryId)
      .select()

    if (error) {
      console.error("Error updating queue entry status:", error)
      throw new Error(error.message)
    }

    return data
  } catch (error: any) {
    console.error("Error in updateQueueEntryStatus:", error)
    throw error
  }
}

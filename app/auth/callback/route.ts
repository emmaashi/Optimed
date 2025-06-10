import { createServerClient } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  console.log("Auth callback received:", { code: !!code, error, errorDescription })

  // Handle errors from Supabase
  if (error) {
    console.error("Auth callback error:", { error, errorDescription })
    const errorParams = new URLSearchParams({
      error: error,
      error_description: errorDescription || "Unknown error",
    })
    return NextResponse.redirect(new URL(`/auth/auth-code-error?${errorParams}`, requestUrl.origin))
  }

  if (code) {
    const supabase = createServerClient()

    try {
      console.log("Exchanging code for session...")
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Error exchanging code:", exchangeError)
        const errorParams = new URLSearchParams({
          error: "exchange_failed",
          error_description: exchangeError.message,
        })
        return NextResponse.redirect(new URL(`/auth/auth-code-error?${errorParams}`, requestUrl.origin))
      }

      if (data.user) {
        console.log("User authenticated successfully:", data.user.email)

        // Check if user profile exists in our users table
        const { data: userProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("email", data.user.email)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 is "not found" error, which is expected for new users
          console.error("Error checking user profile:", profileError)
        }

        if (!userProfile) {
          console.log("Creating user profile...")
          const { error: insertError } = await supabase.from("users").insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || "",
            phone: data.user.user_metadata?.phone || null,
          })

          if (insertError) {
            console.error("Error creating user profile:", insertError)
            // Don't fail the auth flow for profile creation errors
          }
        }

        console.log("Redirecting to dashboard...")
        return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
      }
    } catch (err) {
      console.error("Unexpected error in auth callback:", err)
      const errorParams = new URLSearchParams({
        error: "unexpected_error",
        error_description: "An unexpected error occurred during authentication",
      })
      return NextResponse.redirect(new URL(`/auth/auth-code-error?${errorParams}`, requestUrl.origin))
    }
  }

  // No code and no error - redirect to login
  console.log("No code or error, redirecting to login")
  return NextResponse.redirect(new URL("/auth/login", requestUrl.origin))
}

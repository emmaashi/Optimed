"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0">
            <CardContent className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Check your email</h2>
              <p className="text-slate-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the
                instructions to reset your password.
              </p>
              <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Link href="/auth/login">Back to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-slate-600">Enter your email to receive a reset link</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Forgot Password</CardTitle>
            <CardDescription className="text-center">We'll send you a link to reset your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

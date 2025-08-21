"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Heart, Clock, MapPin, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      router.push(`/auth/signup?email=${encodeURIComponent(email)}`)
    } else {
      router.push("/auth/signup")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-emerald-50">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Optimed</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Features
            </Link>
            <Link href="/hospitals" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Hospitals
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Help
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-4 py-2 flex items-center gap-2">
                Sign up <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mx-auto">
          Healthcare Access.
          <br />
          Without The Wait.
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Optimed is your healthcare companion that helps you find the shortest wait times, join virtual queues, and
          access medical care when you need it most.
        </p>

        <div className="mt-12 max-w-md mx-auto">
          <form onSubmit={handleGetStarted} className="flex gap-2 items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg">
              Get Started
            </Button>
          </form>
        </div>

        {/* Simple feature icons */}
        <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 text-gray-600">
            <Clock className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">Real-time Updates</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium">Find Nearby Care</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <Shield className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium">Secure & Private</span>
          </div>
        </div>
      </section>
    </div>
  )
}

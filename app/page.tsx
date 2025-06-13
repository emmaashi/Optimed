"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Heart, Clock, MapPin, Shield, Check } from "lucide-react"
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
            <Link href="/pricing" className="text-gray-700 hover:text-emerald-600 transition-colors">
              Pricing
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
          <form onSubmit={handleGetStarted} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg">
              Get Started
            </Button>
          </form>
        </div>

        {/* Modern Features Section */}
        <div className="mt-24 relative">
          {/* Background decorative element */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 opacity-50 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Feature 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-100 to-emerald-200 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-5">
                  <Clock className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Skip The Wait</h3>
                <p className="text-gray-600 mb-4">
                  Join virtual queues at hospitals and clinics to reduce your waiting time.
                </p>
                <ul className="mt-auto space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>Join queues remotely</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    <span>Real-time position updates</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-5">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Find Care Nearby</h3>
                <p className="text-gray-600 mb-4">
                  Locate hospitals and clinics with the shortest wait times near you.
                </p>
                <ul className="mt-auto space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>GPS-based recommendations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>Compare wait times</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-5">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure Health Profile</h3>
                <p className="text-gray-600 mb-4">
                  Store your medical information securely for quick access during emergencies.
                </p>
                <ul className="mt-auto space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span>Emergency access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Trusted by patients across the country</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote:
                "Optimed saved me hours of waiting at the ER. I checked in from home and arrived just in time for my turn.",
              author: "Sarah M.",
              role: "Patient",
            },
            {
              quote:
                "As a busy parent, being able to see wait times at different clinics helps me plan better for my kids' appointments.",
              author: "Michael T.",
              role: "Parent",
            },
            {
              quote:
                "The virtual queue system is revolutionary. I was able to wait comfortably at home instead of in a crowded waiting room.",
              author: "Elena K.",
              role: "Patient",
            },
          ].map((testimonial, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-md rounded-lg p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-emerald-600" />
              <span className="font-bold">Optimed</span>
            </div>
            <p className="text-sm text-gray-600">Making healthcare accessible and efficient for everyone.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-emerald-600">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/hospitals" className="text-gray-600 hover:text-emerald-600">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-emerald-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-emerald-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-emerald-600">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-emerald-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-emerald-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-emerald-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 Optimed. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

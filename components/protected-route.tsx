    "use client"

    import type React from "react"

    import { useEffect } from "react"
    import { useRouter } from "next/navigation"
    import { useAuth } from "@/components/auth-provider"
    import { Loader2 } from "lucide-react"

    interface ProtectedRouteProps {
    children: React.ReactNode
    }

    export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
        router.push("/auth/login")
        }
    }, [user, loading, router])

    if (loading) {
        return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
            </div>
        </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
    }

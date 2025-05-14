"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./context/AuthContext"

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === "admin") {
          router.push("/admin-dashboard")
        } else if (user.role === "support") {
          router.push("/support-dashboard")
        } else {
          router.push("/dashboard")
        }
      } else {
        router.push("/signin")
      }
    }
  }, [user, loading, router])

  return null
}

"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState("light")
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user") //TODO: PUll from API/DB - JWT
    const storedTheme = localStorage.getItem("theme")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    if (storedTheme) {
      setTheme(storedTheme)
      document.documentElement.classList.toggle("dark", storedTheme === "dark")
    }

    setLoading(false)
  }, [])

  // Handle redirects based on auth state
  useEffect(() => {
    if (loading) return

    const publicRoutes = ["/signin", "/register", "/forgot-password"]
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!user && !isPublicRoute) {
      router.push("/signin")
    } else if (user && isPublicRoute) {
      redirectBasedOnRole(user.role)
    }
  }, [user, loading, pathname, router])

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case "admin":
        router.push("/admin-dashboard")
        break
      case "support":
        router.push("/support-dashboard")
        break
      default:
        router.push("/dashboard")
        break
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("user")
    router.push("/signin")
  }

  const value = {
    logout,
    loading,
    theme,
    toggleTheme,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

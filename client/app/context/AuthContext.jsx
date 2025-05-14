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

  const login = (email, password, remember) => {
    // Admin hardcoded credentials
    if (email === "admin@example.com" && password === "admin123") {
      const adminUser = {
        id: "admin1",
        email,
        name: "Administrator",
        role: "admin",
      }
      setUser(adminUser)
      if (remember) {
        localStorage.setItem("user", JSON.stringify(adminUser))
      }
      router.push("/admin-dashboard")
      return adminUser
    }

    // Support hardcoded credentials
    if (email === "support@example.com" && password === "support123") {
      const supportUser = {
        id: "support1",
        email,
        name: "Support Agent",
        role: "support",
      }
      setUser(supportUser)
      if (remember) {
        localStorage.setItem("user", JSON.stringify(supportUser))
      }
      router.push("/support-dashboard")
      return supportUser
    }

    // Regular user
    const regularUser = {
      id: "user" + Math.floor(Math.random() * 1000),
      email,
      name: email.split("@")[0],
      role: "user",
    }
    setUser(regularUser)
    if (remember) {
      localStorage.setItem("user", JSON.stringify(regularUser))
    }
    router.push("/dashboard")
    return regularUser
  }

  const register = (email, password) => {
    const newUser = {
      id: "user" + Math.floor(Math.random() * 1000),
      email,
      name: email.split("@")[0],
      role: "user",
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    router.push("/dashboard")
    return newUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/signin")
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    theme,
    toggleTheme,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (name: string, email: string) => void
  logout: () => void
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("specwise_user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  const login = (name: string, email: string) => {
    const newUser = { name, email, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff` }
    setUser(newUser)
    localStorage.setItem("specwise_user", JSON.stringify(newUser))
    setShowLoginModal(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("specwise_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, showLoginModal, setShowLoginModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}


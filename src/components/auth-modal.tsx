"use client"

import { useState } from "react"
import { X, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function AuthModal() {
  const { showLoginModal, setShowLoginModal, login } = useAuth()
  const [step, setStep] = useState<"initial" | "form">("initial")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  if (!showLoginModal) return null

  const handleGoogleLogin = () => {
    setStep("form")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.trim() && email.includes("@")) {
      login(name.trim(), email.trim())
      setStep("initial")
      setName("")
      setEmail("")
    }
  }

  const handleClose = () => {
    setShowLoginModal(false)
    setStep("initial")
    setName("")
    setEmail("")
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md" 
        onClick={handleClose} 
      />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-8 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Abstract Background Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/10 blur-[80px]" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 z-50 rounded-full bg-white/5 p-2 text-white/40 transition-all hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative z-10">
          {step === "initial" ? (
            <>
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                  <span className="font-display text-2xl font-black text-primary-foreground italic">S</span>
                </div>
                <h2 className="mt-8 font-display text-3xl font-black tracking-tight text-white uppercase">Spec<span className="text-primary italic">Wise</span></h2>
                <p className="mt-3 text-sm font-medium text-muted-foreground/60">
                  Unlock the full power of data-driven tech reviews
                </p>
              </div>

              {/* Login Options */}
              <div className="mt-10 space-y-4">
                <button
                  onClick={handleGoogleLogin}
                  className="group relative flex w-full items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold transition-all hover:bg-white/10 hover:border-white/10 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={handleGoogleLogin}
                  className="flex w-full items-center justify-center gap-4 rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold transition-all hover:bg-white/10 hover:border-white/10 active:scale-[0.98]"
                >
                  <Mail className="h-5 w-5 text-white/40" />
                  Continue with Email
                </button>
              </div>

              <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">
                <div className="h-px flex-1 bg-white/5" />
                <span>Registry Protocol</span>
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <p className="mt-8 text-center text-[10px] leading-relaxed text-muted-foreground/40">
                Authorized access only. By proceeding, you agree to the <span className="text-white/60">Registry Terms</span> and <span className="text-white/60">Privacy Core</span>.
              </p>
            </>
          ) : (
            <>
              {/* Sign In Form */}
              <div className="text-center">
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white">Registry <span className="text-primary italic">Entry</span></h2>
                <p className="mt-2 text-sm font-medium text-muted-foreground/60">Assign your identity to the grid</p>
              </div>

              <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Identity Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. CASE_NEUROMANCER"
                    className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold placeholder:text-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1">Core Address (Email)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@grid.nexus"
                    className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold placeholder:text-white/10 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    required
                  />
                </div>
                <Button type="submit" className="w-full rounded-2xl py-7 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                  Execute Entry
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("initial")}
                  className="w-full text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-white/60 transition-colors"
                >
                  ← Terminate Session
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


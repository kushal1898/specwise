import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { SpecWiseProvider } from '@/lib/specwise-context'
import { AnalyticsProvider } from '@/lib/analytics-context'
import { Toaster } from '@/components/ui/sonner'
import '@/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <SpecWiseProvider>
            <AnalyticsProvider>
              <App />
              <Toaster position="top-right" richColors />
            </AnalyticsProvider>
          </SpecWiseProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
)


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthProvider from "./auth-provider"
import ConvexClientProvider from "@/components/convex-provider"
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LBS School Fee Receipt Generator",
  description: "Generate official fee receipts for LBS Sr.Sec. School",
  icons: {
    icon: "/android-chrome-192x192.png",
    apple: "/apple-touch-icon.png",
  },
}

// ✅ New export for themeColor (fix warning)
export const viewport = {
  themeColor: "#ffd37c",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ffd37c" />
      </head>
      <body className={inter.className}>
        <Toaster
          toastOptions={{
            style: {
              background: '#f7fafc',
              color: '#1a202c',
            }
          }}
          position="top-center"
          reverseOrder={true}
        />
        <ConvexClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}

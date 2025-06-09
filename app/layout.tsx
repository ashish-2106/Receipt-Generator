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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster
                    toastOptions={{
                        style: {
                            background: '#f7fafc', // Dark theme background
                            color: '#1a202c',      // Light text color
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

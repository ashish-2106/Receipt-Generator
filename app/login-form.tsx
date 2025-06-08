"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, School } from "lucide-react"

interface LoginFormProps {
    onAuthSuccess: () => void
}

export default function LoginForm({ onAuthSuccess }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await signInWithEmailAndPassword(auth, email, password)
            onAuthSuccess()
        } catch (error: any) {
            setError("Invalid email or password. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side – Image + Tagline */}
            <div className="hidden md:flex w-1/2 bg-black relative items-center justify-center">
                <img
                    src="/school.jpg"
                    alt="School"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                
            </div>

            {/* Right Side – Login Card */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card className="w-full max-w-md bg-white/50 backdrop-blur-md shadow-lg border border-white/30 p-6">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <img src="/logo.png" alt="LBS School Logo" className="w-20 h-20 object-contain" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-blue-800">LBS School</CardTitle>
                        <CardDescription className="text-gray-700">Fee Receipt Generator – Admin Login</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </div>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>




    )
}

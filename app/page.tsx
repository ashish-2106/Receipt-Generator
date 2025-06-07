"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import LoginForm from "./login-form"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOutIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PrinterIcon } from "lucide-react"
import Image from "next/image"

interface ReceiptData {
  receiptNo: string
  studentName: string
  fatherName: string
  studentClass: string
  rollNo: string
  session: string
  feeType: string
  amount: number
  paymentMode: string
  transactionId: string
  remarks: string
  date: string
}

export default function ReceiptGenerator() {
  const { user, loading, logout } = useAuth()
  const [formData, setFormData] = useState<ReceiptData>({
    receiptNo: `RCP${Date.now().toString().slice(-6)}`,
    studentName: "",
    fatherName: "",
    studentClass: "",
    rollNo: "",
    session: "2024-25",
    feeType: "",
    amount: 0,
    paymentMode: "",
    transactionId: "",
    remarks: "",
    date: new Date().toLocaleDateString("en-IN"),
  })

  const [showReceipt, setShowReceipt] = useState(false)

  const handleInputChange = (field: keyof ReceiptData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateReceipt = () => {
    if (!formData.studentName || !formData.fatherName || !formData.studentClass || !formData.amount) {
      alert("Please fill in all required fields")
      return
    }
    setShowReceipt(true)
  }

  const printReceipt = () => {
    window.print()
  }

  const resetForm = () => {
    setFormData({
      receiptNo: `LBS${Date.now().toString().slice(-6)}`,
      studentName: "",
      fatherName: "",
      studentClass: "",
      rollNo: "",
      session: "2024-25",
      feeType: "",
      amount: 0,
      paymentMode: "",
      transactionId: "",
      remarks: "",
      date: new Date().toLocaleDateString("en-IN"),
    })
    setShowReceipt(false)
  }

  const handleLogout = async () => {
    await logout()
    setShowReceipt(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm onAuthSuccess={() => { }} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with user profile dropdown */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="LBS School Logo" className="w-24 h-24 object-contain" />
            <h1 className="text-3xl font-bold text-blue-800">Receipt Generator</h1>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border">
                  <AvatarFallback>{user.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="max-w-[180px] truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Student Fee Details</CardTitle>
              <CardDescription>Enter the student and payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="receiptNo">Receipt No.</Label>
                  <Input
                    id="receiptNo"
                    value={formData.receiptNo}
                    onChange={(e) => handleInputChange("receiptNo", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange("studentName", e.target.value)}
                  placeholder="Enter student's full name"
                />
              </div>

              <div>
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange("fatherName", e.target.value)}
                  placeholder="Enter father's full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentClass">Class *</Label>
                  <Select onValueChange={(value) => handleInputChange("studentClass", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nursery">Nursery</SelectItem>
                      <SelectItem value="LKG">LKG</SelectItem>
                      <SelectItem value="UKG">UKG</SelectItem>
                      <SelectItem value="1st">1st</SelectItem>
                      <SelectItem value="2nd">2nd</SelectItem>
                      <SelectItem value="3rd">3rd</SelectItem>
                      <SelectItem value="4th">4th</SelectItem>
                      <SelectItem value="5th">5th</SelectItem>
                      <SelectItem value="6th">6th</SelectItem>
                      <SelectItem value="7th">7th</SelectItem>
                      <SelectItem value="8th">8th</SelectItem>
                      <SelectItem value="9th">9th</SelectItem>
                      <SelectItem value="10th">10th</SelectItem>
                      <SelectItem value="11th">11th</SelectItem>
                      <SelectItem value="12th">12th</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rollNo">Roll No.</Label>
                  <Input
                    id="rollNo"
                    value={formData.rollNo}
                    onChange={(e) => handleInputChange("rollNo", e.target.value)}
                    placeholder="Enter roll number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="session">Academic Session</Label>
                <Input
                  id="session"
                  value={formData.session}
                  onChange={(e) => handleInputChange("session", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="feeType">Fee Type</Label>
                <Select onValueChange={(value) => handleInputChange("feeType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                    <SelectItem value="Admission Fee">Admission Fee</SelectItem>
                    <SelectItem value="Examination Fee">Examination Fee</SelectItem>
                    <SelectItem value="Transport Fee">Transport Fee</SelectItem>
                    <SelectItem value="Library Fee">Library Fee</SelectItem>
                    <SelectItem value="Sports Fee">Sports Fee</SelectItem>
                    <SelectItem value="Annual Fee">Annual Fee</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ""}
                  onChange={(e) => handleInputChange("amount", Number.parseFloat(e.target.value) || 0)}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select onValueChange={(value) => handleInputChange("paymentMode", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transactionId">Transaction ID / Cheque No.</Label>
                <Input
                  id="transactionId"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange("transactionId", e.target.value)}
                  placeholder="Enter transaction ID or cheque number"
                />
              </div>

              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="Any additional remarks"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={generateReceipt} className="flex-1">
                  Generate Receipt
                </Button>
                <Button onClick={resetForm} variant="outline">
                  Reset Form
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Preview */}
          {showReceipt && (
            <div className="lg:col-span-1">
              <div className="print:shadow-none print:border-none bg-white border rounded-lg p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4 print:hidden">
                  <h2 className="text-xl font-semibold">Receipt Preview</h2>
                  <Button onClick={printReceipt} size="sm">
                    <PrinterIcon className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </div>

                {/* Receipt Content */}
                <div className="receipt-content print:w-full print:p-0">
                  {/* Single Page Border */}
                  <div className="a4-receipt border-2 border-black p-4 print:p-4 relative">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-6">
                        {/* Left side - Logo and School Name */}
                        <div className="flex items-center space-x-4">
                          <img src="/logo.png" alt="LBS School Logo" className="w-24 h-24 object-contain" />
                          <div>
                            <h1 className="text-3xl font-bold text-blue-800">LBS Sr.Sec. School</h1>
                          </div>
                        </div>

                        {/* Right side - Address */}
                        <div className="text-right">
                          <p className="text-sm text-gray-700 font-medium">Bharounda Kalan</p>
                          <p className="text-sm text-gray-700">Jhunjhunu, Rajasthan</p>
                          <p className="text-sm text-gray-700">PIN: 333031</p>
                          <p className="text-xs text-gray-600 mt-1">Phone: +91-9828872632</p>
                        </div>
                      </div>

                      {/* Fee Receipt Banner */}
                      <div className="text-center">
                        <div className="bg-blue-800 text-white py-3 px-6 inline-block rounded-lg shadow-md">
                          <p className="text-xl font-semibold">FEE RECEIPT</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="mb-6" />

                    {/* Receipt Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-300 p-3 rounded bg-gray-50">
                        <strong>Receipt No:</strong> {formData.receiptNo}
                      </div>
                      <div className="border border-gray-300 p-3 rounded bg-gray-50">
                        <strong>Date:</strong> {formData.date}
                      </div>
                    </div>

                    {/* Student Details */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-1">Student Information</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                        <div>
                          <strong>Student Name:</strong> {formData.studentName}
                        </div>
                        <div>
                          <strong>Class:</strong> {formData.studentClass}
                        </div>
                        <div>
                          <strong>Father's Name:</strong> {formData.fatherName}
                        </div>
                        {formData.rollNo && (
                          <div>
                            <strong>Roll No:</strong> {formData.rollNo}
                          </div>
                        )}
                        <div>
                          <strong>Academic Session:</strong> {formData.session}
                        </div>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-1">Payment Details</h3>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                        <div>
                          <strong>Fee Type:</strong> {formData.feeType || "Regular Fee"}
                        </div>
                        <div>
                          <strong>Payment Mode:</strong> {formData.paymentMode || "Cash"}
                        </div>
                        {formData.transactionId && (
                          <div className="col-span-2">
                            <strong>Transaction ID / Reference:</strong> {formData.transactionId}
                          </div>
                        )}
                      </div>

                      <div className="bg-green-50 p-4 rounded border border-green-200 mb-4">
                        <div className="text-xl font-bold text-green-800 mb-1">
                          Amount Paid: ₹{formData.amount.toLocaleString("en-IN")}
                        </div>
                        <div className="text-sm text-green-700">
                          In Words: {numberToWords(formData.amount)} Rupees Only
                        </div>
                      </div>
                    </div>

                    {formData.remarks && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-blue-800 border-b pb-1">Remarks</h3>
                        <p className="italic">{formData.remarks}</p>
                      </div>
                    )}

                    {/* Spacer to push footer to bottom */}
                    <div className="flex-grow min-h-[50px]"></div>

                    {/* Footer */}
                    <div className="footer-section mt-auto">
                      <Separator className="mb-6" />
                      <div className="text-center">
                        <p className="mb-2">This is a system generated receipt and does not require signature.</p>
                        <p className="mb-2">For any queries, please contact the school office.</p>
                        <p className="text-blue-600">Thank you for your payment!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .a4-receipt {
            width: 210mm;
            max-width: 210mm;
            height: 297mm;
            max-height: 297mm;
            margin: 0;
            padding: 15mm;
            box-sizing: border-box;
            position: relative;
            page-break-after: always;
            overflow: hidden;
          }
          
          .footer-section {
            position: absolute;
            bottom: 15mm;
            left: 15mm;
            right: 15mm;
          }
        }
      `}</style>
    </div>
  )
}

// Helper function to convert numbers to words
function numberToWords(num: number): string {
  if (num === 0) return "Zero"

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"]
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

  function convertHundreds(n: number): string {
    let result = ""

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + " Hundred "
      n %= 100
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + " "
      n %= 10
    } else if (n >= 10) {
      result += teens[n - 10] + " "
      return result
    }

    if (n > 0) {
      result += ones[n] + " "
    }

    return result
  }

  if (num < 1000) {
    return convertHundreds(num).trim()
  } else if (num < 100000) {
    return convertHundreds(Math.floor(num / 1000)) + "Thousand " + convertHundreds(num % 1000)
  } else if (num < 10000000) {
    return convertHundreds(Math.floor(num / 100000)) + "Lakh " + convertHundreds(num % 100000)
  } else {
    return convertHundreds(Math.floor(num / 10000000)) + "Crore " + convertHundreds(num % 10000000)
  }
}

"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
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
import ReceiptHistory, { type ReceiptData } from "@/components/receipt-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrinterIcon, Plus, History, Save, LogOutIcon } from "lucide-react"
import toast from "react-hot-toast"

interface FormData {
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
  const [activeTab, setActiveTab] = useState("generate")
  const [formData, setFormData] = useState<FormData>({
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

  const [showReceipt, setShowReceipt] = useState(false)
  const [editingReceipt, setEditingReceipt] = useState<ReceiptData | null>(null)
  const [saving, setSaving] = useState(false)

  // Convex mutations
  const createReceiptMutation = useMutation(api.receipts.createReceipt)
  const updateReceiptMutation = useMutation(api.receipts.updateReceipt)

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateReceipt = async () => {
    if (!formData.studentName || !formData.fatherName || !formData.studentClass || !formData.amount) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSaving(true)

      if (editingReceipt) {
        // Update existing receipt

        await toast.promise(
          updateReceiptMutation({
            id: editingReceipt._id,
            receiptNo: formData.receiptNo,
            studentName: formData.studentName,
            fatherName: formData.fatherName,
            studentClass: formData.studentClass,
            rollNo: formData.rollNo || undefined,
            session: formData.session,
            feeType: formData.feeType,
            amount: formData.amount,
            paymentMode: formData.paymentMode,
            transactionId: formData.transactionId || undefined,
            remarks: formData.remarks || undefined,
            date: formData.date,
          }),
          {
            loading: "Updating receipt...",
            success: "Receipt updated successfully!",
            error: "Failed to update receipt. Please try again.",
          }
        )
      } else {
        // Create new receipt

        await toast.promise(
          createReceiptMutation({
            receiptNo: formData.receiptNo,
            studentName: formData.studentName,
            fatherName: formData.fatherName,
            studentClass: formData.studentClass,
            rollNo: formData.rollNo || undefined,
            session: formData.session,
            feeType: formData.feeType,
            amount: formData.amount,
            paymentMode: formData.paymentMode,
            transactionId: formData.transactionId || undefined,
            remarks: formData.remarks || undefined,
            date: formData.date,
            createdBy: user?.email || "",
          }),
          {
            loading: "Saving receipt...",
            success: "Receipt saved successfully!",
            error: "Error saving receipt. Please try again.",
          }
        )
      }

      setShowReceipt(true)
    } catch (error) {
      console.error("Error saving receipt:", error)
      toast.error("Error saving receipt. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const printReceipt = () => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast.error("Please allow popups to print the receipt")
      return
    }

    // Get the receipt content
    const receiptContent = document.querySelector(".receipt-content")?.innerHTML

    if (!receiptContent) {
      toast.error("Receipt content not found")
      return
    }

    // Create the print HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${formData.receiptNo}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
              print-color-adjust: exact;
            }
            
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              color: black;
              font-size: 12pt;
              line-height: 1.4;
            }
            
            .receipt-content {
              width: 100%;
              margin: 0;
              padding: 0;
            }
            
            .a4-receipt {
              width: 100%;
              padding: 20px;
              border: 2px solid black;
              position: relative;
              background: white;
            }
            
            .flex {
              display: flex;
            }
            
            .justify-between {
              justify-content: space-between;
            }
            
            .items-start {
              align-items: flex-start;
            }
            
            .items-center {
              align-items: center;
            }
            
            .space-x-4 > * + * {
              margin-left: 1rem;
            }
            
            .mb-6 {
              margin-bottom: 1.5rem;
            }
            
            .mb-4 {
              margin-bottom: 1rem;
            }
            
            .mb-3 {
              margin-bottom: 0.75rem;
            }
            
            .mb-2 {
              margin-bottom: 0.5rem;
            }
            
            .mb-1 {
              margin-bottom: 0.25rem;
            }
            
            .mt-1 {
              margin-top: 0.25rem;
            }
            
            .mt-2 {
              margin-top: 0.5rem;
            }
            
            .mt-auto {
              margin-top: auto;
            }
            
            .p-3 {
              padding: 0.75rem;
            }
            
            .p-4 {
              padding: 1rem;
            }
            
            .px-6 {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
            
            .py-3 {
              padding-top: 0.75rem;
              padding-bottom: 0.75rem;
            }
            
            .pb-1 {
              padding-bottom: 0.25rem;
            }
            
            .text-3xl {
              font-size: 1.875rem;
              line-height: 2.25rem;
            }
            
            .text-xl {
              font-size: 1.25rem;
              line-height: 1.75rem;
            }
            
            .text-lg {
              font-size: 1.125rem;
              line-height: 1.75rem;
            }
            
            .text-sm {
              font-size: 0.875rem;
              line-height: 1.25rem;
            }
            
            .text-xs {
              font-size: 0.75rem;
              line-height: 1rem;
            }
            
            .font-bold {
              font-weight: 700;
            }
            
            .font-semibold {
              font-weight: 600;
            }
            
            .font-medium {
              font-weight: 500;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-right {
              text-align: right;
            }
            
            .text-blue-800 {
              color: #1e40af;
            }
            
            .text-green-800 {
              color: #166534;
            }
            
            .text-green-700 {
              color: #15803d;
            }
            
            .text-blue-600 {
              color: #2563eb;
            }
            
            .text-gray-700 {
              color: #374151;
            }
            
            .text-gray-600 {
              color: #4b5563;
            }
            
            .bg-blue-800 {
              background-color: #1e40af;
              color: white;
            }
            
            .bg-gray-50 {
              background-color: #f9fafb;
            }
            
            .bg-green-50 {
              background-color: #f0fdf4;
            }
            
            .border {
              border-width: 1px;
              border-style: solid;
            }
            
            .border-2 {
              border-width: 2px;
            }
            
            .border-black {
              border-color: black;
            }
            
            .border-gray-300 {
              border-color: #d1d5db;
            }
            
            .border-green-200 {
              border-color: #bbf7d0;
            }
            
            .border-b {
              border-bottom-width: 1px;
              border-bottom-style: solid;
            }
            
            .rounded {
              border-radius: 0.25rem;
            }
            
            .rounded-lg {
              border-radius: 0.5rem;
            }
            
            .shadow-md {
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .grid {
              display: grid;
            }
            
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            .gap-4 {
              gap: 1rem;
            }
            
            .gap-x-6 {
              column-gap: 1.5rem;
            }
            
            .gap-y-3 {
              row-gap: 0.75rem;
            }
            
            .col-span-2 {
              grid-column: span 2 / span 2;
            }
            
            .w-24 {
              width: 6rem;
            }
            
            .h-24 {
              height: 6rem;
            }
            
            .object-contain {
              object-fit: contain;
            }
            
            .inline-block {
              display: inline-block;
            }
            
            .italic {
              font-style: italic;
            }
            
            .min-h-\\[50px\\] {
              min-height: 50px;
            }
            
            .flex-grow {
              flex-grow: 1;
            }
            
            .footer-section {
              margin-top: 10px;
            }
            
            hr {
              border: none;
              border-top: 1px solid #e5e7eb;
              margin: 1rem 0;
            }
            
            @media print {
              @page {
                size: A4;
                margin: 0.5in;
              }
              
              body {
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-content">
            ${receiptContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `

    // Write the HTML to the new window
    printWindow.document.write(printHTML)
    printWindow.document.close()
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
    setEditingReceipt(null)
  }

  const handleLogout = async () => {
    await logout()
    setShowReceipt(false)
    resetForm()
    setActiveTab("generate")
  }

  const handleEditReceipt = (receipt: ReceiptData) => {
    setFormData({
      receiptNo: receipt.receiptNo,
      studentName: receipt.studentName,
      fatherName: receipt.fatherName,
      studentClass: receipt.studentClass,
      rollNo: receipt.rollNo || "",
      session: receipt.session,
      feeType: receipt.feeType,
      amount: receipt.amount,
      paymentMode: receipt.paymentMode,
      transactionId: receipt.transactionId || "",
      remarks: receipt.remarks || "",
      date: receipt.date,
    })
    setEditingReceipt(receipt)
    setShowReceipt(false)
    setActiveTab("generate")
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
      <div className="max-w-6xl mx-auto">
        {/* Header with user profile dropdown */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div className="text-center flex-1">
           <div className="flex items-center space-x-1">
            <img src="/logo.png" alt="LBS School Logo" className="w-24 h-24 object-contain" />
            <h1 className="text-xl font-bold text-blue-800">Receipt Generator</h1>
          </div>

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
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="print:hidden">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingReceipt ? "Edit Receipt" : "Generate Receipt"}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Receipt History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {editingReceipt ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingReceipt ? "Edit Receipt Details" : "Student Fee Details"}
                  </CardTitle>
                  <CardDescription>
                    {editingReceipt
                      ? "Update the student and payment information"
                      : "Enter the student and payment information"}
                  </CardDescription>
                  {editingReceipt && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Editing Receipt: <strong>{editingReceipt.receiptNo}</strong>
                      </p>
                      <Button variant="outline" size="sm" onClick={resetForm} className="mt-2">
                        Cancel Edit
                      </Button>
                    </div>
                  )}
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
                      <Input
                        id="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                      />
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
                      <Select
                        value={formData.studentClass}
                        onValueChange={(value) => handleInputChange("studentClass", value)}
                      >
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
                    <Select value={formData.feeType} onValueChange={(value) => handleInputChange("feeType", value)}>
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
                    <Select
                      value={formData.paymentMode}
                      onValueChange={(value) => handleInputChange("paymentMode", value)}
                    >
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
                    <Button onClick={generateReceipt} className="flex-1" disabled={saving}>
                      {saving ? "Saving..." : editingReceipt ? "Update & Preview" : "Generate Receipt"}
                    </Button>
                    <Button onClick={resetForm} variant="outline">
                      Reset Form
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Receipt Preview */}
              {showReceipt && (
                <div className="lg:col-span-1 receipt-container">
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
                          <h3 className="text-lg font-semibold mb-3 text-blue-800 border-b pb-1">
                            Student Information
                          </h3>
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
          </TabsContent>

          <TabsContent value="history">
            <ReceiptHistory userEmail={user.email || ""} onEditReceipt={handleEditReceipt} />
          </TabsContent>
        </Tabs>
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
            bottom: 10mm;
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

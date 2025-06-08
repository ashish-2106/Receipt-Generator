"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Search, Calendar, IndianRupee } from "lucide-react"

export interface ReceiptData {
  _id: Id<"receipts">
  receiptNo: string
  studentName: string
  fatherName: string
  studentClass: string
  rollNo?: string
  session: string
  feeType: string
  amount: number
  paymentMode: string
  transactionId?: string
  remarks?: string
  date: string
  createdBy: string
  createdAt: number
}

interface ReceiptHistoryProps {
  userEmail: string
  onEditReceipt: (receipt: ReceiptData) => void
}

export default function ReceiptHistory({ userEmail, onEditReceipt }: ReceiptHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch receipts using Convex query
  const receipts = useQuery(api.receipts.getReceiptsByUser, { userEmail }) || []
  const stats = useQuery(api.receipts.getReceiptStats, { userEmail })

  // Delete mutation
  const deleteReceiptMutation = useMutation(api.receipts.deleteReceipt)

  // Filter receipts based on search term
  const filteredReceipts = useMemo(() => {
    if (!searchTerm) return receipts

    const searchLower = searchTerm.toLowerCase()
    return receipts.filter(
      (receipt) =>
        receipt.studentName.toLowerCase().includes(searchLower) ||
        receipt.receiptNo.toLowerCase().includes(searchLower) ||
        receipt.studentClass.toLowerCase().includes(searchLower) ||
        receipt.fatherName.toLowerCase().includes(searchLower),
    )
  }, [receipts, searchTerm])

  const handleDeleteReceipt = async (id: Id<"receipts">) => {
    try {
      await deleteReceiptMutation({ id })
    } catch (error) {
      console.error("Error deleting receipt:", error)
      alert("Error deleting receipt. Please try again.")
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN")
  }

  if (receipts === undefined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Receipt History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
            <span className="ml-2">Loading receipts...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Receipt History
        </CardTitle>
        <CardDescription>View, edit, and manage all generated receipts</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name, receipt no, class, or father's name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-blue-600">Total Receipts</p>
                <p className="text-2xl font-bold text-blue-800">{stats?.totalReceipts || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <IndianRupee className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-green-600">Total Amount</p>
                <p className="text-2xl font-bold text-green-800">
                  ₹{(stats?.totalAmount || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Search className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-purple-600">Filtered Results</p>
                <p className="text-2xl font-bold text-purple-800">{filteredReceipts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Receipts Table */}
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {receipts.length === 0
                ? "No receipts found. Generate your first receipt!"
                : "No receipts match your search."}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.map((receipt) => (
                  <TableRow key={receipt._id}>
                    <TableCell className="font-medium">{receipt.receiptNo}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{receipt.studentName}</p>
                        <p className="text-sm text-gray-500">Father: {receipt.fatherName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{receipt.studentClass}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">₹{receipt.amount.toLocaleString("en-IN")}</TableCell>
                    <TableCell>{formatDate(receipt.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{receipt.feeType || "Regular Fee"}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onEditReceipt(receipt)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Receipt</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete receipt {receipt.receiptNo} for {receipt.studentName}?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReceipt(receipt._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

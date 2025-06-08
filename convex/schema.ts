import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  receipts: defineTable({
    receiptNo: v.string(),
    studentName: v.string(),
    fatherName: v.string(),
    studentClass: v.string(),
    rollNo: v.optional(v.string()),
    session: v.string(),
    feeType: v.string(),
    amount: v.number(),
    paymentMode: v.string(),
    transactionId: v.optional(v.string()),
    remarks: v.optional(v.string()),
    date: v.string(),
    createdBy: v.string(), // User email
    createdAt: v.number(), // Timestamp
  })
    .index("by_user", ["createdBy"])
    .index("by_receipt_no", ["receiptNo"])
    .index("by_created_at", ["createdAt"]),
})

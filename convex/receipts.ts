import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Create a new receipt
export const createReceipt = mutation({
  args: {
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
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const receiptId = await ctx.db.insert("receipts", {
      ...args,
      createdAt: Date.now(),
    })
    return receiptId
  },
})

// Get all receipts for a user
export const getReceiptsByUser = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const receipts = await ctx.db
      .query("receipts")
      .withIndex("by_user", (q) => q.eq("createdBy", args.userEmail))
      .order("desc")
      .collect()
    return receipts
  },
})

// Update a receipt
export const updateReceipt = mutation({
  args: {
    id: v.id("receipts"),
    receiptNo: v.optional(v.string()),
    studentName: v.optional(v.string()),
    fatherName: v.optional(v.string()),
    studentClass: v.optional(v.string()),
    rollNo: v.optional(v.string()),
    session: v.optional(v.string()),
    feeType: v.optional(v.string()),
    amount: v.optional(v.number()),
    paymentMode: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    remarks: v.optional(v.string()),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    await ctx.db.patch(id, updates)
    return id
  },
})

// Delete a receipt
export const deleteReceipt = mutation({
  args: { id: v.id("receipts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
    return args.id
  },
})

// Search receipts
export const searchReceipts = query({
  args: {
    userEmail: v.string(),
    searchTerm: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let receipts = await ctx.db
      .query("receipts")
      .withIndex("by_user", (q) => q.eq("createdBy", args.userEmail))
      .order("desc")
      .collect()

    if (args.searchTerm) {
      const searchLower = args.searchTerm.toLowerCase()
      receipts = receipts.filter(
        (receipt) =>
          receipt.studentName.toLowerCase().includes(searchLower) ||
          receipt.receiptNo.toLowerCase().includes(searchLower) ||
          receipt.studentClass.toLowerCase().includes(searchLower) ||
          receipt.fatherName.toLowerCase().includes(searchLower),
      )
    }

    return receipts
  },
})

// Get receipt statistics
export const getReceiptStats = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const receipts = await ctx.db
      .query("receipts")
      .withIndex("by_user", (q) => q.eq("createdBy", args.userEmail))
      .collect()

    const totalReceipts = receipts.length
    const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0)

    return {
      totalReceipts,
      totalAmount,
    }
  },
})

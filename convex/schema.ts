import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Products table for e-commerce items
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    stock: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_price", ["price"]),

  // Cart items table - persists across sessions
  cartItems: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});

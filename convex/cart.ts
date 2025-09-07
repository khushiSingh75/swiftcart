import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get current user's cart items with product details
export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get product details for each cart item
    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return cartWithProducts.filter((item) => item.product !== null);
  },
});

// Add item to cart or update quantity if already exists
export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to add items to cart");
    }

    // Check if product exists
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    // Check if item already in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user_and_product", (q) =>
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .unique();

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
      return existingItem._id;
    } else {
      // Add new item
      return await ctx.db.insert("cartItems", {
        userId,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

// Update cart item quantity
export const updateQuantity = mutation({
  args: {
    cartItemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cartItems"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== userId) {
      throw new Error("Cart item not found");
    }

    await ctx.db.delete(args.cartItemId);
  },
});

// Clear entire cart
export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});

// Get cart summary (total items and total price)
export const getCartSummary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { totalItems: 0, totalPrice: 0 };
    }

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cartItems) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        totalItems += item.quantity;
        totalPrice += product.price * item.quantity;
      }
    }

    return { totalItems, totalPrice };
  },
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

// Get all products with optional filters
export const list = query({
  args: {
    category: v.optional(v.string()),
    minPrice: v.optional(v.number()),
    maxPrice: v.optional(v.number()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Get all products first, then filter by price if needed
    let products;
    
    // Apply category filter
    if (args.category) {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category as string))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }

    // Apply price filters
    if (args.minPrice !== undefined || args.maxPrice !== undefined) {
      products = products.filter((product) => {
        if (args.minPrice !== undefined && product.price < args.minPrice) {
          return false;
        }
        if (args.maxPrice !== undefined && product.price > args.maxPrice) {
          return false;
        }
        return true;
      });
    }

    // Sort by price (ascending)
    products.sort((a, b) => a.price - b.price);

    return products;
  },
});

// Get unique categories for filter dropdown
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = [...new Set(products.map((p) => p.category))];
    return categories.sort();
  },
});

// Get single product by ID
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Admin function to add products (for demo purposes)
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    imageUrl: v.optional(v.string()),
    stock: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

// Seed some demo products
export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return "Products already exist";
    }

    const demoProducts = [
      {
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 199.99,
        category: "Electronics",
        stock: 50,
      },
      {
        name: "Coffee Mug",
        description: "Ceramic coffee mug with ergonomic handle",
        price: 12.99,
        category: "Home & Kitchen",
        stock: 100,
      },
      {
        name: "Running Shoes",
        description: "Comfortable running shoes for daily exercise",
        price: 89.99,
        category: "Sports",
        stock: 30,
      },
      {
        name: "Smartphone",
        description: "Latest smartphone with advanced camera features",
        price: 699.99,
        category: "Electronics",
        stock: 25,
      },
      {
        name: "Yoga Mat",
        description: "Non-slip yoga mat for home workouts",
        price: 29.99,
        category: "Sports",
        stock: 75,
      },
      {
        name: "Desk Lamp",
        description: "LED desk lamp with adjustable brightness",
        price: 45.99,
        category: "Home & Kitchen",
        stock: 40,
      },
      {
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with rich sound",
        price: 79.99,
        category: "Electronics",
        stock: 60,
      },
      {
        name: "Water Bottle",
        description: "Insulated water bottle keeps drinks cold for 24 hours",
        price: 24.99,
        category: "Sports",
        stock: 80,
      },
    ];

    for (const product of demoProducts) {
      await ctx.db.insert("products", product);
    }

    return "Demo products created successfully";
  },
});

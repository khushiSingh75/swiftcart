import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ProductList } from "./components/ProductList";
import { Cart } from "./components/Cart";
import { useState } from "react";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"products" | "cart">("products");
  const cartSummary = useQuery(api.cart.getCartSummary);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">ShopEasy</h1>
          
          <Authenticated>
            <nav className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage("products")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === "products"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setCurrentPage("cart")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  currentPage === "cart"
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                Cart
                {cartSummary && cartSummary.totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartSummary.totalItems}
                  </span>
                )}
              </button>
              <SignOutButton />
            </nav>
          </Authenticated>

          <Unauthenticated>
            <div className="text-sm text-gray-600">
              Sign in to start shopping
            </div>
          </Unauthenticated>
        </div>
      </header>

      <main className="flex-1">
        <Content currentPage={currentPage} />
      </main>
      
      <Toaster />
    </div>
  );
}

function Content({ currentPage }: { currentPage: "products" | "cart" }) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Authenticated>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {loggedInUser?.email?.split("@")[0] ?? "friend"}!
          </h2>
          <p className="text-gray-600">
            {currentPage === "products" 
              ? "Discover amazing products at great prices" 
              : "Review your cart and manage your items"
            }
          </p>
        </div>
        
        {currentPage === "products" ? <ProductList /> : <Cart />}
      </Authenticated>

      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to ShopEasy
            </h2>
            <p className="text-gray-600">
              Sign in to browse products and start shopping
            </p>
          </div>
          <SignInForm />
        </div>
      </Unauthenticated>
    </div>
  );
}

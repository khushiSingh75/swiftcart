import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

export function Cart() {
  const cartItems = useQuery(api.cart.getCartItems) ?? [];
  const cartSummary = useQuery(api.cart.getCartSummary);
  
  const updateQuantity = useMutation(api.cart.updateQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

  const handleQuantityChange = async (cartItemId: Id<"cartItems">, newQuantity: number) => {
    try {
      await updateQuantity({ cartItemId, quantity: newQuantity });
      if (newQuantity === 0) {
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (cartItemId: Id<"cartItems">) => {
    try {
      await removeFromCart({ cartItemId });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart({});
      toast.success("Cart cleared");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (cartItems === undefined || cartSummary === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5M7 13l-1.1 5m0 0h9.1M6 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">
          Start shopping to add items to your cart.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
        <button
          onClick={handleClearCart}
          className="px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item._id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.product?.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.product?.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {item.product?.category}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      ${item.product?.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-lg font-bold text-gray-900">
                      ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-medium">Total Items:</span>
            <span>{cartSummary.totalItems}</span>
          </div>
          
          <div className="flex justify-between items-center text-xl font-bold border-t pt-4">
            <span>Total Price:</span>
            <span className="text-primary">${cartSummary.totalPrice.toFixed(2)}</span>
          </div>
          
          <button className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold">
            Proceed to Checkout
          </button>
          
          <p className="text-sm text-gray-500 text-center">
            * Checkout functionality not implemented in this demo
          </p>
        </div>
      </div>
    </div>
  );
}

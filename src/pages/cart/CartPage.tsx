
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import CartItem from "./components/CartItem";
import OrderSummary from "./components/OrderSummary";
import { useCart } from "./hooks/useCart";

const CartPage = () => {
  const { user } = useAuth();
  const { 
    cartItems, 
    isLoading, 
    updateQuantityMutation, 
    deleteItemMutation, 
    createOrderMutation,
    calculateTotal 
  } = useCart();

  const handleUpdateQuantity = (id: string, currentQuantity: number, increment: boolean) => {
    const newQuantity = increment ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ id, quantity: newQuantity });
  };

  const handleCheckout = () => {
    createOrderMutation.mutate();
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your cart</h1>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 pt-24">
          <div className="text-center">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        {cartItems?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems?.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onDelete={(id) => deleteItemMutation.mutate(id)}
                />
              ))}
            </div>
            <div className="lg:col-span-1">
              <OrderSummary
                total={calculateTotal()}
                onCheckout={handleCheckout}
                isProcessing={createOrderMutation.isPending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

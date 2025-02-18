
import { Button } from "@/components/ui/button";

interface OrderSummaryProps {
  total: number;
  onCheckout: () => void;
  isProcessing: boolean;
}

const OrderSummary = ({ total, onCheckout, isProcessing }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₦{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <Button 
        className="w-full mt-6"
        onClick={onCheckout}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Proceed to Checkout"}
      </Button>
    </div>
  );
};

export default OrderSummary;

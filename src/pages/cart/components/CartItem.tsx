
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: string, currentQuantity: number, increment: boolean) => void;
  onDelete: (id: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onDelete }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex-grow">
        <h3 className="font-medium">{item.product.name}</h3>
        <p className="text-sm text-gray-500">Size: {item.size}</p>
        <p className="text-accent mt-1">₦{item.product.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity, false)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onUpdateQuantity(item.id, item.quantity, true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-4 text-red-500 hover:text-red-600"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

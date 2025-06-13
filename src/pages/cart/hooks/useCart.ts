
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { dataService } from "@/services/dataService";

export const useCart = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use mock user if in mock mode and no real user
  const activeUser = user || dataService.getCurrentUser();

  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart', activeUser?.id],
    queryFn: async () => {
      if (!activeUser) return [];
      return await dataService.getCartItems(activeUser.id);
    },
    enabled: !!activeUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', activeUser?.id] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', activeUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartCount', activeUser?.id] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!activeUser || !cartItems) throw new Error("User not authenticated or cart is empty");
      
      const total = calculateTotal();
      if (total <= 0) throw new Error("Cart is empty");

      return await dataService.createOrder(activeUser.id, cartItems, total);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', activeUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['cartCount', activeUser?.id] });
      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const calculateTotal = () => {
    return cartItems?.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0) ?? 0;
  };

  return {
    cartItems,
    isLoading,
    updateQuantityMutation,
    deleteItemMutation,
    createOrderMutation,
    calculateTotal,
  };
};

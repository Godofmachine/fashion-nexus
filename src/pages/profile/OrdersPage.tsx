
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  CheckCircle,
  Truck,
  Package,
  Clock,
  PackageX,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

const OrdersPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ['userOrders', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          created_at, 
          status, 
          total_amount, 
          shipping_address,
          order_items (
            id,
            quantity,
            price_at_time,
            size,
            products (
              id,
              name,
              images
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <PackageX className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders?.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="h-6 w-6" />
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
        
        <Tabs 
          defaultValue="all"
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="text-center py-10">Loading your orders...</div>
            ) : filteredOrders?.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No orders found in this category.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders?.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order Placed</p>
                          <p className="font-medium">{formatDate(order.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order ID</p>
                          <p className="font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-medium">₦{order.total_amount.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="items">
                          <AccordionTrigger className="px-6 py-3">
                            <span className="font-medium">
                              {order.order_items.length} {order.order_items.length === 1 ? 'Item' : 'Items'}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-4">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                  <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                    <img 
                                      src={item.products.images[0]} 
                                      alt={item.products.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-grow">
                                    <p className="font-medium">{item.products.name}</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                      <p>Size: {item.size}</p>
                                      <p>Qty: {item.quantity}</p>
                                      <p>₦{item.price_at_time.toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="tracking">
                          <AccordionTrigger className="px-6 py-3">
                            <span className="font-medium">Delivery Status</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                              <div className="space-y-6">
                                <div className="relative flex items-start gap-4">
                                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${order.status !== 'cancelled' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <CheckCircle className={`h-5 w-5 ${order.status !== 'cancelled' ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex-1 pt-1">
                                    <p className="font-medium">Order Placed</p>
                                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                                  </div>
                                </div>
                                
                                <div className="relative flex items-start gap-4">
                                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Package className={`h-5 w-5 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-blue-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex-1 pt-1">
                                    <p className="font-medium">Processing</p>
                                    <p className="text-sm text-gray-500">
                                      {order.status === 'pending' ? 'Soon' : 'Your order is being prepared'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="relative flex items-start gap-4">
                                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${['shipped', 'delivered'].includes(order.status) ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                    <Truck className={`h-5 w-5 ${['shipped', 'delivered'].includes(order.status) ? 'text-purple-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex-1 pt-1">
                                    <p className="font-medium">Shipped</p>
                                    <p className="text-sm text-gray-500">
                                      {['pending', 'processing'].includes(order.status) 
                                        ? 'Pending' 
                                        : 'Your order is on the way'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="relative flex items-start gap-4">
                                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center z-10 ${order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <ArrowRight className={`h-5 w-5 ${order.status === 'delivered' ? 'text-green-500' : 'text-gray-400'}`} />
                                  </div>
                                  <div className="flex-1 pt-1">
                                    <p className="font-medium">Delivered</p>
                                    <p className="text-sm text-gray-500">
                                      {order.status === 'delivered' 
                                        ? 'Your order has been delivered' 
                                        : 'Pending delivery'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="shipping">
                          <AccordionTrigger className="px-6 py-3">
                            <span className="font-medium">Shipping Details</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="bg-gray-50 p-4 rounded">
                              <h4 className="text-sm font-medium mb-2">Shipping Address</h4>
                              <p className="text-gray-600">{order.shipping_address}</p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default OrdersPage;

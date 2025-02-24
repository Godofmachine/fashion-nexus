
import { ShoppingCart, User, Menu, LogOut, Settings, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: cartItemsCount } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);
      
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out successfully",
        description: "Come back soon!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex">
              <img src="/favicon.ico" alt="" className="h-8 lg:h-10 me-2" />
              BLUEKING
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products?category=men" className="text-gray-700 hover:text-primary transition-colors">Men</Link>
            <Link to="/products?category=women" className="text-gray-700 hover:text-primary transition-colors">Women</Link>
            <Link to="/products?sort=newest" className="text-gray-700 hover:text-primary transition-colors">New Arrivals</Link>
            <Link to="/products?is_sale=true" className="text-red-500 hover:text-red-600 transition-colors font-medium">Sale</Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile?tab=settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link to="/products?category=men" className="text-gray-700 hover:text-primary transition-colors">Men</Link>
              <Link to="/products?category=women" className="text-gray-700 hover:text-primary transition-colors">Women</Link>
              <Link to="/products?sort=newest" className="text-gray-700 hover:text-primary transition-colors">New Arrivals</Link>
              <Link to="/products?is_sale=true" className="text-red-500 hover:text-red-600 transition-colors font-medium">Sale</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

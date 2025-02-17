
import { ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
            <h1 className="text-2xl font-bold text-primary">BLUEKING</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Men</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Women</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">New Arrivals</a>
            <a href="#" className="text-gray-700 hover:text-primary transition-colors">Sale</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button variant="default" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Men</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Women</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">New Arrivals</a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">Sale</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

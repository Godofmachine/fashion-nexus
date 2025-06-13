
import { ShoppingCart, User, Menu, LogOut, Settings, UserCircle, Home, X, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: cartItemsCount } = useQuery({
    queryKey: ['cartCount', user?.id],
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
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
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

  const isActiveRoute = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/products?category=men", label: "Men" },
    { to: "/products?category=women", label: "Women" },
    { to: "/products?sort=newest", label: "New Arrivals" },
    { to: "/products?is_sale=true", label: "Sale", isSpecial: true },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-lg' 
        : 'bg-white/90 backdrop-blur-md border-b border-gray-100'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                <Crown className="h-10 w-10 text-primary transition-transform duration-200 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-20 rounded-full blur-sm"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-none">
                  BLUEKING
                </span>
                <span className="text-xs lg:text-sm font-medium text-gray-600 tracking-wider uppercase leading-none">
                  Fashion
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 relative group ${
                    isActiveRoute(link.to)
                      ? 'text-primary bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20'
                      : link.isSpecial
                      ? 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5'
                  }`}
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  <span>{link.label}</span>
                  {link.isSpecial && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse">
                      Hot
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-200 relative h-10 w-10 rounded-full"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl rounded-lg">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile?tab=settings")} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Cart Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 relative transition-all duration-200 hover:scale-105 h-10 w-10 rounded-full"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold animate-pulse shadow-lg">
                      {cartItemsCount > 9 ? '9+' : cartItemsCount}
                    </span>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                onClick={() => navigate("/auth")}
                className="px-6 py-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-medium rounded-lg hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all duration-200 h-10 w-10 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md animate-fadeIn">
            <div className="py-4 space-y-2">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gradient-to-r relative ${
                      isActiveRoute(link.to)
                        ? 'text-primary bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-primary'
                        : link.isSpecial
                        ? 'text-red-500 hover:text-red-600 hover:from-red-50 hover:to-red-50'
                        : 'text-gray-700 hover:text-primary hover:from-primary/5 hover:to-accent/5'
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-5 w-5" />}
                    <span>{link.label}</span>
                    {link.isSpecial && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        Hot
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

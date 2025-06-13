
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const MockDataToggle = () => {
  const [isMockMode, setIsMockMode] = useState(
    import.meta.env.VITE_USE_MOCK_DATA === 'true'
  );
  const { toast } = useToast();

  const handleToggle = (checked: boolean) => {
    setIsMockMode(checked);
    
    // Update localStorage for persistence across sessions
    if (checked) {
      localStorage.setItem('useMockData', 'true');
    } else {
      localStorage.removeItem('useMockData');
    }

    toast({
      title: checked ? "Mock mode enabled" : "Mock mode disabled",
      description: checked 
        ? "Using mock data for all operations" 
        : "Using real backend data",
    });

    // Suggest page refresh for full effect
    setTimeout(() => {
      toast({
        title: "Refresh recommended",
        description: "Please refresh the page for the change to take full effect",
      });
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="mock-mode"
            checked={isMockMode}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="mock-mode" className="cursor-pointer">
            Mock Data Mode
          </Label>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {isMockMode 
            ? "Currently using mock data" 
            : "Currently using real backend"
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default MockDataToggle;

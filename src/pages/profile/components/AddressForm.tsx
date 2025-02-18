
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface AddressFormProps {
  onSuccess?: () => void;
  existingAddress?: {
    id: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
  };
}

const AddressForm = ({ onSuccess, existingAddress }: AddressFormProps) => {
  const [street, setStreet] = useState(existingAddress?.street || "");
  const [city, setCity] = useState(existingAddress?.city || "");
  const [state, setState] = useState(existingAddress?.state || "");
  const [postalCode, setPostalCode] = useState(existingAddress?.postal_code || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const addressData = {
        user_id: user.id,
        street,
        city,
        state,
        postal_code: postalCode,
      };

      const { error } = existingAddress
        ? await supabase
            .from('addresses')
            .update(addressData)
            .eq('id', existingAddress.id)
        : await supabase
            .from('addresses')
            .insert([addressData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Address ${existingAddress ? 'updated' : 'added'} successfully`,
      });

      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Street Address"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : (existingAddress ? "Update Address" : "Add Address")}
      </Button>
    </form>
  );
};

export default AddressForm;

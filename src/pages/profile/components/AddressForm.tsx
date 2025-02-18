
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Address, AddressInput } from "@/types/address";

interface AddressFormProps {
  onSuccess?: () => void;
  existingAddress?: Address;
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
      const addressData: AddressInput = {
        user_id: user.id,
        street,
        city,
        state,
        postal_code: postalCode,
        is_default: existingAddress?.is_default ?? false
      };

      let error;
      if (existingAddress) {
        const { error: updateError } = await supabase
          .from('addresses')
          .update(addressData)
          .eq('id', existingAddress.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('addresses')
          .insert([addressData]);
        error = insertError;
      }

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

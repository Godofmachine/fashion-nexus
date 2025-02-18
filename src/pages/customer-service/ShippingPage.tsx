
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>
          <div className="prose max-w-none">
            <h2>Delivery Times</h2>
            <p>Standard delivery within Nigeria takes 3-5 business days. Express shipping is available for select locations.</p>
            
            <h2>Shipping Costs</h2>
            <ul>
              <li>Standard Shipping: ₦2,000</li>
              <li>Express Shipping: ₦5,000</li>
              <li>Free shipping on orders above ₦50,000</li>
            </ul>

            <h2>Tracking Your Order</h2>
            <p>Once your order is shipped, you'll receive a tracking number via email to monitor your delivery status.</p>

            <h2>International Shipping</h2>
            <p>We currently only ship within Nigeria. International shipping will be available soon.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPage;

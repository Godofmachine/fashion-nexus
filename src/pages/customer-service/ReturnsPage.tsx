
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>
          <div className="prose max-w-none">
            <h2>Return Policy</h2>
            <p>We accept returns within 14 days of delivery. Items must be unworn and in original condition with tags attached.</p>
            
            <h2>Exchange Process</h2>
            <p>To exchange an item for a different size or color, please initiate a return and place a new order for the desired item.</p>

            <h2>Refund Timeline</h2>
            <p>Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.</p>

            <h2>Return Shipping</h2>
            <p>Customers are responsible for return shipping costs unless the item received was defective or incorrect.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReturnsPage;

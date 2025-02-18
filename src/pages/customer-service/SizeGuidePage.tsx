
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SizeGuidePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Size Guide</h1>
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Men's Sizing</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Chest (cm)</th>
                      <th className="border p-2">Waist (cm)</th>
                      <th className="border p-2">Hip (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">S</td>
                      <td className="border p-2">88-96</td>
                      <td className="border p-2">73-81</td>
                      <td className="border p-2">88-96</td>
                    </tr>
                    <tr>
                      <td className="border p-2">M</td>
                      <td className="border p-2">96-104</td>
                      <td className="border p-2">81-89</td>
                      <td className="border p-2">96-104</td>
                    </tr>
                    <tr>
                      <td className="border p-2">L</td>
                      <td className="border p-2">104-112</td>
                      <td className="border p-2">89-97</td>
                      <td className="border p-2">104-112</td>
                    </tr>
                    <tr>
                      <td className="border p-2">XL</td>
                      <td className="border p-2">112-120</td>
                      <td className="border p-2">97-105</td>
                      <td className="border p-2">112-120</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-4">Women's Sizing</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Size</th>
                      <th className="border p-2">Bust (cm)</th>
                      <th className="border p-2">Waist (cm)</th>
                      <th className="border p-2">Hip (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">XS</td>
                      <td className="border p-2">76-83</td>
                      <td className="border p-2">58-65</td>
                      <td className="border p-2">84-91</td>
                    </tr>
                    <tr>
                      <td className="border p-2">S</td>
                      <td className="border p-2">83-90</td>
                      <td className="border p-2">65-72</td>
                      <td className="border p-2">91-98</td>
                    </tr>
                    <tr>
                      <td className="border p-2">M</td>
                      <td className="border p-2">90-97</td>
                      <td className="border p-2">72-79</td>
                      <td className="border p-2">98-105</td>
                    </tr>
                    <tr>
                      <td className="border p-2">L</td>
                      <td className="border p-2">97-104</td>
                      <td className="border p-2">79-86</td>
                      <td className="border p-2">105-112</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SizeGuidePage;


import { Card } from "@/components/ui/card";

const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: "₦15,000",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a",
  },
  {
    id: 2,
    name: "Classic Hoodie",
    price: "₦25,000",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
  },
  {
    id: 3,
    name: "Denim Jacket",
    price: "₦35,000",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0",
  },
  {
    id: 4,
    name: "Casual Pants",
    price: "₦20,000",
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm text-accent uppercase tracking-wider">Collection</span>
          <h2 className="text-3xl font-bold mt-2">Featured Products</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-accent mt-2">{product.price}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

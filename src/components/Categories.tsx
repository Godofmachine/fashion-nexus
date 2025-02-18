
import { useNavigate } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Men's Collection",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e",
    path: "/products?category=men",
  },
  {
    id: 2,
    name: "Women's Collection",
    image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03",
    path: "/products?category=women",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="relative group cursor-pointer overflow-hidden rounded-lg"
              onClick={() => navigate(category.path)}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-3xl font-bold tracking-wider">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

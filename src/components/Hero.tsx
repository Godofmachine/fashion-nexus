
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center">
        <div className="max-w-3xl px-4 animate-fadeIn">
          <span className="inline-block px-4 py-1 mb-4 text-sm bg-white/10 backdrop-blur-md text-white rounded-full">
            New Collection 2024
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Define Your Style
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Discover the latest trends in Nigerian fashion
          </p>
          <Button className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6">
            Shop Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

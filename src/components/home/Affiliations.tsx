import img1 from "@/assets/1.png";
import img2 from "@/assets/2.png";
import img3 from "@/assets/3.png";
import img4 from "@/assets/4.png";
import img5 from "@/assets/5.png";
import img6 from "@/assets/6.png";
import img7 from "@/assets/7.png";

const affiliations = [img1, img2, img3, img4, img5, img6, img7];

export const Affiliations = () => {
  return (
    <section className="py-14 bg-background border-b border-border overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-base md:text-lg font-semibold text-muted-foreground uppercase tracking-widest">
          Affiliated With
        </h3>
      </div>
      <div className="flex overflow-hidden group w-full relative">
        <div className="flex shrink-0 animate-marquee items-center justify-around min-w-full">
          {affiliations.map((src, idx) => (
            <img 
              key={`a-${idx}`} 
              src={src} 
              alt="Affiliated Partner" 
              className="h-20 md:h-24 lg:h-32 mx-8 md:mx-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
          ))}
        </div>
        <div className="flex shrink-0 animate-marquee items-center justify-around min-w-full" aria-hidden="true">
          {affiliations.map((src, idx) => (
            <img 
              key={`b-${idx}`} 
              src={src} 
              alt="Affiliated Partner" 
              className="h-20 md:h-24 lg:h-32 mx-8 md:mx-12 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image_url: string | null;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase.from("testimonials").select("*").eq("active", true).order("display_order").then(({ data }) => {
      if (data && data.length > 0) setTestimonials(data);
    });
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">Testimonials</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">What Our Students Say</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground">Hear from our students and parents about their experience with Win Academy.</motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card rounded-3xl p-8 lg:p-12 shadow-xl border border-border">
            <div className="absolute -top-6 left-8 lg:left-12">
              <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="pt-4">
                <p className="text-lg lg:text-xl text-foreground leading-relaxed mb-8">"{testimonials[current].content}"</p>
                <div className="flex items-center gap-4">
                  {testimonials[current].image_url ? (
                    <img src={testimonials[current].image_url} alt={testimonials[current].name} className="w-14 h-14 rounded-full object-cover" />
                  ) : (
                    <div className="w-14 h-14 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">{getInitials(testimonials[current].name)}</div>
                  )}
                  <div>
                    <h4 className="font-heading font-semibold text-foreground">{testimonials[current].name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 right-8 lg:right-12 flex items-center gap-2">
              <button onClick={prev} className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-colors" aria-label="Previous"><ChevronLeft className="w-5 h-5 text-foreground" /></button>
              <button onClick={next} className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-colors" aria-label="Next"><ChevronRight className="w-5 h-5 text-foreground" /></button>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button key={index} onClick={() => setCurrent(index)} className={`w-2 h-2 rounded-full transition-all ${index === current ? "w-8 bg-primary" : "bg-muted-foreground/30"}`} aria-label={`Go to testimonial ${index + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

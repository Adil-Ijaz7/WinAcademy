import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HeroData {
  title: string;
  subtitle: string;
  content: string;
  metadata: any;
}

export function Hero() {
  const [data, setData] = useState<HeroData | null>(null);

  useEffect(() => {
    supabase.from("page_sections").select("*").eq("page", "home").eq("section_key", "hero").maybeSingle().then(({ data: d }) => {
      if (d) setData({ title: d.title || "WIN ACADEMY", subtitle: d.subtitle || "", content: d.content || "", metadata: d.metadata || {} });
    });
  }, []);

  const title = data?.title || "WIN ACADEMY";
  const subtitle = data?.subtitle || "Registrations Are open";
  const content = data?.content || "";
  const meta = data?.metadata || {};
  const logo = meta.logo_url || "/lovable-uploads/35942170-a784-4a12-b5aa-c0a9c746ea8b.jpg";
  const stats = meta.stats || [{ number: "500+", label: "Students" }, { number: "23+", label: "Courses" }, { number: "10+", label: "Teachers" }];
  const ctaPrimary = meta.cta_primary || { text: "Explore Courses", link: "/courses" };
  const ctaSecondary = meta.cta_secondary || { text: "Contact Us", link: "/contact" };

  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero">
      <div className="container mx-auto px-4 relative z-10 py-5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 border-none rounded-lg">
            <img alt="Win Academy" className="h-20 lg:h-28 w-auto mx-auto border-0 rounded-full" src={logo} />
          </motion.div>

          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-block px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground mb-6 text-base">
            {subtitle}
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-heading text-4xl lg:text-6xl font-bold leading-tight mb-6 text-primary-foreground">
            {title}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
            {content}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link to={ctaPrimary.link}>{ctaPrimary.text}<ArrowRight className="ml-2" size={18} /></Link>
            </Button>
            <Button variant="outline-light" size="lg" asChild>
              <Link to={ctaSecondary.link}>{ctaSecondary.text}</Link>
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} className="mt-16 flex justify-center gap-12 lg:gap-16">
            {stats.map((stat: any, index: number) => (
              <div key={index} className="text-center">
                <div className="font-heading text-2xl lg:text-3xl font-bold text-primary-foreground">{stat.number}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

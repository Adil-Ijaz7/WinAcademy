import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CTA() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    supabase.from("page_sections").select("*").eq("page", "home").eq("section_key", "cta").maybeSingle().then(({ data: d }) => {
      if (d) setData(d);
    });
  }, []);

  const title = data?.title || "Ready to Start Your Learning Journey?";
  const content = data?.content || "Join hundreds of students who have transformed their futures with Win Academy.";
  const meta = data?.metadata || {};
  const ctaPrimary = meta.cta_primary || { text: "Enroll Now", link: "/contact" };
  const ctaSecondary = meta.cta_secondary || { text: "Contact Us", link: "/contact" };

  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-heading text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            {title}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-primary-foreground/80 mb-8">
            {content}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link to={ctaPrimary.link}>{ctaPrimary.text}<ArrowRight className="ml-2" size={18} /></Link>
            </Button>
            <Button variant="outline-light" size="lg" asChild>
              <Link to={ctaSecondary.link}>{ctaSecondary.text}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

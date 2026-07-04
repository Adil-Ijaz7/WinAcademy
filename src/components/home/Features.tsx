import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, Award, Clock, BookOpen, Laptop, CheckCircle,
  Star, Heart, Trophy, Target, Zap, LucideIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap, Users, Award, Clock, BookOpen, Laptop, CheckCircle,
  Star, Heart, Trophy, Target, Zap,
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const fallbackFeatures: Feature[] = [
  { icon: "Award", title: "Experience You Can Trust", description: "With 22 years grinding in computer IT and education — government and private — you're learning from real-world expertise backed by awards and respect in Sindh's teaching world." },
  { icon: "Laptop", title: "Practical, Not Theoretical", description: "We don't just teach concepts — we build skills. Whether it's basic computer use or advanced IT systems, students walk out ready for real challenges." },
  { icon: "Users", title: "Heart Over Hype", description: "We teach with empathy. You're not a number — you're a learner with dreams. We guide, support, and push you to become better every day." },
  { icon: "BookOpen", title: "Poetic Precision + Tech Mastery", description: "We blend traditional values — discipline, respect, deep understanding — with forward-looking tech. Your learning is rooted and also future-ready." },
  { icon: "GraduationCap", title: "Proven Results", description: "Students from Win Academy don't just pass exams — they excel. Whether it's board exams or IT certifications, our track record speaks louder than brochures." },
  { icon: "Clock", title: "Community & Care", description: "This isn't just a school — it's a community. Students, teachers, and parents all grow together, uplifting each other." },
  { icon: "CheckCircle", title: "Affordable, Accessible, Worth It", description: "Top-tier education shouldn't cost a fortune. We make quality learning accessible without cutting corners." },
];

export function Features() {
  const [title, setTitle] = useState("Why Choose Win Academy?");
  const [badge, setBadge] = useState("Why Choose Win Academy");
  const [intro, setIntro] = useState(
    "22 years of passion, expertise, and results — here's what sets us apart."
  );
  const [image, setImage] = useState<string>("https://placehold.co/800x1066/e2e8f0/475569?text=Win+Academy");
  const [features, setFeatures] = useState<Feature[]>(fallbackFeatures);

  useEffect(() => {
    supabase
      .from("page_sections")
      .select("*")
      .eq("page", "home")
      .eq("section_key", "why_choose")
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        if (data.title) setTitle(data.title);
        if (data.subtitle) setBadge(data.subtitle);
        if (data.content) setIntro(data.content);
        if (data.image_url) setImage(data.image_url);
        const metaFeatures = (data.metadata as any)?.features;
        if (Array.isArray(metaFeatures) && metaFeatures.length) setFeatures(metaFeatures);
      });
  }, []);

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={image}
              alt="Students learning at Win Academy"
              className="w-full h-full object-cover aspect-[3/4] lg:aspect-auto lg:h-[560px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </motion.div>

          {/* Bullet Points Column */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
            >
              {badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mb-8"
            >
              {intro}
            </motion.p>

            <div className="space-y-5">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || Star;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

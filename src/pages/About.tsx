import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Target, Eye, BookOpen, Award, Users, Lightbulb, Monitor, Sofa, Camera, Droplets, ShieldPlus, Flame, BatteryCharging, Laptop, Scissors, UtensilsCrossed, Wifi, Shirt } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const values = [
  { icon: Target, title: "Excellence", description: "We strive for excellence in every aspect of education we provide." },
  { icon: Lightbulb, title: "Innovation", description: "Embracing new technologies and teaching methodologies." },
  { icon: Users, title: "Community", description: "Building a supportive learning community for all students." },
  { icon: Award, title: "Achievement", description: "Celebrating and nurturing student accomplishments." },
];

const amenities = [
  { icon: Laptop, title: "Computer Lab", description: "Well-equipped labs spaces for hands-on computer learning and practice." },
  { icon: Scissors, title: "Beautician Lab", description: "Dedicated training space for grooming, beauty, and salon skill development." },
  { icon: UtensilsCrossed, title: "Canteen", description: "A convenient canteen area for students and staff during the day." },
  { icon: Wifi, title: "High-Speed Internet", description: "Fast internet access to support digital learning and online resources." },
  { icon: Shirt, title: "Sewing Machine Workshop", description: "Practical workshop space for sewing, tailoring, and vocational training." },
  { icon: Monitor, title: "Multimedia Projectors", description: "Interactive classrooms equipped for modern teaching and presentations." },
  { icon: Sofa, title: "Comfortable Furniture", description: "Student-friendly seating and desks designed for a better learning experience." },
  { icon: Camera, title: "CCTV Cameras", description: "Secure learning spaces with continuous monitoring for safety and discipline." },
  { icon: Droplets, title: "Clean Drinking Water", description: "Fresh and accessible drinking water for students and staff." },
  { icon: BatteryCharging, title: "Power Backup & 24/7 Electricity", description: "Reliable power support to keep classes and equipment running without interruption." },
  { icon: ShieldPlus, title: "First Aid Box", description: "Basic medical support available on campus for quick response to minor needs." },
  { icon: Flame, title: "Fire Extinguishers", description: "Safety equipment installed to support emergency preparedness." },
];

const About = () => {
  const [heroData, setHeroData] = useState<any>(null);
  const [whoWeAre, setWhoWeAre] = useState<any>(null);
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    supabase.from("page_sections").select("*").eq("page", "about").then(({ data }) => {
      if (data) {
        data.forEach((s: any) => {
          if (s.section_key === "hero") setHeroData(s);
          if (s.section_key === "who_we_are") setWhoWeAre(s);
          if (s.section_key === "stats") setStatsData(s);
        });
      }
    });
  }, []);

  const hero = { title: heroData?.title || "Shaping Tomorrow's Leaders", subtitle: heroData?.subtitle || "About Us", content: heroData?.content || "Win Academy is a premier educational institute dedicated to providing quality academic and computer education in Dadu, Sindh." };
  const who = { title: whoWeAre?.title || "A Legacy of Educational Excellence", subtitle: whoWeAre?.subtitle || "Who We Are", content: whoWeAre?.content || "", meta: whoWeAre?.metadata || {} };
  const stats = statsData?.metadata?.stats || [{ number: "500+", label: "Students Enrolled" }, { number: "15+", label: "Courses Offered" }, { number: "10+", label: "Expert Teachers" }, { number: "95%", label: "Success Rate" }];

  return (
    <Layout>
      <SEOHead
        title="About Us – 22+ Years of Educational Excellence"
        description="Learn about Win Academy's mission, vision, and 22-year legacy of quality education in Dadu, Sindh, Pakistan. Empowering students with IT and academic excellence."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.tech/" },
            { "@type": "ListItem", position: 2, name: "About Us", item: "https://winacademy.tech/about" },
          ],
        }}
      />
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1 rounded-full glass text-primary-foreground text-sm font-medium mb-6">{hero.subtitle}</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">{hero.title}</motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-primary-foreground/80">{hero.content}</motion.p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{who.subtitle}</span>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-6">{who.title}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                {(who.content || "").split("\n\n").map((p: string, i: number) => <p key={i}>{p}</p>)}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4"><Eye className="w-6 h-6 text-primary-foreground" /></div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Our Vision</h3>
                <p className="text-sm text-muted-foreground">{who.meta.vision || "To be the leading educational institution that transforms lives through quality education."}</p>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mt-8">
                <div className="w-12 h-12 bg-gradient-to-br from-win-purple to-win-red rounded-xl flex items-center justify-center mb-4"><Target className="w-6 h-6 text-primary-foreground" /></div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Our Mission</h3>
                <p className="text-sm text-muted-foreground">{who.meta.mission || "Empower students with knowledge, skills, and values for lifelong success."}</p>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <div className="w-12 h-12 bg-gradient-to-br from-win-red to-orange-500 rounded-xl flex items-center justify-center mb-4"><BookOpen className="w-6 h-6 text-primary-foreground" /></div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Our Approach</h3>
                <p className="text-sm text-muted-foreground">{who.meta.approach || "Interactive learning with practical, hands-on experience."}</p>
              </div>
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mt-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-win-blue rounded-xl flex items-center justify-center mb-4"><Award className="w-6 h-6 text-primary-foreground" /></div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">Our Promise</h3>
                <p className="text-sm text-muted-foreground">{who.meta.promise || "Commitment to every student's academic and personal growth."}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Campus Amenities</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-heading text-3xl lg:text-4xl font-bold text-foreground">Classrooms Equipped for Learning</motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="mt-4 text-muted-foreground">
              Our campus is designed to provide a safe, comfortable, and supportive environment for students.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;

              return (
                <motion.div
                  key={amenity.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-card rounded-2xl p-6 shadow-md border border-border card-hover"
                >
                  <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{amenity.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{amenity.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">Our Core Values</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="font-heading text-3xl lg:text-4xl font-bold text-foreground">What Drives Us Forward</motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => { const Icon = value.icon; return (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-6 shadow-md border border-border text-center card-hover">
                <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-7 h-7 text-primary-foreground" /></div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ); })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="gradient-hero rounded-3xl p-8 lg:p-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat: any, index: number) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                  <div className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">{stat.number}</div>
                  <div className="text-sm lg:text-base text-primary-foreground/70">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;

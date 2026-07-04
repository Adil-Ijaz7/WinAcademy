import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Award, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  category: string;
  image_url: string | null;
  price: number | null;
  duration: string | null;
  schedule: string | null;
  enrollment_status: string;
  features: string[];
  active: boolean;
  display_order: number;
}

const categoryMap: Record<string, string> = {
  "IT & Computer": "it",
  "Academic": "academic",
  "Vocational": "vocational",
};

const categories = [
  { id: "all", label: "All Courses" },
  { id: "it", label: "IT & Computer" },
  { id: "academic", label: "Academic" },
  { id: "vocational", label: "Vocational" },
];

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    supabase.from("courses").select("*").eq("active", true).order("display_order").then(({ data }) => {
      setCourses(data || []);
      setIsLoading(false);
    });
  }, []);

  const filteredCourses = courses.filter(
    (course) => activeCategory === "all" || categoryMap[course.category] === activeCategory
  );

  return (
    <Layout>
      <SEOHead
        title="Courses – IT, Programming & Academic Programs"
        description="Explore Win Academy's courses: Programming, AI, Web Development, Mathematics, Physics, English and more in Dadu, Sindh. Enroll now!"
        path="/courses"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.vercel.app/" },
            { "@type": "ListItem", position: 2, name: "Courses", item: "https://winacademy.vercel.app/courses" },
          ],
        }}
      />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1 rounded-full glass text-primary-foreground text-sm font-medium mb-6">Our Programs</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">Explore Our Courses</motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-primary-foreground/80">Discover programs designed to equip you with skills for success in academics, technology, and vocational trades.</motion.p>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${activeCategory === cat.id ? "gradient-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{cat.label}</button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border card-hover flex flex-col">
                  <div className="h-2 bg-gradient-to-r from-primary to-secondary" />
                  {course.image_url && (
                    <img src={course.image_url} alt={course.name} className="w-full h-40 object-cover" loading="lazy" />
                  )}
                  <div className="p-6 lg:p-8 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">{course.category}</span>
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{course.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{course.description}</p>
                    {course.features && course.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">What You'll Learn</h4>
                        <ul className="space-y-1">
                          {course.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="mt-auto">
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
                        {course.duration && <span className="flex items-center gap-1.5"><Clock size={16} />{course.duration}</span>}
                        {course.price && <span className="font-semibold text-foreground">PKR {course.price.toLocaleString()}</span>}
                        {course.enrollment_status === "closed" && <span className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">Enrollment Closed</span>}
                      </div>
                      <Button variant="outline" className="w-full" asChild disabled={course.enrollment_status === "closed"}>
                        <Link to="/admissions">Enroll Now<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-3xl p-8 lg:p-12 shadow-xl border border-border">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6"><Award className="w-8 h-8 text-primary-foreground" /></div>
              <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-4">Not Sure Which Course Is Right?</h2>
              <p className="text-muted-foreground mb-8">Our counselors are here to help you choose the perfect program based on your goals and interests.</p>
              <Button variant="accent" size="xl" asChild><Link to="/contact">Get Free Counseling<ArrowRight className="ml-2" size={20} /></Link></Button>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Courses;

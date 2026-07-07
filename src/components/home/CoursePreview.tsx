import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Globe, Calculator, Atom, BookText, Scissors, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];

const categoryStyles: Record<string, { icon: typeof BookOpen; color: string }> = {
  "IT & Computer": { icon: Globe, color: "from-win-blue to-cyan-500" },
  Academic: { icon: Calculator, color: "from-win-red to-orange-500" },
  Vocational: { icon: Scissors, color: "from-pink-500 to-win-purple" },
};

const titleStyles: Array<{ match: RegExp; icon: typeof BookOpen; color: string }> = [
  { match: /artificial intelligence|ai/i, icon: Brain, color: "from-win-purple to-win-red" },
  { match: /web|development|programming|computer|it/i, icon: Globe, color: "from-win-blue to-cyan-500" },
  { match: /math|mathematics|statistics|algebra|calculus/i, icon: Calculator, color: "from-win-red to-orange-500" },
  { match: /physics|science|atom/i, icon: Atom, color: "from-teal-500 to-win-blue" },
  { match: /english|language|communication/i, icon: BookText, color: "from-amber-500 to-win-red" },
  { match: /beautician|salon|sewing|dairy|vocational/i, icon: Scissors, color: "from-pink-500 to-win-purple" },
];

const fallbackStyle = { icon: BookOpen, color: "from-win-blue to-win-purple" };

const getCourseStyle = (course: Course) => {
  const titleStyle = titleStyles.find(({ match }) => match.test(course.name));
  if (titleStyle) return titleStyle;
  return categoryStyles[course.category] || fallbackStyle;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function CoursePreview() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase
      .from("courses")
      .select("id,name,slug,description,short_description,category,image_url,display_order,active")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .limit(6)
      .then(({ data }) => {
        if (isMounted) {
          setCourses(data || []);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4"
            >
              Our Programs
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4"
            >
              Explore Our Courses
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground"
            >
              From IT & computer science to academic excellence and vocational skills, discover programs designed to shape your future.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="shrink-0"
          >
            <Button variant="gradient" size="lg" asChild>
              <Link to="/courses">
                View All Courses
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md border border-border h-[320px] animate-pulse">
                <div className="h-2 bg-muted" />
                <div className="p-6 lg:p-8 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-muted" />
                    <div className="w-20 h-6 rounded-full bg-muted" />
                  </div>
                  <div className="w-3/4 h-6 rounded bg-muted" />
                  <div className="w-full h-4 rounded bg-muted" />
                  <div className="w-5/6 h-4 rounded bg-muted" />
                  <div className="mt-auto w-28 h-4 rounded bg-muted" />
                </div>
              </div>
            ))
          ) : (
            courses.map((course, index) => {
              const { icon: Icon, color } = getCourseStyle(course);
              const description = course.short_description || course.description;
            return (
              <motion.div
                key={course.id}
                variants={itemVariants}
                className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border card-hover flex flex-col"
              >
                <div className={`h-2 bg-gradient-to-r ${color}`} />
                {course.image_url ? (
                  <img src={course.image_url} alt={course.name} className="w-full h-40 object-cover" loading="lazy" />
                ) : null}
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 text-justify">
                    {description}
                  </p>
                  <Link
                    to="/courses"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-auto"
                  >
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
            })
          )}
        </motion.div>
      </div>
    </section>
  );
}

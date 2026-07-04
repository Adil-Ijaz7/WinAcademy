import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Globe, Calculator, Atom, BookText, Scissors } from "lucide-react";

const courses = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    category: "IT & Computer",
    description: "Explore machine learning, neural networks, and AI applications.",
    color: "from-win-purple to-win-red",
  },
  {
    icon: Globe,
    title: "Web App Development",
    category: "IT & Computer",
    description: "Full-stack web development with modern frameworks and tools.",
    color: "from-win-blue to-cyan-500",
  },
  {
    icon: Calculator,
    title: "Mathematics",
    category: "Academic",
    description: "Build strong foundations in algebra, calculus, and statistics.",
    color: "from-win-red to-orange-500",
  },
  {
    icon: Atom,
    title: "Physics",
    category: "Academic",
    description: "Understand the fundamental laws governing our universe.",
    color: "from-teal-500 to-win-blue",
  },
  {
    icon: BookText,
    title: "English Language",
    category: "Academic",
    description: "Enhance communication skills and language proficiency.",
    color: "from-amber-500 to-win-red",
  },
  {
    icon: Scissors,
    title: "Beautician & Salon",
    category: "Vocational",
    description: "Professional beauty, haircutting, and salon services training.",
    color: "from-pink-500 to-win-purple",
  },
];

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
          {courses.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border card-hover flex flex-col"
              >
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <div className="p-6 lg:p-8 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                    {course.description}
                  </p>
                  <Link
                    to="/admissions"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors mt-auto"
                  >
                    Learn More
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

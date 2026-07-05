import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Award, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FacultyMember {
  id: string;
  name: string;
  photo_url: string | null;
  role: string;
  qualifications: string[];
  expertise: string[];
  experience: string;
  display_order: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Faculty() {
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const { data, error } = await supabase
          .from("faculty_members")
          .select("*")
          .eq("active", true)
          .order("display_order", { ascending: true });
        if (error) throw error;
        setFacultyMembers(data || []);
      } catch (error) {
        console.error("Failed to fetch faculty:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Faculty – Meet Our Expert Teachers"
        description="Meet the experienced faculty at Win Academy, Dadu. Expert teachers in IT, Computer Science, and Academic subjects with years of real-world experience."
        path="/faculty"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.tech/" },
            { "@type": "ListItem", position: 2, name: "Faculty", item: "https://winacademy.tech/faculty" },
          ],
        }}
      />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Our Distinguished Faculty
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Meet our team of dedicated educators committed to nurturing excellence 
              and shaping the future leaders of tomorrow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: GraduationCap, label: "Qualified Teachers", value: "25+" },
              { icon: Award, label: "Ph.D. Holders", value: "8" },
              { icon: BookOpen, label: "Subjects Covered", value: "15+" },
              { icon: Award, label: "Avg. Experience", value: "10+ yrs" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 gradient-primary rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden h-full">
                  <Skeleton className="w-full aspect-square" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="w-3/4 h-6 mb-2" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-1/2 h-4 mb-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {facultyMembers.map((member) => (
                <motion.div key={member.id} variants={itemVariants}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
                    <div className="aspect-square relative overflow-hidden bg-muted">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-heading text-xl font-bold text-white">
                          {member.name}
                        </h3>
                        <p className="text-white/80 text-sm">{member.role}</p>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Qualifications</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.qualifications.map((qual, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {qual}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">Expertise</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.map((exp, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {exp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <Award className="w-4 h-4 text-accent" />
                        <span className="text-sm text-muted-foreground">
                          {member.experience} of experience
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Join Our Learning Community
            </h2>
            <p className="text-muted-foreground mb-6">
              Experience quality education under the guidance of our expert faculty members.
            </p>
            <a
              href="/admissions"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              Apply for Admission
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { GraduationCap, Send, CheckCircle, FileText, Users, Clock, Award } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const admissionSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  fatherName: z.string().trim().min(2, "Father's name must be at least 2 characters").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select your gender"),
  cnicBform: z.string().trim().min(13, "CNIC/B-Form must be at least 13 digits").max(15, "CNIC/B-Form too long"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  whatsappNumber: z.string().trim().min(10, "WhatsApp number must be at least 10 digits").max(20),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal("")),
  address: z.string().trim().min(5, "Address must be at least 5 characters").max(500),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100),
  previousEducation: z.string().min(1, "Please select your education level"),
  courseInterest: z.string().min(1, "Please select a course"),
  message: z.string().max(1000).optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const courses = [
  "Associate Degree (DAE)",
  "Artificial Intelligence (AI)",
  "Computer Grade 9 to CIT",
  "Computer DIT",
  "WordPress Development",
  "Web App Development",
  "Python Programming",
  "Java Programming",
  "C++ Programming",
  "Short Computer Course",
  "E-Commerce & SEO",
  "Domain & Hosting Services",
  "School Diary Work",
  "English Language",
  "Mathematics",
  "Biology",
  "Chemistry",
  "Physics",
  "Beautician",
  "Haircutting",
  "Salon Services",
  "Dressmaking",
  "Sewing",
];

const educationLevels = [
  "Primary School",
  "Middle School",
  "Matriculation (10th)",
  "Intermediate (12th)",
  "Bachelor's Degree",
  "Master's Degree",
  "Other",
];

const features = [
  { icon: FileText, title: "Easy Application", description: "Simple online form to submit your application" },
  { icon: Clock, title: "Quick Processing", description: "Get response within 2-3 business days" },
  { icon: Users, title: "Expert Guidance", description: "Our counselors help you choose the right course" },
  { icon: Award, title: "Merit-Based", description: "Fair selection based on your qualifications" },
];

export default function Admissions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      fullName: "",
      fatherName: "",
      dateOfBirth: "",
      gender: "",
      cnicBform: "",
      phone: "",
      whatsappNumber: "",
      email: "",
      address: "",
      city: "",
      previousEducation: "",
      courseInterest: "",
      message: "",
    },
  });

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    try {
      const { data: application, error: dbError } = await supabase
        .from("admission_applications")
        .insert({
          full_name: data.fullName,
          email: data.email || "",
          phone: data.phone,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          address: data.address,
          city: data.city,
          guardian_name: data.fatherName,
          guardian_phone: data.phone,
          previous_education: data.previousEducation,
          course_interest: data.courseInterest,
          message: data.message || null,
          father_name: data.fatherName,
          cnic_bform: data.cnicBform,
          whatsapp_number: data.whatsappNumber,
        })
        .select()
        .single();

      if (dbError) throw new Error(dbError.message);

      const { error: emailError } = await supabase.functions.invoke(
        "send-admission-confirmation",
        { body: { applicationId: application.id } }
      );
      if (emailError) console.error("Email error:", emailError);

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We've received your application and sent a confirmation email.",
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold mb-4 text-foreground">
                Application Submitted Successfully!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for applying to Win Academy. Our admissions team will review your application and get back to you within 2-3 business days.
              </p>
              <Button variant="accent" size="lg" onClick={() => setIsSubmitted(false)}>
                Submit Another Application
              </Button>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Apply Now – Online Admission Form"
        description="Apply for admission at Win Academy, Dadu, Sindh. Online application form for IT, Programming, and Academic courses. Quick processing within 2-3 days."
        path="/admissions"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.vercel.app/" },
            { "@type": "ListItem", position: 2, name: "Admissions", item: "https://winacademy.vercel.app/admissions" },
          ],
        }}
      />
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <GraduationCap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Admissions Open</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6 text-foreground">
              Apply for <span className="text-gradient">Admission</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Take the first step towards your future. Fill out the application form below and join Win Academy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-primary flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
              <div className="gradient-primary p-6 lg:p-8">
                <h2 className="text-2xl font-heading font-bold text-primary-foreground">Application Form</h2>
                <p className="text-primary-foreground/80">Please fill in all required fields marked with *</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 lg:p-8 space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full gradient-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fatherName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Father's Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter father's name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cnicBform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CNIC / B-Form Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="XXXXX-XXXXXXX-X" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="03XX-XXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="03XX-XXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com (optional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full gradient-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                      Address Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Full Address *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your complete address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Course Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full gradient-primary text-primary-foreground text-sm flex items-center justify-center">3</span>
                      Education & Course Selection
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="previousEducation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Education *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {educationLevels.map((level) => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="courseInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Interest *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {courses.map((course) => (
                                  <SelectItem key={course} value={course}>{course}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full gradient-primary text-primary-foreground text-sm flex items-center justify-center">4</span>
                      Additional Information (Optional)
                    </h3>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information you'd like to share..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <Button type="submit" variant="accent" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

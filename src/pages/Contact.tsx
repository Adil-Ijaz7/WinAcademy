import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SiteSettings = {
  address?: string;
  phone?: string;
  email?: string;
  office_hours?: string;
  map_embed_url?: string;
};

type Course = {
  name: string;
};

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [courseList, setCourseList] = useState<string[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => { if (data) setSettings(data as SiteSettings); });
    supabase.from("courses").select("name").eq("active", true).order("display_order").then(({ data }) => {
      if (data) setCourseList(data.map((c: Course) => c.name));
    });
  }, []);

  return (
    <Layout>
      <SEOHead
        title="Contact Us – Get in Touch"
        description="Contact Win Academy in Dadu, Sindh. Phone: +92 345 3781552, Email: winacademydadu@gmail.com. Visit us or send an inquiry online."
        path="/contact"
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Win Academy",
          image: "https://winacademy.tech/logo.png",
          telephone: "+923453781552",
          email: "winacademydadu@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "PQPC+64, Chano Dādu",
            addressLocality: "Dadu",
            addressRegion: "Sindh",
            addressCountry: "PK",
          },
        }, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.tech/" },
            { "@type": "ListItem", position: 2, name: "Contact", item: "https://winacademy.tech/contact" },
          ],
        }]}
      />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full glass text-primary-foreground text-sm font-medium mb-6"
            >
              Get In Touch
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-primary-foreground/80"
            >
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-card rounded-3xl p-8 lg:p-10 shadow-xl border border-border">
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Send Us a Message
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you shortly.
                </p>

                <form action="https://formsubmit.co/winacademydadu@gmail.com" method="POST" className="space-y-6">
                  <input type="hidden" name="_subject" value="New Contact Form Submission" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_next" value="https://www.winacademy.tech/contact" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        required
                        className="h-12"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="h-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+92 XXX XXXXXXX"
                        className="h-12"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="course">Course Interest</Label>
                      <Select name="course" value={course} onValueChange={setCourse}>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseList.map((c) => (
                            <SelectItem key={c} value={c.toLowerCase().replace(/\s+/g, "-")}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this about?"
                      required
                      className="h-12"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your learning goals..."
                      rows={5}
                      required
                      className="resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <Button type="submit" variant="accent" size="xl" className="w-full">
                    <Send className="mr-2" size={20} />
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  Get In Touch
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Visit us at our campus or reach out through any of the contact methods below.
                  Our team is ready to assist you with enrollment inquiries and course information.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                <div className="bg-card rounded-2xl p-6 shadow-md border border-border flex items-start gap-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Our Location</h3>
                    <p className="text-muted-foreground text-sm">
                      {settings?.address || "PQPC+64, Chano Dādu, Sindh, Pakistan"}
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-md border border-border flex items-start gap-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Phone Number</h3>
                    <p className="text-muted-foreground text-sm">
                      {settings?.phone || "+92 345 3781552"}
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-md border border-border flex items-start gap-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Email Address</h3>
                    <p className="text-muted-foreground text-sm">
                      {settings?.email || "winacademydadu@gmail.com"}
                    </p>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-md border border-border flex items-start gap-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="text-muted-foreground text-sm">
                      {settings?.office_hours || "Monday - Saturday, 9:00 AM - 6:00 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-card rounded-3xl overflow-hidden shadow-xl border border-border">
              <iframe
                src={settings?.map_embed_url || "https://maps.google.com/maps?q=PQPC%2B64+WIN+INSTITUTE+Chano+Dadu+Pakistan&t=&z=17&ie=UTF8&iwloc=&output=embed"}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Win Academy Location"
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

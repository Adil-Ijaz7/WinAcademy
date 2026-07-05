import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import logoImage from "@/assets/logo.png";
const logo = logoImage;
import { supabase } from "@/integrations/supabase/client";

const quickLinks = [
  { name: "About Us", path: "/about" },
  { name: "Courses", path: "/courses" },
  { name: "Admissions", path: "/admissions" },
  { name: "Contact", path: "/contact" },
  { name: "Admin Portal", path: "/admin/auth" },
];

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [topCourses, setTopCourses] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => { if (data) setSettings(data); });
    supabase.from("courses").select("name, slug").eq("active", true).order("display_order").limit(3).then(({ data }) => { if (data) setTopCourses(data); });
  }, []);

  const phone = settings?.phone || "+92 345 3781552";
  const email = settings?.email || "winacademydadu@gmail.com";
  const address = settings?.address || "PQPC+64, Chano Dādu, Sindh, Pakistan";
  const tagline = settings?.tagline || "Empowering minds and building futures through quality education in academics and technology.";

  return (
    <footer className="bg-foreground text-background pb-24 lg:pb-0">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Win Academy" className="h-14 w-auto object-contain" />
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">{tagline}</p>
            <div className="flex items-center gap-4">
              {settings?.social_facebook && <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors"><Facebook size={20} /></a>}
              {settings?.social_twitter && <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors"><Twitter size={20} /></a>}
              {settings?.social_instagram && <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-background/70 hover:text-primary transition-colors"><Instagram size={20} /></a>}
              {!settings?.social_facebook && !settings?.social_twitter && !settings?.social_instagram && (
                <>
                  <a href="#" className="text-background/70 hover:text-primary transition-colors"><Facebook size={20} /></a>
                  <a href="#" className="text-background/70 hover:text-primary transition-colors"><Twitter size={20} /></a>
                  <a href="#" className="text-background/70 hover:text-primary transition-colors"><Instagram size={20} /></a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}><Link to={link.path} className="text-background/70 hover:text-primary transition-colors text-sm">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Popular Courses</h4>
            <ul className="space-y-3">
              {topCourses.map((course) => (
                <li key={course.slug}><Link to="/courses" className="text-background/70 hover:text-primary transition-colors text-sm">{course.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70"><MapPin size={18} className="shrink-0 mt-0.5" /><span>{address}</span></li>
              <li className="flex items-center gap-3 text-sm text-background/70"><Phone size={18} className="shrink-0" /><span>{phone}</span></li>
              <li className="flex items-center gap-3 text-sm text-background/70"><Mail size={18} className="shrink-0" /><span>{email}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/60">© {new Date().getFullYear()} {settings?.site_name || "Win Academy"}. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-background/60">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

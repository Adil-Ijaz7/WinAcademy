import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { CoursePreview } from "@/components/home/CoursePreview";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";
import { AdSlider } from "@/components/home/AdSlider";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Win Academy",
    description:
      "Premier academic and computer education institute in Dadu, Sindh, Pakistan with 22+ years of experience.",
    url: "https://winacademy.vercel.app",
    logo: "https://winacademy.vercel.app/logo.png",
    foundingDate: "2003",
    address: {
      "@type": "PostalAddress",
      streetAddress: "PQPC+64, Chano Dādu",
      addressLocality: "Dadu",
      addressRegion: "Sindh",
      addressCountry: "PK",
    },
    telephone: "+923453781552",
    email: "winacademydadu@gmail.com",
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Win Academy",
    url: "https://winacademy.vercel.app",
  },
];

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Premier Education Institute in Dadu, Sindh"
        description="Win Academy offers 22+ years of hands-on IT & academic education in Dadu, Sindh, Pakistan. Courses in Programming, AI, Web Development, Mathematics and more. Enroll today!"
        path="/"
        jsonLd={homeJsonLd}
      />
      <Hero />
      <AdSlider placement="home" />
      <Features />
      <CoursePreview />
      <Testimonials />
      <CTA />
    </Layout>
  );
};

export default Index;

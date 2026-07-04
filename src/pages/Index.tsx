import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { CoursePreview } from "@/components/home/CoursePreview";
import { Testimonials } from "@/components/home/Testimonials";
import { CTA } from "@/components/home/CTA";
import { AdSlider } from "@/components/home/AdSlider";

const Index = () => {
  return (
    <Layout>
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

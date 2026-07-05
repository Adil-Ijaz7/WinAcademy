import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";

const Terms = () => {
  return (
    <Layout>
      <SEOHead
        title="Terms & Conditions - Win Academy"
        description="Terms and conditions for using Win Academy services and website."
        path="/terms"
      />
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-8">Terms & Conditions</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p>
            Welcome to Win Academy. By accessing our website and enrolling in our courses, you agree to be bound by these Terms and Conditions. Please read them carefully.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Enrollment and Payments</h2>
          <p>
            All course enrollments are subject to availability and payment confirmation. 
            Fees must be paid according to the schedule provided at the time of admission. 
            Win Academy reserves the right to suspend access to classes and materials for unpaid accounts.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. Code of Conduct</h2>
          <p>
            Students are expected to maintain a professional and respectful demeanor towards instructors, staff, and fellow students. Any form of harassment, disruption, or academic dishonesty will not be tolerated and may result in immediate dismissal without refund.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Intellectual Property</h2>
          <p>
            All course materials, lectures, and digital content provided by Win Academy are our exclusive property. They are for your personal educational use only and may not be reproduced, distributed, or sold without written permission.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Cancellations and Refunds</h2>
          <p>
            Refund policies vary by course. Please consult the specific refund policy provided during your enrollment. Administrative fees are generally non-refundable.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Modifications</h2>
          <p>
            Win Academy reserves the right to modify course content, schedules, instructors, or these terms at any time. We will notify enrolled students of any significant changes.
          </p>

          <p className="pt-8 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;

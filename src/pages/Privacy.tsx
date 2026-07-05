import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";

const Privacy = () => {
  return (
    <Layout>
      <SEOHead
        title="Privacy Policy - Win Academy"
        description="Privacy policy and data protection guidelines for Win Academy."
        path="/privacy"
      />
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
          <p>
            At Win Academy, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website or enroll in our programs.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We may collect personal information such as your name, email address, phone number, and physical address when you register for a course, subscribe to our newsletter, or contact us through our website.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            The information we collect is used to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process your enrollment and manage your student account.</li>
            <li>Communicate with you regarding course updates, schedules, and academy news.</li>
            <li>Improve our educational offerings and website experience.</li>
            <li>Respond to your inquiries and provide customer support.</li>
          </ul>

          <h2 className="text-xl font-bold mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">4. Sharing Your Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist us in operating our website or conducting our business, provided they agree to keep this information confidential.
          </p>

          <h2 className="text-xl font-bold mt-8 mb-4">5. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding this Privacy Policy, please contact us at our administrative office in Dadu or via the contact forms provided on our website.
          </p>

          <p className="pt-8 text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;

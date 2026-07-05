import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  created_at: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, content, featured_image, created_at")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        setNotFound(true);
      } else {
        setPost(data);
      }
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
            Post Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={post.title}
        description={post.content.substring(0, 160).replace(/\n/g, " ")}
        path={`/blog/${slug}`}
        type="article"
        image={post.featured_image || undefined}
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          image: post.featured_image || undefined,
          datePublished: post.created_at,
          author: { "@type": "Organization", name: "Win Academy" },
          publisher: {
            "@type": "Organization",
            name: "Win Academy",
            logo: { "@type": "ImageObject", url: "https://winacademy.tech/logo.png" },
          },
        }, {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.tech/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://winacademy.tech/blog" },
            { "@type": "ListItem", position: 3, name: post.title, item: `https://winacademy.tech/blog/${slug}` },
          ],
        }]}
      />
      <article className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link to="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
            </Button>

            {post.featured_image && (
              <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-8">
              {post.title}
            </h1>

            <div className="prose prose-lg max-w-none text-foreground">
              {post.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </article>
    </Layout>
  );
}

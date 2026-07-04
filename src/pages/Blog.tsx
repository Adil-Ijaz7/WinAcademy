import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Blog – Education News & Insights"
        description="Read the latest news, insights, and educational articles from Win Academy, Dadu. Tips on IT, programming, and academic success."
        path="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://winacademy.vercel.app/" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://winacademy.vercel.app/blog" },
          ],
        }}
      />
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest news, events, and insights from Win Academy
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts available yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/blog/${post.slug}`}>
                    {post.featured_image ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <h2 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-1 text-primary font-medium">
                        Read More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

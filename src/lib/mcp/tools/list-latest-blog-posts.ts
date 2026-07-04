import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
  const url = env.SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY ?? env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Backend environment is not configured for MCP tools.");
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_latest_blog_posts",
  title: "List latest blog posts",
  description: "Returns the latest published blog posts from the website.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      return {
        content: [{ type: "text", text: `Failed to load blog posts: ${error.message}` }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data ?? [], null, 2),
        },
      ],
      structuredContent: { posts: data ?? [] },
    };
  },
});

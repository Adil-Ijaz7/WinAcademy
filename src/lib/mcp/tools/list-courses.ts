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
  name: "list_courses",
  title: "List courses",
  description: "Returns active courses published on the academy website.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async () => {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("courses")
      .select("name, slug, duration, description")
      .eq("active", true)
      .order("display_order");

    if (error) {
      return {
        content: [{ type: "text", text: `Failed to load courses: ${error.message}` }],
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
      structuredContent: { courses: data ?? [] },
    };
  },
});

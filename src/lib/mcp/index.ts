import { defineMcp } from "@lovable.dev/mcp-js";
import listCoursesTool from "./tools/list-courses";
import listLatestBlogPostsTool from "./tools/list-latest-blog-posts";
import getSiteSettingsTool from "./tools/get-site-settings";

export default defineMcp({
  name: "winacademy-mcp",
  title: "Win Academy MCP",
  version: "0.1.0",
  instructions:
    "Use these tools to read Win Academy public content and settings when answering content and website questions.",
  tools: [listCoursesTool, listLatestBlogPostsTool, getSiteSettingsTool],
});

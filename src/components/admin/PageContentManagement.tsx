import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "./ImageUpload";
import { Pencil, RefreshCw, Save, Plus, Trash2 } from "lucide-react";

interface PageSection {
  id: string;
  page: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  metadata: any;
  display_order: number;
  active: boolean;
}

const ICON_OPTIONS = [
  "Award", "Laptop", "Users", "BookOpen", "GraduationCap", "Clock",
  "CheckCircle", "Star", "Heart", "Trophy", "Target", "Zap",
];

export function PageContentManagement() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<PageSection | null>(null);
  const [form, setForm] = useState<any>({});
  const [meta, setMeta] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSections = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("page_sections")
      .select("*")
      .order("page")
      .order("display_order");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setSections(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEdit = (section: PageSection) => {
    setEditing(section);
    setForm(section);
    setMeta(section.metadata || {});
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("page_sections")
      .update({
        title: form.title,
        subtitle: form.subtitle,
        content: form.content,
        image_url: form.image_url,
        metadata: meta,
      })
      .eq("id", editing.id);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Section updated!" });
      setShowDialog(false);
      fetchSections();
    }
    setIsSaving(false);
  };

  const pageLabels: Record<string, string> = { home: "Homepage", about: "About Page" };
  const sectionLabels: Record<string, string> = {
    hero: "Hero Section",
    cta: "Call to Action",
    why_choose: "Why Choose Us",
    who_we_are: "Who We Are",
    stats: "Statistics",
  };

  // ---- metadata helpers ----
  const updateMeta = (key: string, value: any) => setMeta((m: any) => ({ ...m, [key]: value }));

  const updateCta = (key: "cta_primary" | "cta_secondary", field: "text" | "link", value: string) =>
    setMeta((m: any) => ({ ...m, [key]: { ...(m[key] || {}), [field]: value } }));

  const updateStat = (i: number, field: "number" | "label", value: string) => {
    const stats = [...(meta.stats || [])];
    stats[i] = { ...stats[i], [field]: value };
    updateMeta("stats", stats);
  };
  const addStat = () => updateMeta("stats", [...(meta.stats || []), { number: "", label: "" }]);
  const removeStat = (i: number) =>
    updateMeta("stats", (meta.stats || []).filter((_: any, idx: number) => idx !== i));

  const updateFeature = (i: number, field: "icon" | "title" | "description", value: string) => {
    const features = [...(meta.features || [])];
    features[i] = { ...features[i], [field]: value };
    updateMeta("features", features);
  };
  const addFeature = () =>
    updateMeta("features", [...(meta.features || []), { icon: "Star", title: "", description: "" }]);
  const removeFeature = (i: number) =>
    updateMeta("features", (meta.features || []).filter((_: any, idx: number) => idx !== i));

  if (isLoading)
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  const groupedByPage: Record<string, PageSection[]> = {};
  sections.forEach((s) => {
    if (!groupedByPage[s.page]) groupedByPage[s.page] = [];
    groupedByPage[s.page].push(s);
  });

  const key = editing?.section_key;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-foreground">Page Content</h2>
        <Button variant="outline" size="sm" onClick={fetchSections}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {sections.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          No editable sections found yet.
        </p>
      )}

      {Object.entries(groupedByPage).map(([page, pageSections]) => (
        <div key={page} className="space-y-3">
          <h3 className="font-semibold text-foreground text-lg capitalize">
            {pageLabels[page] || page}
          </h3>
          <div className="space-y-2">
            {pageSections.map((section) => (
              <div
                key={section.id}
                className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {sectionLabels[section.section_key] || section.section_key}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {section.title || "(No title)"}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openEdit(section)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit: {editing ? sectionLabels[editing.section_key] || editing.section_key : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Common text fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title || ""}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle / Badge</Label>
                <Input
                  value={form.subtitle || ""}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.content || ""}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
              />
            </div>

            {/* Hero logo */}
            {key === "hero" && (
              <ImageUpload
                label="Logo Image"
                value={meta.logo_url || ""}
                onChange={(url) => {
                  updateMeta("logo_url", url);
                  setForm((f: any) => ({ ...f, image_url: url }));
                }}
              />
            )}

            {/* Section image (why_choose, generic) */}
            {key !== "hero" && (
              <ImageUpload
                label="Section Image"
                value={form.image_url || ""}
                onChange={(url) => setForm({ ...form, image_url: url })}
              />
            )}

            {/* Stats (hero) */}
            {key === "hero" && (
              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Stats</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStat}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
                {(meta.stats || []).map((stat: any, i: number) => (
                  <div key={i} className="flex items-end gap-2">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Number</Label>
                      <Input
                        value={stat.number || ""}
                        onChange={(e) => updateStat(i, "number", e.target.value)}
                        placeholder="500+"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={stat.label || ""}
                        onChange={(e) => updateStat(i, "label", e.target.value)}
                        placeholder="Students"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStat(i)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Features (why_choose) */}
            {key === "why_choose" && (
              <div className="space-y-3 rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Points / Features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="w-4 h-4 mr-1" /> Add point
                  </Button>
                </div>
                {(meta.features || []).map((feature: any, i: number) => (
                  <div key={i} className="space-y-2 rounded-lg border border-border/60 p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 space-y-1">
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={feature.title || ""}
                          onChange={(e) => updateFeature(i, "title", e.target.value)}
                        />
                      </div>
                      <div className="w-32 space-y-1">
                        <Label className="text-xs">Icon</Label>
                        <select
                          value={feature.icon || "Star"}
                          onChange={(e) => updateFeature(i, "icon", e.target.value)}
                          className="h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                        >
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-5"
                        onClick={() => removeFeature(i)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={feature.description || ""}
                        onChange={(e) => updateFeature(i, "description", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA buttons (hero + cta) */}
            {(key === "hero" || key === "cta") && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["cta_primary", "cta_secondary"] as const).map((ctaKey) => (
                  <div key={ctaKey} className="space-y-2 rounded-xl border border-border p-4">
                    <Label className="text-base">
                      {ctaKey === "cta_primary" ? "Primary Button" : "Secondary Button"}
                    </Label>
                    <div className="space-y-1">
                      <Label className="text-xs">Text</Label>
                      <Input
                        value={meta[ctaKey]?.text || ""}
                        onChange={(e) => updateCta(ctaKey, "text", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Link</Label>
                      <Input
                        value={meta[ctaKey]?.link || ""}
                        onChange={(e) => updateCta(ctaKey, "link", e.target.value)}
                        placeholder="/admissions"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Advanced JSON fallback */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm text-muted-foreground">
                  Advanced (raw data)
                </AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    value={JSON.stringify(meta, null, 2)}
                    onChange={(e) => {
                      try {
                        setMeta(JSON.parse(e.target.value));
                      } catch {
                        /* ignore invalid intermediate JSON */
                      }
                    }}
                    rows={8}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Only edit this if you know what you're doing.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button onClick={handleSave} disabled={isSaving} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

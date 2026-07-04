import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, RefreshCw } from "lucide-react";

export function SiteSettingsManagement() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSettings(data);
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    const { error } = await supabase.from("site_settings").update(settings).eq("id", settings.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Settings saved!" });
    }
    setIsSaving(false);
  };

  const update = (key: string, value: string) => setSettings((prev: any) => ({ ...prev, [key]: value }));

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!settings) return <p className="text-muted-foreground text-center py-8">No settings found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-foreground">Site Settings</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSettings}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}><Save className="w-4 h-4 mr-2" />{isSaving ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h3 className="font-semibold text-foreground">General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input value={settings.site_name || ""} onChange={(e) => update("site_name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={settings.logo_url || ""} onChange={(e) => update("logo_url", e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h3 className="font-semibold text-foreground">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={settings.phone || ""} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={settings.email || ""} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <Input value={settings.address || ""} onChange={(e) => update("address", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Office Hours</Label>
            <Input value={settings.office_hours || ""} onChange={(e) => update("office_hours", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Map Embed URL</Label>
            <Input value={settings.map_embed_url || ""} onChange={(e) => update("map_embed_url", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        <h3 className="font-semibold text-foreground">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Facebook URL</Label>
            <Input value={settings.social_facebook || ""} onChange={(e) => update("social_facebook", e.target.value)} placeholder="https://facebook.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Instagram URL</Label>
            <Input value={settings.social_instagram || ""} onChange={(e) => update("social_instagram", e.target.value)} placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2">
            <Label>YouTube URL</Label>
            <Input value={settings.social_youtube || ""} onChange={(e) => update("social_youtube", e.target.value)} placeholder="https://youtube.com/..." />
          </div>
          <div className="space-y-2">
            <Label>WhatsApp Number</Label>
            <Input value={settings.social_whatsapp || ""} onChange={(e) => update("social_whatsapp", e.target.value)} placeholder="+92..." />
          </div>
          <div className="space-y-2">
            <Label>Twitter/X URL</Label>
            <Input value={settings.social_twitter || ""} onChange={(e) => update("social_twitter", e.target.value)} placeholder="https://x.com/..." />
          </div>
        </div>
      </div>
    </div>
  );
}

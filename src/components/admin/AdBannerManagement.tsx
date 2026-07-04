import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, Upload, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  placement: string;
  display_order: number;
  active: boolean;
}

const placements = [
  { value: "home", label: "Home Page" },
  { value: "general", label: "General (All Placements)" },
];

export function AdBannerManagement() {
  const [banners, setBanners] = useState<AdBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<AdBanner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    link_url: "",
    placement: "general",
    active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("ad_banners")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch ad banners",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const openCreateDialog = () => {
    setSelectedBanner(null);
    setFormData({ title: "", link_url: "", placement: "general", active: true });
    setImageFile(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: AdBanner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      link_url: banner.link_url || "",
      placement: banner.placement,
      active: banner.active,
    });
    setImagePreview(banner.image_url);
    setImageFile(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile && !selectedBanner?.image_url) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let image_url = selectedBanner?.image_url || "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("ads")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("ads")
          .getPublicUrl(fileName);

        image_url = urlData.publicUrl;
      }

      const bannerData = {
        title: formData.title,
        image_url,
        link_url: formData.link_url || null,
        placement: formData.placement,
        active: formData.active,
      };

      if (selectedBanner) {
        const { error } = await supabase
          .from("ad_banners")
          .update(bannerData)
          .eq("id", selectedBanner.id);
        if (error) throw error;
        toast({ title: "Success", description: "Ad banner updated" });
      } else {
        const maxOrder = banners.length > 0 
          ? Math.max(...banners.map(b => b.display_order)) + 1 
          : 0;
        const { error } = await supabase
          .from("ad_banners")
          .insert([{ ...bannerData, display_order: maxOrder }]);
        if (error) throw error;
        toast({ title: "Success", description: "Ad banner created" });
      }

      setIsDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save ad banner",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBanner) return;

    try {
      const { error } = await supabase
        .from("ad_banners")
        .delete()
        .eq("id", selectedBanner.id);

      if (error) throw error;

      toast({ title: "Success", description: "Ad banner deleted" });
      setIsDeleteDialogOpen(false);
      fetchBanners();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete ad banner",
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (banner: AdBanner) => {
    try {
      const { error } = await supabase
        .from("ad_banners")
        .update({ active: !banner.active })
        .eq("id", banner.id);

      if (error) throw error;

      setBanners((prev) =>
        prev.map((b) =>
          b.id === banner.id ? { ...b, active: !b.active } : b
        )
      );

      toast({
        title: "Success",
        description: `Banner ${banner.active ? "deactivated" : "activated"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update banner",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Ad Banners</h2>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Banner
        </Button>
      </div>

      <div className="grid gap-4">
        {banners.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No ad banners yet. Create your first banner!
          </div>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-card border rounded-xl p-4 flex items-center gap-4 ${
                banner.active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-24 h-16 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {banner.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {placements.find((p) => p.value === banner.placement)?.label || banner.placement}
                </p>
                {banner.link_url && (
                  <a
                    href={banner.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 mt-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Link
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={banner.active}
                  onCheckedChange={() => toggleActive(banner)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(banner)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedBanner(banner);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedBanner ? "Edit Banner" : "Create New Banner"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link_url">Link URL (optional)</Label>
              <Input
                id="link_url"
                type="url"
                placeholder="https://..."
                value={formData.link_url}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link_url: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Placement</Label>
              <Select
                value={formData.placement}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, placement: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {placements.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Banner Image</Label>
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, active: checked }))
                }
              />
              <Label>Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : selectedBanner ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedBanner?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

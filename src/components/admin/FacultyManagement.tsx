import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FacultyMember {
  id: string;
  name: string;
  photo_url: string | null;
  role: string;
  qualifications: string[];
  expertise: string[];
  experience: string;
  display_order: number;
  active: boolean;
}

export function FacultyManagement() {
  const [members, setMembers] = useState<FacultyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState("");
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [qualInput, setQualInput] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expInput, setExpInput] = useState("");
  const [experience, setExperience] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("faculty_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      setMembers(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPhotoUrl("");
    setRole("");
    setQualifications([]);
    setQualInput("");
    setExpertise([]);
    setExpInput("");
    setExperience("");
    setActive(true);
    setEditingMember(null);
  };

  const openNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (m: FacultyMember) => {
    setEditingMember(m);
    setName(m.name);
    setPhotoUrl(m.photo_url || "");
    setRole(m.role);
    setQualifications(m.qualifications || []);
    setExpertise(m.expertise || []);
    setExperience(m.experience);
    setActive(m.active);
    setIsDialogOpen(true);
  };

  const addTag = (list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) => {
    const trimmed = input.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
    }
    setInput("");
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name || !role) {
      toast({ title: "Error", description: "Name and role are required", variant: "destructive" });
      return;
    }

    try {
      const payload = {
        name,
        photo_url: photoUrl || null,
        role,
        qualifications,
        expertise,
        experience,
        active,
      };

      if (editingMember) {
        const { error } = await supabase
          .from("faculty_members")
          .update(payload)
          .eq("id", editingMember.id);
        if (error) throw error;
        toast({ title: "Updated", description: "Faculty member updated" });
      } else {
        const maxOrder = members.length > 0 ? Math.max(...members.map((m) => m.display_order)) : 0;
        const { error } = await supabase
          .from("faculty_members")
          .insert({ ...payload, display_order: maxOrder + 1 });
        if (error) throw error;
        toast({ title: "Added", description: "Faculty member added" });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this faculty member?")) return;
    try {
      const { error } = await supabase.from("faculty_members").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Faculty member removed" });
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from("faculty_members")
        .update({ active: !current })
        .eq("id", id);
      if (error) throw error;
      fetchMembers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
        <h2 className="text-xl font-heading font-bold text-foreground">Faculty Members</h2>
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Faculty
        </Button>
      </div>

      {/* Members List */}
      <div className="grid gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg font-bold">
                  {m.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{m.name}</p>
              <p className="text-sm text-muted-foreground truncate">{m.role}</p>
            </div>
            <Badge variant={m.active ? "default" : "secondary"}>
              {m.active ? "Active" : "Hidden"}
            </Badge>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toggleActive(m.id, m.active)}>
                <Switch checked={m.active} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No faculty members yet</p>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit" : "Add"} Faculty Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <Label>Role / Designation *</Label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Principal & IT Head" />
            </div>
            <div>
              <Label>Photo URL</Label>
              <Input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>Experience</Label>
              <Input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 15+ years" />
            </div>

            {/* Qualifications tags */}
            <div>
              <Label>Qualifications</Label>
              <div className="flex gap-2">
                <Input
                  value={qualInput}
                  onChange={(e) => setQualInput(e.target.value)}
                  placeholder="Add qualification & press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(qualifications, setQualifications, qualInput, setQualInput);
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addTag(qualifications, setQualifications, qualInput, setQualInput)}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {qualifications.map((q, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {q}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(qualifications, setQualifications, i)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Expertise tags */}
            <div>
              <Label>Expertise</Label>
              <div className="flex gap-2">
                <Input
                  value={expInput}
                  onChange={(e) => setExpInput(e.target.value)}
                  placeholder="Add expertise & press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag(expertise, setExpertise, expInput, setExpInput);
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => addTag(expertise, setExpertise, expInput, setExpInput)}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {expertise.map((ex, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    {ex}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(expertise, setExpertise, i)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={active} onCheckedChange={setActive} />
              <Label>Visible on website</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                {editingMember ? "Update" : "Add"} Faculty
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

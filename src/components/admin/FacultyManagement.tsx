import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, GripVertical, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { ImageUpload } from "@/components/admin/ImageUpload";

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

interface SortableFacultyItemProps {
  member: FacultyMember;
  openEdit: (m: FacultyMember) => void;
  toggleActive: (id: string, current: boolean) => void;
  handleDelete: (id: string) => void;
}

function SortableFacultyItem({ member: m, openEdit, toggleActive, handleDelete }: SortableFacultyItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: m.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 relative"
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-primary active:cursor-grabbing p-1 -ml-1">
        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
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
        <div className="flex flex-wrap gap-1 mt-1">
          {m.qualifications?.slice(0, 2).map((q, i) => (
            <span key={i} className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{q}</span>
          ))}
          {(m.expertise?.length ?? 0) > 0 && (
            <span className="text-xs text-muted-foreground">|</span>
          )}
          {m.expertise?.slice(0, 2).map((e, i) => (
            <span key={i} className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">{e}</span>
          ))}
        </div>
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
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active: dragActive, over } = event;

    if (over && dragActive.id !== over.id) {
      const oldIndex = members.findIndex((m) => m.id === dragActive.id);
      const newIndex = members.findIndex((m) => m.id === over.id);

      const newMembers = arrayMove(members, oldIndex, newIndex);
      setMembers(newMembers);

      try {
        await Promise.all(
          newMembers.map((m, index) =>
            supabase
              .from("faculty_members")
              .update({ display_order: index + 1 })
              .eq("id", m.id)
          )
        );
      } catch (error: any) {
        toast({ title: "Error", description: "Failed to update order: " + error.message, variant: "destructive" });
        fetchMembers(); // Revert on failure
      }
    }
  };

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
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-4">
          <SortableContext 
            items={members.map(m => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {members.map((m) => (
              <SortableFacultyItem 
                key={m.id}
                member={m}
                openEdit={openEdit}
                toggleActive={toggleActive}
                handleDelete={handleDelete}
              />
            ))}
          </SortableContext>
          {members.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No faculty members yet</p>
          )}
        </div>
      </DndContext>

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
              <ImageUpload
                value={photoUrl}
                onChange={setPhotoUrl}
                label="Photo"
                bucket="gallery"
              />
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

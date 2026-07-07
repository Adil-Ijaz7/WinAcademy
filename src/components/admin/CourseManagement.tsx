import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";

interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  category: string;
  image_url: string | null;
  price: number | null;
  duration: string | null;
  schedule: string | null;
  enrollment_status: string;
  features: string[];
  active: boolean;
  display_order: number;
}

const emptyForm: Omit<Course, "id"> = {
  name: "", slug: "", description: "", short_description: "", category: "IT & Computer",
  image_url: "", price: null, duration: "", schedule: "", enrollment_status: "open",
  features: [], active: true, display_order: 0,
};

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [featuresText, setFeaturesText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("courses").select("*").order("display_order");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setCourses(data || []);
    setIsLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const openAdd = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setFeaturesText("");
    setShowDialog(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setForm(course);
    setFeaturesText((course.features || []).join("\n"));
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.slug) {
      toast({ title: "Name and slug are required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    const payload = { ...form, features: featuresText.split("\n").map((f: string) => f.trim()).filter(Boolean) };
    delete payload.id; delete payload.created_at; delete payload.updated_at;

    if (editingCourse) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editingCourse.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Course updated!" }); setShowDialog(false); fetchCourses(); }
    } else {
      const { error } = await supabase.from("courses").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Course added!" }); setShowDialog(false); fetchCourses(); }
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Course deleted!" }); fetchCourses(); }
  };

  const moveCourse = async (courseId: string, direction: "up" | "down") => {
    const sortedCourses = [...courses].sort((left, right) => left.display_order - right.display_order);
    const currentIndex = sortedCourses.findIndex((course) => course.id === courseId);

    if (currentIndex === -1) return;
    if (direction === "up" && currentIndex === 0) return;
    if (direction === "down" && currentIndex === sortedCourses.length - 1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentCourse = sortedCourses[currentIndex];
    const targetCourse = sortedCourses[targetIndex];

    const [currentUpdate, targetUpdate] = await Promise.all([
      supabase.from("courses").update({ display_order: targetCourse.display_order }).eq("id", currentCourse.id),
      supabase.from("courses").update({ display_order: currentCourse.display_order }).eq("id", targetCourse.id),
    ]);

    const error = currentUpdate.error || targetUpdate.error;
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Course order updated!" });
    fetchCourses();
  };

  const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSeedCourses = async () => {
    const initialCourses = [
      { name: "Java", slug: "java", category: "IT & Computer", short_description: "Learn Java programming.", description: "Comprehensive Java course.", active: true, display_order: 1 },
      { name: "Python", slug: "python", category: "IT & Computer", short_description: "Master Python programming.", description: "Learn Python from scratch.", active: true, display_order: 2 },
      { name: "C++", slug: "cpp", category: "IT & Computer", short_description: "Deep dive into C++.", description: "Understand C++ programming.", active: true, display_order: 3 },
      { name: "Web Development", slug: "web-development", category: "IT & Computer", short_description: "Build modern websites.", description: "Learn HTML, CSS, JS, and React.", active: true, display_order: 4 },
      { name: "AI", slug: "ai", category: "IT & Computer", short_description: "Intro to Artificial Intelligence.", description: "Explore AI and Machine Learning.", active: true, display_order: 5 },
      { name: "English Speak And Writing", slug: "english-speak-writing", category: "Academic", short_description: "Improve your English.", description: "Comprehensive course to enhance spoken and written English.", active: true, display_order: 6 },
      { name: "Chemistry", slug: "chemistry", category: "Academic", short_description: "Core chemistry concepts.", description: "In-depth academic chemistry course.", active: true, display_order: 7 },
      { name: "Physics", slug: "physics", category: "Academic", short_description: "Understand the laws of physics.", description: "Academic physics course.", active: true, display_order: 8 },
      { name: "Maths", slug: "maths", category: "Academic", short_description: "Advanced mathematics.", description: "Covering algebra, calculus, and geometry.", active: true, display_order: 9 },
      { name: "Dairy Work", slug: "dairy-work", category: "Vocational", short_description: "Learn modern dairy farming.", description: "Vocational training in dairy farm management.", active: true, display_order: 10 },
      { name: "Beautician", slug: "beautician", category: "Vocational", short_description: "Professional beautician training.", description: "Learn skin care, makeup, and salon management.", active: true, display_order: 11 },
      { name: "Sewing", slug: "sewing", category: "Vocational", short_description: "Master sewing and tailoring.", description: "Vocational training in dressmaking.", active: true, display_order: 12 },
      { name: "Office Automation", slug: "office-automation", category: "IT & Computer", short_description: "Master MS Office.", description: "Essential computer skills for the workplace.", active: true, display_order: 13 },
      { name: "CIT", slug: "cit", category: "IT & Computer", short_description: "Certificate in IT.", description: "Fundamental Certificate in Information Technology.", active: true, display_order: 14 },
      { name: "DIT", slug: "dit", category: "IT & Computer", short_description: "Diploma in IT.", description: "Comprehensive Diploma in Information Technology.", active: true, display_order: 15 }
    ];

    if (!confirm("Are you sure you want to add all 15 initial courses?")) return;
    
    setIsLoading(true);
    for (const c of initialCourses) {
      await supabase.from("courses").insert(c);
    }
    toast({ title: "Successfully seeded courses!" });
    fetchCourses();
  };

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-[200px]" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-foreground">Courses ({courses.length})</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleSeedCourses}>Auto-Fill 15 Courses</Button>
          <Button variant="outline" size="sm" onClick={fetchCourses}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-2" />Add Course</Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Course</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">Duration</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((course, index) => (
              <tr key={course.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{course.name}</p>
                  <p className="text-xs text-muted-foreground">{course.short_description}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-sm text-muted-foreground">{course.category}</td>
                <td className="px-4 py-3 hidden lg:table-cell text-sm text-muted-foreground">{course.duration}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${course.active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                    {course.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => moveCourse(course.id, "up")} disabled={index === 0}>
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => moveCourse(course.id, "down")} disabled={index === courses.length - 1}>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(course)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Edit Course" : "Add Course"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: editingCourse ? form.slug : generateSlug(e.target.value) }); }} />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Short Description</Label>
              <Input value={form.short_description || ""} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Full Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT & Computer">IT & Computer</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Vocational">Vocational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Price (PKR)</Label>
                <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: e.target.value ? Number(e.target.value) : null })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Schedule</Label>
                <Input value={form.schedule || ""} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="e.g. Mon-Fri 10AM-12PM" />
              </div>
              <div className="space-y-2">
                <Label>Enrollment Status</Label>
                <Select value={form.enrollment_status} onValueChange={(v) => setForm({ ...form, enrollment_status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image_url || ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Features (one per line)</Label>
              <Textarea value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} rows={3} placeholder="Feature 1&#10;Feature 2&#10;Feature 3" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <Label>Active</Label>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full">{isSaving ? "Saving..." : editingCourse ? "Update Course" : "Add Course"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

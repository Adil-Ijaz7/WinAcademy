import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield,
  LogOut,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  ChevronDown,
  Image,
  FileText,
  Newspaper,
  Megaphone,
  GraduationCap,
  DollarSign,
  Settings,
  UserCheck,
  BookOpen,
  MessageSquare,
  Layout as LayoutIcon,
  Globe,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { GalleryManagement } from "@/components/admin/GalleryManagement";
import { BlogManagement } from "@/components/admin/BlogManagement";
import { AdBannerManagement } from "@/components/admin/AdBannerManagement";
import { StudentManagement } from "@/components/admin/StudentManagement";
import { FeeManagement } from "@/components/admin/FeeManagement";
import { ChangePassword } from "@/components/admin/ChangePassword";
import { FacultyManagement } from "@/components/admin/FacultyManagement";
import { SiteSettingsManagement } from "@/components/admin/SiteSettingsManagement";
import { CourseManagement } from "@/components/admin/CourseManagement";
import { TestimonialManagement } from "@/components/admin/TestimonialManagement";
import { PageContentManagement } from "@/components/admin/PageContentManagement";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  guardian_name: string;
  guardian_phone: string;
  previous_education: string;
  course_interest: string;
  message: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  father_name: string | null;
  cnic_bform: string | null;
  whatsapp_number: string | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  reviewing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  approved: "bg-green-500/10 text-green-600 border-green-500/20",
  rejected: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  reviewing: <Eye className="w-3 h-3" />,
  approved: <CheckCircle className="w-3 h-3" />,
  rejected: <XCircle className="w-3 h-3" />,
};

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/admin/auth");
      } else if (!isAdmin) {
        navigate("/admin/auth");
      } else {
        fetchApplications();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    filterApplications();
  }, [applications, searchQuery, statusFilter, courseFilter]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("admission_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.full_name.toLowerCase().includes(query) ||
          app.email.toLowerCase().includes(query) ||
          app.phone.includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((app) => app.course_interest === courseFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("admission_applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );

      toast({
        title: "Status Updated",
        description: `Application marked as ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const courses = [...new Set(applications.map((app) => app.course_interest))];

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage applications & content
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="applications" className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <TabsList className="flex lg:flex-col justify-start overflow-x-auto lg:overflow-visible w-full lg:w-56 lg:min-w-56 h-auto items-start gap-1 bg-transparent p-0 flex-nowrap pb-2 lg:pb-0 scrollbar-hide">
              <TabsTrigger value="applications" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                <span className="inline">Applications</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="inline">Students</span>
              </TabsTrigger>
              <TabsTrigger value="fees" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <DollarSign className="w-4 h-4 mr-2" />
                <span className="inline">Fees</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <Image className="w-4 h-4 mr-2" />
                <span className="inline">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <Newspaper className="w-4 h-4 mr-2" />
                <span className="inline">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="ads" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <Megaphone className="w-4 h-4 mr-2" />
                <span className="inline">Ads</span>
              </TabsTrigger>
              <TabsTrigger value="faculty" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <UserCheck className="w-4 h-4 mr-2" />
                <span className="inline">Faculty</span>
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="inline">Testimonials</span>
              </TabsTrigger>
              <TabsTrigger value="pages" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <LayoutIcon className="w-4 h-4 mr-2" />
                <span className="inline">Pages</span>
              </TabsTrigger>
              <TabsTrigger value="site-settings" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <Globe className="w-4 h-4 mr-2" />
                <span className="inline">Site</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="w-full justify-start text-left data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none px-4 py-2.5 rounded-lg whitespace-nowrap lg:whitespace-normal font-medium transition-colors">
                <Settings className="w-4 h-4 mr-2" />
                <span className="inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-w-0 w-full lg:max-w-[calc(100%-16rem)]">
              {/* Applications Tab */}
              <TabsContent value="applications" className="mt-0 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.reviewing}</p>
                      <p className="text-xs text-muted-foreground">Reviewing</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                      <p className="text-xs text-muted-foreground">Approved</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-xl border border-border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                      <p className="text-xs text-muted-foreground">Rejected</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={fetchApplications}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Applications Table */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Applicant
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                          Course
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                          Applied On
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredApplications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-12 text-center">
                            <p className="text-muted-foreground">No applications found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-4">
                              <div>
                                <p className="font-medium text-foreground">{app.full_name}</p>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell">
                              <span className="text-sm text-foreground">{app.course_interest}</span>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <span className="text-sm text-muted-foreground">
                                {new Date(app.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <Badge
                                variant="outline"
                                className={`${statusColors[app.status]} flex items-center gap-1 w-fit`}
                              >
                                {statusIcons[app.status]}
                                {app.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      Status <ChevronDown className="w-4 h-4 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => updateStatus(app.id, "pending")}>
                                      <Clock className="w-4 h-4 mr-2" /> Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStatus(app.id, "reviewing")}>
                                      <Eye className="w-4 h-4 mr-2" /> Reviewing
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStatus(app.id, "approved")}>
                                      <CheckCircle className="w-4 h-4 mr-2" /> Approved
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => updateStatus(app.id, "rejected")}>
                                      <XCircle className="w-4 h-4 mr-2" /> Rejected
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <CourseManagement />
            </TabsContent>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <GalleryManagement />
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog">
              <BlogManagement />
            </TabsContent>

            {/* Ads Tab */}
            <TabsContent value="ads">
              <AdBannerManagement />
            </TabsContent>

            {/* Faculty Tab */}
            <TabsContent value="faculty">
              <FacultyManagement />
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials">
              <TestimonialManagement />
            </TabsContent>

            {/* Pages Tab */}
            <TabsContent value="pages">
              <PageContentManagement />
            </TabsContent>

            {/* Site Settings Tab */}
            <TabsContent value="site-settings">
              <SiteSettingsManagement />
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-card rounded-xl border border-border p-6">
                <ChangePassword />
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students">
              <StudentManagement />
            </TabsContent>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <FeeManagement />
            </TabsContent>
            </div>
          </Tabs>

          {/* Application Detail Modal */}
          <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Application Details
                  {selectedApplication && (
                    <Badge
                      variant="outline"
                      className={statusColors[selectedApplication.status]}
                    >
                      {selectedApplication.status}
                    </Badge>
                  )}
                </DialogTitle>
              </DialogHeader>
              {selectedApplication && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{selectedApplication.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Father's Name</p>
                      <p className="font-medium text-foreground">{selectedApplication.father_name || selectedApplication.guardian_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedApplication.date_of_birth).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium text-foreground capitalize">
                        {selectedApplication.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CNIC / B-Form</p>
                      <p className="font-medium text-foreground">{selectedApplication.cnic_bform || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium text-foreground">{selectedApplication.whatsapp_number || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{selectedApplication.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">City</p>
                      <p className="font-medium text-foreground">{selectedApplication.city}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium text-foreground">{selectedApplication.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Previous Education</p>
                      <p className="font-medium text-foreground">
                        {selectedApplication.previous_education}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Course Interest</p>
                      <p className="font-medium text-foreground">
                        {selectedApplication.course_interest}
                      </p>
                    </div>
                    {selectedApplication.message && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Additional Message</p>
                        <p className="font-medium text-foreground">{selectedApplication.message}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Applied On</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedApplication.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(selectedApplication.id, "reviewing")}
                    >
                      Mark Reviewing
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateStatus(selectedApplication.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => updateStatus(selectedApplication.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </Layout>
  );
}

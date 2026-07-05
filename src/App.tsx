import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import About from "./pages/About";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Admissions from "./pages/Admissions";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h2 className="text-2xl font-bold mb-4">Oops, something went wrong!</h2>
    <p className="text-muted-foreground mb-6 max-w-md">{error.message}</p>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AnimatedRoutes />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main 
        className="flex-1 pt-16 lg:pt-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
      <MobileNav />
    </div>
  );
}

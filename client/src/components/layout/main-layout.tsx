import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  user?: { name: string; email: string; role: string };
}

export function MainLayout({ children, title, user }: MainLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar isCollapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} user={user} onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

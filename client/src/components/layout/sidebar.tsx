import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Building, Users, Award, CheckSquare, Calendar, Handshake, Laptop, Truck, BarChart3 } from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
}

const navigationItems = [
  { name: "Analistas", href: "/analysts", icon: Users },
  { name: "Clientes", href: "/clients", icon: Building },
  { name: "Certificações", href: "/certifications", icon: Award },
  { name: "Tarefas", href: "/tasks", icon: CheckSquare },
  { name: "Agenda Global", href: "/calendar", icon: Calendar },
  { name: "Visitas", href: "/visits", icon: Handshake },
];

const futureItems = [
  { name: "Equipamentos", href: "/equipment", icon: Laptop, disabled: true },
  { name: "Fornecedores", href: "/suppliers", icon: Truck, disabled: true },
  { name: "Relatórios", href: "/reports", icon: BarChart3, disabled: true },
];

export function Sidebar({ isCollapsed = false }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex-shrink-0 border-r border-gray-200 dark:border-gray-700",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Building className="text-primary-foreground" size={20} />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">OL Tecnologia</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Painel de Gestão</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href === "/analysts" && location === "/");
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                >
                  <Icon size={20} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </div>
              </Link>
            );
          })}
          
          {/* Future Items */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 mb-2">
                Em Breve
              </p>
            )}
            
            {futureItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <div
                  key={item.name}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <>
                      <span>{item.name}</span>
                      <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                        Em breve
                      </span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}

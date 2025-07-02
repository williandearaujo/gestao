// src/pages/dashboard.tsx

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Award, CheckSquare } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const displayName = user?.fullName || user?.username || user?.emailAddresses[0]?.emailAddress || "usuário";

  return (
    <MainLayout title="Dashboard" user={{ name: displayName, email: "", role: "" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analistas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">cadastrados no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificações</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">em desenvolvimento</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao Painel OL Tecnologia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este é o sistema de gestão empresarial da OL Tecnologia. 
            Use o menu lateral para navegar entre os módulos disponíveis.
          </p>
          <p className="text-muted-foreground mt-2">
            Atualmente, o módulo de Analistas está totalmente funcional. 
            Os demais módulos estão em desenvolvimento.
          </p>
        </CardContent>
      </Card>
    </MainLayout>
  );
}

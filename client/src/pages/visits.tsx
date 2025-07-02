import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, Plus } from "lucide-react";

interface VisitsProps {
  user: { name: string; email: string; role: string };
}

export default function Visits({ user }: VisitsProps) {
  return (
    <MainLayout title="Gestão de Visitas" user={user}>
      <div className="text-center py-12">
        <Handshake size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Módulo de Visitas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Este módulo está em desenvolvimento. Em breve você poderá cadastrar e
          acompanhar visitas técnicas dos analistas aos clientes.
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Previstas</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Cadastro com cliente, analista e data</li>
              <li>• Resumo e ações realizadas</li>
              <li>• Visualização por cliente ou analista</li>
              <li>• Integração com calendário</li>
              <li>• Bloqueio em períodos de férias</li>
              <li>• Exportação de relatórios futuramente</li>
            </ul>
          </CardContent>
        </Card>
        
        <Button disabled className="mt-6">
          <Plus size={16} className="mr-2" />
          Nova Visita (Em breve)
        </Button>
      </div>
    </MainLayout>
  );
}
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus } from "lucide-react";

interface TasksProps {
  user: { name: string; email: string; role: string };
}

export default function Tasks({ user }: TasksProps) {
  return (
    <MainLayout title="Gestão de Tarefas" user={user}>
      <div className="text-center py-12">
        <CheckSquare size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Módulo de Tarefas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Este módulo está em desenvolvimento. Em breve você poderá atribuir e
          acompanhar tarefas dos analistas com controle de prazos.
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Previstas</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Atribuir tarefas a um ou mais analistas</li>
              <li>• Controle de data de criação e previsão</li>
              <li>• Registro de conclusão real</li>
              <li>• Histórico de tarefas concluídas</li>
              <li>• Alertas para tarefas em Day Off</li>
              <li>• Filtros por status e analista</li>
            </ul>
          </CardContent>
        </Card>
        
        <Button disabled className="mt-6">
          <Plus size={16} className="mr-2" />
          Nova Tarefa (Em breve)
        </Button>
      </div>
    </MainLayout>
  );
}
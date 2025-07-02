import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface CalendarProps {
  user: { name: string; email: string; role: string };
}

export default function CalendarPage({ user }: CalendarProps) {
  return (
    <MainLayout title="Agenda Global" user={user}>
      <div className="text-center py-12">
        <Calendar size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Agenda Global
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Este módulo está em desenvolvimento. Em breve você terá uma agenda
          visual completa com controle de conflitos inteligentes.
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Previstas</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Visual mensal e semanal com filtros</li>
              <li>• Tipos: Férias, Day Off, Visitas, Tarefas</li>
              <li>• Cores por equipe personalizáveis</li>
              <li>• Detecção de conflitos inteligente</li>
              <li>• Bloqueio de sobreposições</li>
              <li>• Alertas para equipes com Day Off na mesma semana</li>
            </ul>
          </CardContent>
        </Card>
        
        <Button disabled className="mt-6">
          <Plus size={16} className="mr-2" />
          Novo Evento (Em breve)
        </Button>
      </div>
    </MainLayout>
  );
}
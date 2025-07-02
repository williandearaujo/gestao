import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Plus } from "lucide-react";

interface CertificationsProps {
  user: { name: string; email: string; role: string };
}

export default function Certifications({ user }: CertificationsProps) {
  return (
    <MainLayout title="Gestão de Certificações" user={user}>
      <div className="text-center py-12">
        <Award size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Módulo de Certificações
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Este módulo está em desenvolvimento. Em breve você poderá gerenciar certificações
          dos analistas com controle de validade e alertas.
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Previstas</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Certificações associadas aos analistas</li>
              <li>• Controle de validade e número do certificado</li>
              <li>• Tipos e status (vencida/em dia)</li>
              <li>• Alertas visuais de vencimento</li>
              <li>• Busca e filtros avançados</li>
              <li>• Notificações próximo ao vencimento</li>
            </ul>
          </CardContent>
        </Card>
        
        <Button disabled className="mt-6">
          <Plus size={16} className="mr-2" />
          Nova Certificação (Em breve)
        </Button>
      </div>
    </MainLayout>
  );
}
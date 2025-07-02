import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";

interface ClientsProps {
  user: { name: string; email: string; role: string };
}

export default function Clients({ user }: ClientsProps) {
  return (
    <MainLayout title="Gestão de Clientes" user={user}>
      <div className="text-center py-12">
        <Building size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Módulo de Clientes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Este módulo está em desenvolvimento. Em breve você poderá gerenciar seus clientes,
          cadastrar CNPJ, contatos múltiplos e muito mais.
        </p>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Previstas</CardTitle>
          </CardHeader>
          <CardContent className="text-left">
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Cadastro com nome, CNPJ e múltiplos contatos</li>
              <li>• Links e produtos associados</li>
              <li>• Sistema de observações</li>
              <li>• Filtros e busca avançada</li>
              <li>• Cards interativos com dados detalhados</li>
              <li>• Ativação e desativação de clientes</li>
            </ul>
          </CardContent>
        </Card>
        
        <Button disabled className="mt-6">
          <Plus size={16} className="mr-2" />
          Novo Cliente (Em breve)
        </Button>
      </div>
    </MainLayout>
  );
}
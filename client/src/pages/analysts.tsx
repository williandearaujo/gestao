import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { AnalystCard } from "@/components/analyst/analyst-card";
import { AnalystForm } from "@/components/analyst/analyst-form";
import { SalaryHistoryModal } from "@/components/analyst/salary-history-modal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Analyst } from "@shared/schema";

interface AnalystsProps {
  user?: { name?: string; email?: string; role?: string };
}

export default function Analysts({ user }: AnalystsProps) {
  const userRole = user?.role ?? "analyst"; // Proteção

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSalaryHistoryOpen, setIsSalaryHistoryOpen] = useState(false);
  const [selectedAnalyst, setSelectedAnalyst] = useState<Analyst | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [positionFilter, setPositionFilter] = useState<string>("all");

  const queryClient = useQueryClient();

  const { data: analysts = [], isLoading } = useQuery<Analyst[]>({
    queryKey: ["/api/analysts"],
  });

  const createAnalystMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/analysts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analysts"] });
      setIsFormOpen(false);
      setSelectedAnalyst(null);
    },
  });

  const updateAnalystMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      apiRequest("PUT", `/api/analysts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analysts"] });
      setIsFormOpen(false);
      setSelectedAnalyst(null);
    },
  });

  const handleFormSubmit = (data: any) => {
    if (selectedAnalyst) {
      updateAnalystMutation.mutate({ id: selectedAnalyst.id, data });
    } else {
      createAnalystMutation.mutate(data);
    }
  };

  const handleEdit = (analyst: Analyst) => {
    setSelectedAnalyst(analyst);
    setIsFormOpen(true);
  };

  const handleViewHistory = (analyst: Analyst) => {
    setSelectedAnalyst(analyst);
    setIsSalaryHistoryOpen(true);
  };

  const filteredAnalysts = analysts.filter((analyst: Analyst) => {
    if (statusFilter !== "all" && analyst.isActive !== (statusFilter === "active")) {
      return false;
    }
    if (positionFilter !== "all" && analyst.position !== positionFilter) {
      return false;
    }
    return true;
  });

  return (
    <MainLayout title="Gestão de Analistas" user={user}>
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus size={16} className="mr-2" />
            Novo Analista
          </Button>

          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos os Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos os Cargos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Cargos</SelectItem>
                <SelectItem value="junior">Analista Jr</SelectItem>
                <SelectItem value="pleno">Analista Pleno</SelectItem>
                <SelectItem value="senior">Analista Sr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Users size={16} />
          <span>
            {filteredAnalysts.length} analistas{" "}
            {statusFilter ? `(${statusFilter === "active" ? "ativos" : "inativos"})` : "cadastrados"}
          </span>
        </div>
      </div>

      {/* Analysts Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando analistas...</p>
        </div>
      ) : filteredAnalysts.length === 0 ? (
        <div className="text-center py-8">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-2">
            {analysts.length === 0
              ? "Nenhum analista cadastrado"
              : "Nenhum analista encontrado com os filtros aplicados"}
          </p>
          {analysts.length === 0 && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus size={16} className="mr-2" />
              Cadastrar primeiro analista
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAnalysts.map((analyst: Analyst) => (
            <AnalystCard
              key={analyst.id}
              analyst={analyst}
              userRole={userRole}
              onEdit={handleEdit}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnalystForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedAnalyst(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedAnalyst || undefined}
        userRole={userRole}
        isLoading={createAnalystMutation.isPending || updateAnalystMutation.isPending}
      />

      <SalaryHistoryModal
        isOpen={isSalaryHistoryOpen}
        onClose={() => {
          setIsSalaryHistoryOpen(false);
          setSelectedAnalyst(null);
        }}
        analyst={selectedAnalyst}
      />
    </MainLayout>
  );
}

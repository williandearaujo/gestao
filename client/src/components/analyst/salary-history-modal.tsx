import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { insertSalaryHistorySchema, type SalaryHistory, type Analyst } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { z } from "zod";

const salaryFormSchema = insertSalaryHistorySchema.omit({ analystId: true });
type SalaryFormData = z.infer<typeof salaryFormSchema>;

interface SalaryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyst: Analyst | null;
}

export function SalaryHistoryModal({ isOpen, onClose, analyst }: SalaryHistoryModalProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<SalaryFormData>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: {
      previousAmount: analyst?.currentSalary || "",
      newAmount: "",
      adjustmentDate: new Date(),
      notes: "",
    },
  });

  const { data: salaryHistory = [], isLoading } = useQuery({
    queryKey: ["/api/analysts", analyst?.id, "salary-history"],
    enabled: !!analyst?.id && isOpen,
  });

  const addSalaryMutation = useMutation({
    mutationFn: (data: SalaryFormData) =>
      apiRequest("POST", `/api/analysts/${analyst?.id}/salary-history`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analysts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analysts", analyst?.id, "salary-history"] });
      form.reset();
    },
  });

  const handleSubmit = (data: SalaryFormData) => {
    addSalaryMutation.mutate(data);
  };

  if (!analyst) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico Salarial - {analyst.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Salary Adjustment */}
          <div className="bg-primary/10 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-primary mb-3">Novo Ajuste Salarial</h4>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs font-medium">Data do Ajuste</Label>
                  <Input
                    type="date"
                    {...form.register("adjustmentDate")}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Valor Anterior</Label>
                  <Input
                    value={formatCurrency(analyst.currentSalary)}
                    readOnly
                    className="text-sm bg-gray-100 dark:bg-gray-600"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Novo Valor</Label>
                  <Input
                    placeholder="R$ 0,00"
                    {...form.register("newAmount")}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium">Ação</Label>
                  <Button
                    type="submit"
                    className="w-full text-sm"
                    disabled={addSalaryMutation.isPending}
                  >
                    {addSalaryMutation.isPending ? "Adicionando..." : "Adicionar"}
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium">Observações</Label>
                <Input
                  placeholder="Motivo do ajuste..."
                  {...form.register("notes")}
                  className="text-sm"
                />
              </div>
            </form>
          </div>

          {/* History Timeline */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Histórico de Aumentos
            </h4>
            
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando histórico...</p>
              </div>
            ) : salaryHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum histórico salarial encontrado.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {salaryHistory.map((record: SalaryHistory) => (
                  <div
                    key={record.id}
                    className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(record.adjustmentDate)}
                        </h5>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(record.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        {record.previousAmount && (
                          <>
                            <span className="text-gray-600 dark:text-gray-400">
                              De: <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(record.previousAmount)}
                              </span>
                            </span>
                            <ArrowRight size={16} className="text-primary" />
                          </>
                        )}
                        <span className="text-gray-600 dark:text-gray-400">
                          Para: <span className="font-medium text-green-600">
                            {formatCurrency(record.newAmount)}
                          </span>
                        </span>
                        {record.previousAmount && (
                          <span className="text-green-600 font-medium">
                            +{formatCurrency(parseFloat(record.newAmount) - parseFloat(record.previousAmount))}
                          </span>
                        )}
                      </div>
                      {record.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

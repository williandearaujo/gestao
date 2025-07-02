import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAnalystSchema, type InsertAnalyst, type Analyst } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Trash2, Plus } from "lucide-react";
import { z } from "zod";

const analystFormSchema = insertAnalystSchema.extend({
  vacationPeriods: z.array(z.object({
    startDate: z.string(),
    endDate: z.string(),
  })).optional(),
});

type AnalystFormData = z.infer<typeof analystFormSchema>;

interface AnalystFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AnalystFormData) => void;
  initialData?: Analyst;
  userRole: string;
  isLoading?: boolean;
}

export function AnalystForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  userRole,
  isLoading = false 
}: AnalystFormProps) {
  const canEditSalary = userRole === 'admin' || userRole === 'manager';
  
  const form = useForm<AnalystFormData>({
    resolver: zodResolver(analystFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      position: initialData?.position || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      isActive: initialData?.isActive ?? true,
      dayOffEnabled: initialData?.dayOffEnabled || false,
      observations: initialData?.observations || "",
      performance: initialData?.performance || "",
      currentSalary: initialData?.currentSalary || "",
      lastSalaryAdjustment: initialData?.lastSalaryAdjustment ? new Date(initialData.lastSalaryAdjustment) : undefined,
      vacationPeriods: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vacationPeriods",
  });

  const handleSubmit = (data: AnalystFormData) => {
    onSubmit(data);
  };

  const addVacationPeriod = () => {
    if (fields.length < 4) {
      append({ startDate: "", endDate: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Analista" : "Novo Analista"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                {...form.register("name")}
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Cargo *</Label>
              <Select 
                onValueChange={(value) => form.setValue("position", value)}
                defaultValue={form.getValues("position")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Analista Junior</SelectItem>
                  <SelectItem value="pleno">Analista Pleno</SelectItem>
                  <SelectItem value="senior">Analista Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de Entrada *</Label>
              <Input
                id="startDate"
                type="date"
                {...form.register("startDate")}
                className={form.formState.errors.startDate ? "border-red-500" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <Select 
                onValueChange={(value) => form.setValue("isActive", value === "true")}
                defaultValue={form.getValues("isActive").toString()}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Information (Admin/Manager only) */}
          {canEditSalary && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Informações Salariais
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentSalary">Salário Atual</Label>
                  <Input
                    id="currentSalary"
                    placeholder="R$ 0,00"
                    {...form.register("currentSalary")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastSalaryAdjustment">Data do Último Ajuste</Label>
                  <Input
                    id="lastSalaryAdjustment"
                    type="date"
                    {...form.register("lastSalaryAdjustment")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Vacation Periods */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Períodos de Férias (máximo 4)
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVacationPeriod}
                disabled={fields.length >= 4}
              >
                <Plus size={16} className="mr-2" />
                Adicionar
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-xs">Data Início</Label>
                  <Input
                    type="date"
                    {...form.register(`vacationPeriods.${index}.startDate`)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Data Fim</Label>
                  <Input
                    type="date"
                    {...form.register(`vacationPeriods.${index}.endDate`)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="dayOffEnabled"
                checked={form.watch("dayOffEnabled")}
                onCheckedChange={(checked) => form.setValue("dayOffEnabled", !!checked)}
              />
              <Label htmlFor="dayOffEnabled">Habilitar Day Off</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                rows={3}
                {...form.register("observations")}
              />
            </div>
            
            {canEditSalary && (
              <div className="space-y-2">
                <Label htmlFor="performance">Desempenho</Label>
                <Select 
                  onValueChange={(value) => form.setValue("performance", value)}
                  defaultValue={form.getValues("performance")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar avaliação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excelente</SelectItem>
                    <SelectItem value="good">Bom</SelectItem>
                    <SelectItem value="average">Regular</SelectItem>
                    <SelectItem value="needs_improvement">Precisa melhorar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Analista"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

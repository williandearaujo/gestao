import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, formatDate, getPositionLabel } from "@/lib/utils";
import { Edit, History } from "lucide-react";
import type { Analyst } from "@shared/schema";

interface AnalystCardProps {
  analyst: Analyst;
  userRole: string;
  onEdit: (analyst: Analyst) => void;
  onViewHistory: (analyst: Analyst) => void;
}

export function AnalystCard({ analyst, userRole, onEdit, onViewHistory }: AnalystCardProps) {
  const canViewSalary = userRole === 'admin' || userRole === 'manager';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={analyst.name} />
              <AvatarFallback>
                {analyst.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{analyst.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {getPositionLabel(analyst.position)}
              </p>
            </div>
          </div>
          <Badge variant={analyst.isActive ? "default" : "secondary"}>
            {analyst.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Data de entrada:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatDate(analyst.startDate)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Day Off:</span>
            <div className="flex items-center space-x-2">
              <Checkbox checked={analyst.dayOffEnabled} disabled />
              <span className={analyst.dayOffEnabled ? "text-green-600" : "text-gray-600 dark:text-gray-400"}>
                {analyst.dayOffEnabled ? "Habilitado" : "Desabilitado"}
              </span>
            </div>
          </div>
          
          {/* Salary info - visible only to Admin/Manager */}
          {canViewSalary && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Salário atual:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {formatCurrency(analyst.currentSalary)}
                </span>
              </div>
              {analyst.lastSalaryAdjustment && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Último ajuste:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {formatDate(analyst.lastSalaryAdjustment)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(analyst)}
          >
            <Edit size={16} className="mr-2" />
            Editar
          </Button>
          {canViewSalary && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewHistory(analyst)}
            >
              <History size={16} className="mr-2" />
              Histórico
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

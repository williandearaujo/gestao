import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | undefined): string {
  if (!amount) return "R$ 0,00";
  
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numericAmount);
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return "";
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

export function getPositionLabel(position: string): string {
  const positions: Record<string, string> = {
    'junior': 'Analista Junior',
    'pleno': 'Analista Pleno',
    'senior': 'Analista Senior'
  };
  return positions[position] || position;
}

export function getStatusColor(isActive: boolean): string {
  return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
}

export function getPerformanceLabel(performance: string): string {
  const labels: Record<string, string> = {
    'excellent': 'Excelente',
    'good': 'Bom',
    'average': 'Regular',
    'needs_improvement': 'Precisa melhorar'
  };
  return labels[performance] || performance;
}

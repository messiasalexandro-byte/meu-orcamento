import type { TransactionType } from './types';

export interface Category {
  name: string;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { name: 'Alimentação', color: '#f97316' },
  { name: 'Aluguel', color: '#6366f1' },
  { name: 'Transporte', color: '#0ea5e9' },
  { name: 'Lazer', color: '#ec4899' },
  { name: 'Saúde', color: '#14b8a6' },
  { name: 'Educação', color: '#a855f7' },
  { name: 'Contas (luz/água/internet)', color: '#eab308' },
  { name: 'Compras', color: '#ef4444' },
  { name: 'Outros', color: '#64748b' },
];

export const INCOME_CATEGORIES: Category[] = [
  { name: 'Salário', color: '#16a34a' },
  { name: 'Freelance', color: '#22c55e' },
  { name: 'Investimentos', color: '#84cc16' },
  { name: 'Outros', color: '#64748b' },
];

export function categoriesFor(type: TransactionType): Category[] {
  return type === 'receita' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function categoryColor(name: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.name === name)?.color ?? '#64748b';
}

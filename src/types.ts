export type TransactionType = 'receita' | 'despesa';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  /** Data no formato YYYY-MM-DD */
  date: string;
}

export type NewTransaction = Omit<Transaction, 'id'>;

import { useEffect, useState } from 'react';
import type { NewTransaction, Transaction } from '../types';
import { newId } from '../utils/format';

const STORAGE_KEY = 'orcamento:transacoes';

/** Nomes antigos de categoria que foram renomeados. */
const RENAMED_CATEGORIES: Record<string, string> = {
  Contas: 'Contas (luz/água/internet)',
};

function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    (t.type === 'receita' || t.type === 'despesa') &&
    typeof t.description === 'string' &&
    typeof t.amount === 'number' &&
    Number.isFinite(t.amount) &&
    t.amount > 0 &&
    typeof t.category === 'string' &&
    typeof t.date === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(t.date)
  );
}

function load(): Transaction[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTransaction).map((t) =>
      t.type === 'despesa' && RENAMED_CATEGORIES[t.category]
        ? { ...t, category: RENAMED_CATEGORIES[t.category] }
        : t,
    );
  } catch {
    // JSON ilegível: guarda uma cópia antes que o app sobrescreva a chave.
    try {
      if (raw) localStorage.setItem(`${STORAGE_KEY}:backup`, raw);
    } catch {
      // Sem acesso ao armazenamento.
    }
    return [];
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // Armazenamento indisponível (ex.: modo privado); os dados ficam só na sessão.
    }
  }, [transactions]);

  // Outra aba gravou: recarrega para não sobrescrever o que foi feito lá.
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY || e.key === null) setTransactions(load());
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function addTransaction(data: NewTransaction) {
    const transaction = { ...data, id: newId() };
    setTransactions((prev) => [...prev, transaction]);
  }

  function removeTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  /** Devolve uma transação excluída à posição original (usado pelo "Desfazer"). */
  function restoreTransaction(transaction: Transaction, index: number) {
    setTransactions((prev) =>
      prev.some((t) => t.id === transaction.id)
        ? prev
        : [...prev.slice(0, index), transaction, ...prev.slice(index)],
    );
  }

  return { transactions, addTransaction, removeTransaction, restoreTransaction };
}

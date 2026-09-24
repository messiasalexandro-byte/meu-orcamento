import { useEffect, useState } from 'react';

const STORAGE_KEY = 'orcamento:limites';

/** Limite de gastos por mês, indexado por YYYY-MM. */
type Budgets = Record<string, number>;

function load(): Budgets {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const budgets: Budgets = {};
    for (const [month, value] of Object.entries(parsed)) {
      if (/^\d{4}-\d{2}$/.test(month) && typeof value === 'number' && Number.isFinite(value) && value > 0) {
        budgets[month] = value;
      }
    }
    return budgets;
  } catch {
    // JSON ilegível: guarda uma cópia antes que o app sobrescreva a chave.
    try {
      if (raw) localStorage.setItem(`${STORAGE_KEY}:backup`, raw);
    } catch {
      // Sem acesso ao armazenamento.
    }
    return {};
  }
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budgets>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    } catch {
      // Armazenamento indisponível (ex.: modo privado); os dados ficam só na sessão.
    }
  }, [budgets]);

  // Outra aba gravou: recarrega para não sobrescrever o que foi feito lá.
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY || e.key === null) setBudgets(load());
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  function setBudget(month: string, amount: number | null) {
    setBudgets((prev) => {
      const next = { ...prev };
      if (amount === null) delete next[month];
      else next[month] = amount;
      return next;
    });
  }

  return { budgets, setBudget };
}

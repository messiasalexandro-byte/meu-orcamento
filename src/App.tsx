import { useMemo, useState } from 'react';
import { BudgetProgress } from './components/BudgetProgress';
import { CategoryChart } from './components/CategoryChart';
import { MonthFilter } from './components/MonthFilter';
import { SummaryCards } from './components/SummaryCards';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { UndoToast } from './components/UndoToast';
import { useBudgets } from './hooks/useBudgets';
import { useToday } from './hooks/useToday';
import { useTransactions } from './hooks/useTransactions';
import type { Transaction } from './types';
import { roundCents } from './utils/format';

interface Removed {
  transaction: Transaction;
  index: number;
}

export default function App() {
  const { transactions, addTransaction, removeTransaction, restoreTransaction } = useTransactions();
  const { budgets, setBudget } = useBudgets();
  const today = useToday();
  const thisMonth = today.slice(0, 7);
  const [month, setMonth] = useState(thisMonth);
  const [removed, setRemoved] = useState<Removed | null>(null);

  // Virada do mês: quem estava vendo o mês atual passa a ver o novo mês.
  const [prevThisMonth, setPrevThisMonth] = useState(thisMonth);
  if (prevThisMonth !== thisMonth) {
    setPrevThisMonth(thisMonth);
    if (month === prevThisMonth) setMonth(thisMonth);
  }

  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => t.date.slice(0, 7)));
    set.add(thisMonth);
    if (month !== 'todos') set.add(month);
    return [...set].sort().reverse();
  }, [transactions, month, thisMonth]);

  const filtered = useMemo(
    () => (month === 'todos' ? transactions : transactions.filter((t) => t.date.startsWith(month))),
    [transactions, month],
  );

  const { income, expenses } = useMemo(
    () =>
      filtered.reduce(
        (acc, t) => {
          if (t.type === 'receita') acc.income = roundCents(acc.income + t.amount);
          else acc.expenses = roundCents(acc.expenses + t.amount);
          return acc;
        },
        { income: 0, expenses: 0 },
      ),
    [filtered],
  );

  function handleRemove(id: string) {
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) return;
    setRemoved({ transaction: transactions[index], index });
    removeTransaction(id);
  }

  function handleUndo() {
    if (!removed) return;
    restoreTransaction(removed.transaction, removed.index);
    setRemoved(null);
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Meu Orçamento</h1>
          <p className="header-subtitle">Registre receitas e despesas e acompanhe seu saldo.</p>
        </div>
        <MonthFilter months={months} value={month} onChange={setMonth} />
      </header>

      <main className="app-main">
        <SummaryCards income={income} expenses={expenses} />

        <BudgetProgress
          key={month}
          month={month}
          budget={budgets[month]}
          spent={expenses}
          onSave={(amount) => setBudget(month, amount)}
        />

        <div className="grid">
          <TransactionForm today={today} onAdd={addTransaction} />
          <CategoryChart transactions={filtered} />
        </div>

        <TransactionList transactions={filtered} onRemove={handleRemove} />
      </main>

      {removed && (
        <UndoToast
          key={removed.transaction.id}
          prefix="Transação"
          subject={removed.transaction.description}
          message="excluída."
          onUndo={handleUndo}
          onDismiss={() => setRemoved(null)}
        />
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Transaction, TransactionType } from '../types';
import { formatCurrency, formatDate } from '../utils/format';

interface Props {
  transactions: Transaction[];
  onRemove: (id: string) => void;
}

type Filter = 'todas' | TransactionType;

export function TransactionList({ transactions, onRemove }: Props) {
  const [filter, setFilter] = useState<Filter>('todas');

  // Mais recentes primeiro; no mesmo dia, a lançada por último aparece antes.
  const visible = transactions
    .map((t, index) => ({ t, index }))
    .filter(({ t }) => filter === 'todas' || t.type === filter)
    .sort((a, b) => b.t.date.localeCompare(a.t.date) || b.index - a.index)
    .map(({ t }) => t);

  return (
    <section className="card">
      <div className="list-header">
        <h2>Transações</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          aria-label="Filtrar por tipo"
        >
          <option value="todas">Todas</option>
          <option value="receita">Receitas</option>
          <option value="despesa">Despesas</option>
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="empty">Nenhuma transação encontrada.</p>
      ) : (
        <ul className="list">
          {visible.map((t) => (
            <li key={t.id} className="list-item">
              <div className="list-main">
                <span className="list-desc">{t.description}</span>
                <span className="list-meta">
                  {t.category} · {formatDate(t.date)}
                </span>
              </div>
              <span className={`list-amount ${t.type === 'receita' ? 'positive' : 'negative'}`}>
                {t.type === 'receita' ? '+' : '−'} {formatCurrency(t.amount)}
              </span>
              <button
                className="remove"
                onClick={() => onRemove(t.id)}
                aria-label={`Excluir ${t.description}`}
                title="Excluir"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

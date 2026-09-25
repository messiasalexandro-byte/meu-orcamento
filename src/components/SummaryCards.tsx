import { formatCurrency, roundCents } from '../utils/format';

interface Props {
  income: number;
  expenses: number;
}

export function SummaryCards({ income, expenses }: Props) {
  const balance = roundCents(income - expenses);

  return (
    <section className="summary" aria-label="Resumo do período">
      <div className="card summary-card income">
        <span className="summary-label">Receitas</span>
        <strong className="summary-value positive">{formatCurrency(income)}</strong>
      </div>
      <div className="card summary-card expense">
        <span className="summary-label">Despesas</span>
        <strong className="summary-value negative">{formatCurrency(expenses)}</strong>
      </div>
      <div className="card summary-card balance">
        <span className="summary-label">Saldo</span>
        <strong className={`summary-value ${balance >= 0 ? 'positive' : 'negative'}`}>
          {formatCurrency(balance)}
        </strong>
      </div>
    </section>
  );
}

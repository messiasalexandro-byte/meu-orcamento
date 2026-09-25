import { useState, type FormEvent } from 'react';
import { formatCurrency, formatMonth, parseAmount, roundCents } from '../utils/format';

interface Props {
  /** Mês selecionado (YYYY-MM) ou 'todos'. */
  month: string;
  budget: number | undefined;
  spent: number;
  onSave: (amount: number | null) => void;
}

export function BudgetProgress({ month, budget, spent, onSave }: Props) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  if (month === 'todos') {
    return (
      <section className="card budget">
        <h2>Orçamento mensal</h2>
        <p className="budget-hint">Selecione um mês para definir e acompanhar o orçamento.</p>
      </section>
    );
  }

  function startEditing() {
    setInput(budget ? String(budget).replace('.', ',') : '');
    setError('');
    setEditing(true);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = parseAmount(input);
    if (value === null) {
      setError('Informe um valor válido maior que zero, ex.: 1.500,00.');
      return;
    }
    onSave(value);
    setEditing(false);
  }

  function handleRemove() {
    onSave(null);
    setEditing(false);
  }

  const title = `Orçamento de ${formatMonth(month)}`;

  if (editing) {
    return (
      <section className="card budget">
        <h2>{title}</h2>
        <form className="budget-form" onSubmit={handleSubmit} noValidate>
          <input
            autoFocus
            inputMode="decimal"
            autoComplete="off"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            placeholder="Limite em R$, ex.: 2.000,00"
            aria-label="Limite do orçamento em reais"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'budget-error' : undefined}
          />
          <button type="submit" className="primary">
            Salvar limite
          </button>
          <button type="button" className="secondary" onClick={() => setEditing(false)}>
            Cancelar
          </button>
          {budget !== undefined && (
            <button type="button" className="link-danger" onClick={handleRemove}>
              Remover limite
            </button>
          )}
        </form>
        {error && (
          <p id="budget-error" className="form-error" role="alert">
            {error}
          </p>
        )}
      </section>
    );
  }

  if (budget === undefined) {
    return (
      <section className="card budget">
        <h2>{title}</h2>
        <div className="budget-empty">
          <p className="budget-hint">
            Nenhum limite definido. Defina quanto pretende gastar para acompanhar o mês.
          </p>
          <button type="button" className="primary" onClick={startEditing}>
            Definir limite
          </button>
        </div>
      </section>
    );
  }

  const ratio = spent / budget;
  const remaining = roundCents(budget - spent);
  const over = remaining < 0;
  const percentLabel = (ratio * 100).toFixed(0) + '%';
  // Só visual: destaca em âmbar quando o gasto chega a 80% do limite.
  const status = over ? 'over' : ratio >= 0.8 ? 'warning' : '';

  return (
    <section className={`card budget ${status}`}>
      <div className="budget-header">
        <h2>{title}</h2>
        <button type="button" className="secondary" onClick={startEditing}>
          Editar limite
        </button>
      </div>

      <div className="budget-numbers">
        <span>
          <strong>{formatCurrency(spent)}</strong> de {formatCurrency(budget)}
        </span>
        <span className="budget-percent">{percentLabel}</span>
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(Math.round(ratio * 100), 100)}
        aria-valuetext={`${percentLabel} do orçamento utilizado`}
        aria-label="Orçamento utilizado"
      >
        <div className="progress-fill" style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
      </div>

      <p className={`budget-status ${over ? 'negative' : ''}`}>
        {over
          ? `Você ultrapassou o limite em ${formatCurrency(-remaining)}.`
          : `Restam ${formatCurrency(remaining)} do orçamento.`}
      </p>
    </section>
  );
}

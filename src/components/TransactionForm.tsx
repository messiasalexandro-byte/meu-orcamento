import { useState, type FormEvent } from 'react';
import { categoriesFor } from '../categories';
import type { NewTransaction, TransactionType } from '../types';
import { isValidDate, parseAmount } from '../utils/format';

interface Props {
  /** Data de hoje (YYYY-MM-DD), usada como data padrão. */
  today: string;
  onAdd: (data: NewTransaction) => void;
}

export function TransactionForm({ today, onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('despesa');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categoriesFor('despesa')[0].name);
  const [date, setDate] = useState(today);
  const [error, setError] = useState('');

  // Virada do dia: se a data ainda era a de "hoje", acompanha o novo dia.
  const [prevToday, setPrevToday] = useState(today);
  if (prevToday !== today) {
    setPrevToday(today);
    if (date === prevToday) setDate(today);
  }

  function changeType(next: TransactionType) {
    setType(next);
    setCategory(categoriesFor(next)[0].name);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = parseAmount(amount);

    if (!description.trim()) {
      setError('Informe uma descrição.');
      return;
    }
    if (value === null) {
      setError('Informe um valor válido maior que zero, ex.: 1.500,00.');
      return;
    }
    if (!isValidDate(date)) {
      setError('Informe uma data válida.');
      return;
    }

    onAdd({ type, description: description.trim(), amount: value, category, date });
    setDescription('');
    setAmount('');
    setDate(today);
    setError('');
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h2>Nova transação</h2>

      <div className="type-toggle" role="radiogroup" aria-label="Tipo">
        <button
          type="button"
          role="radio"
          aria-checked={type === 'receita'}
          className={type === 'receita' ? 'active income' : ''}
          onClick={() => changeType('receita')}
        >
          Receita
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={type === 'despesa'}
          className={type === 'despesa' ? 'active expense' : ''}
          onClick={() => changeType('despesa')}
        >
          Despesa
        </button>
      </div>

      <label>
        Descrição
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex.: Supermercado"
        />
      </label>

      <div className="form-row">
        <label>
          Valor (R$)
          <input
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </label>
        <label>
          Data
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <label>
        Categoria
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categoriesFor(type).map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="primary">
        Adicionar
      </button>
    </form>
  );
}

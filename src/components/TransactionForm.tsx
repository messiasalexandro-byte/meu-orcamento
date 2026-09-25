import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { categoriesFor } from '../categories';
import type { NewTransaction, TransactionType } from '../types';
import { isValidDate, parseAmount } from '../utils/format';

interface Props {
  /** Data de hoje (YYYY-MM-DD), usada como data padrão. */
  today: string;
  onAdd: (data: NewTransaction) => void;
}

type Field = 'description' | 'amount' | 'date';

interface FieldError {
  field: Field;
  message: string;
}

const SUCCESS_MS = 4000;

export function TransactionForm({ today, onAdd }: Props) {
  const [type, setType] = useState<TransactionType>('despesa');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categoriesFor('despesa')[0].name);
  const [date, setDate] = useState(today);
  const [error, setError] = useState<FieldError | null>(null);
  const [success, setSuccess] = useState('');

  const id = useId();
  const refs = {
    description: useRef<HTMLInputElement>(null),
    amount: useRef<HTMLInputElement>(null),
    date: useRef<HTMLInputElement>(null),
  };

  // Virada do dia: se a data ainda era a de "hoje", acompanha o novo dia.
  const [prevToday, setPrevToday] = useState(today);
  if (prevToday !== today) {
    setPrevToday(today);
    if (date === prevToday) setDate(today);
  }

  // A confirmação de "adicionada" some sozinha depois de alguns segundos.
  useEffect(() => {
    if (!success) return;
    const timer = window.setTimeout(() => setSuccess(''), SUCCESS_MS);
    return () => window.clearTimeout(timer);
  }, [success]);

  function changeType(next: TransactionType) {
    setType(next);
    setCategory(categoriesFor(next)[0].name);
  }

  function fail(field: Field, message: string) {
    setError({ field, message });
    setSuccess('');
    refs[field].current?.focus();
  }

  /** Limpa o erro do campo assim que a pessoa começa a corrigi-lo. */
  function clearError(field: Field) {
    if (error?.field === field) setError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = parseAmount(amount);

    if (!description.trim()) {
      fail('description', 'Informe uma descrição.');
      return;
    }
    if (value === null) {
      fail('amount', 'Informe um valor maior que zero, ex.: 1.500,00.');
      return;
    }
    if (!isValidDate(date)) {
      fail('date', 'Informe uma data válida.');
      return;
    }

    onAdd({ type, description: description.trim(), amount: value, category, date });
    setDescription('');
    setAmount('');
    setDate(today);
    setError(null);
    setSuccess(`${type === 'receita' ? 'Receita' : 'Despesa'} adicionada.`);
  }

  /** Props de acessibilidade e mensagem de erro de um campo. */
  function fieldProps(field: Field) {
    const invalid = error?.field === field;
    return {
      ref: refs[field],
      'aria-invalid': invalid || undefined,
      'aria-describedby': invalid ? `${id}-${field}-error` : undefined,
    };
  }

  function fieldError(field: Field) {
    if (error?.field !== field) return null;
    return (
      <span id={`${id}-${field}-error`} className="field-error" role="alert">
        {error.message}
      </span>
    );
  }

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <h2>Nova transação</h2>

      <div className="type-toggle" role="radiogroup" aria-label="Tipo de transação">
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
          {...fieldProps('description')}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearError('description');
          }}
          placeholder={type === 'receita' ? 'Ex.: Salário de setembro' : 'Ex.: Supermercado'}
          autoComplete="off"
          enterKeyHint="next"
        />
        {fieldError('description')}
      </label>

      <div className="form-row">
        <label>
          Valor (R$)
          <input
            {...fieldProps('amount')}
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              clearError('amount');
            }}
            placeholder="0,00"
            autoComplete="off"
          />
          {fieldError('amount')}
        </label>
        <label>
          Data
          <input
            {...fieldProps('date')}
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              clearError('date');
            }}
          />
          {fieldError('date')}
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

      <button type="submit" className="primary">
        {type === 'receita' ? 'Adicionar receita' : 'Adicionar despesa'}
      </button>

      <p className="form-success" role="status">
        {success}
      </p>
    </form>
  );
}

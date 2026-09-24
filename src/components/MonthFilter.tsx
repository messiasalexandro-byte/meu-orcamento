import { formatMonth } from '../utils/format';

interface Props {
  months: string[];
  value: string;
  onChange: (value: string) => void;
}

export function MonthFilter({ months, value, onChange }: Props) {
  return (
    <label className="month-filter">
      Período
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="todos">Todos os meses</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {formatMonth(m)}
          </option>
        ))}
      </select>
    </label>
  );
}

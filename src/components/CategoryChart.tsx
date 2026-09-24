import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categoryColor } from '../categories';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: Props) {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type === 'despesa') {
      totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    }
  }
  const data = [...totals.entries()]
    .map(([name, value]) => ({ name, value, fill: categoryColor(name) }))
    .sort((a, b) => b.value - a.value);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const percent = (value: number) => ((value / total) * 100).toFixed(1).replace('.', ',') + '%';

  return (
    <section className="card">
      <h2>Gastos por categoria</h2>

      {data.length === 0 ? (
        <p className="empty">Adicione despesas para ver o gráfico.</p>
      ) : (
        <div className="chart">
          <div className="chart-canvas">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="55%"
                  outerRadius="90%"
                  paddingAngle={data.length > 1 ? 2 : 0}
                  stroke="none"
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                  }}
                  itemStyle={{ color: 'var(--text)' }}
                  formatter={(value) => {
                    const v = Number(value);
                    return `${formatCurrency(v)} (${percent(v)})`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="legend">
            {data.map((d) => (
              <li key={d.name}>
                <span className="dot" style={{ background: d.fill }} />
                <span className="legend-name">{d.name}</span>
                <span className="legend-value">{formatCurrency(d.value)}</span>
                <span className="legend-percent">{percent(d.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

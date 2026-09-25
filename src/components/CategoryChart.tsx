import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { categoryColor } from '../categories';
import type { Transaction } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  transactions: Transaction[];
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
        <p className="empty">Nenhuma despesa neste período. Adicione despesas para ver o gráfico.</p>
      ) : (
        <div className="chart">
          <div className="chart-canvas">
            {/* Vem antes do gráfico no DOM para a dica (tooltip) ficar por cima. */}
            <div className="chart-total">
              <span className="chart-total-label">Total gasto</span>
              <span className="chart-total-value">{formatCurrency(total)}</span>
            </div>
            {/* A legenda abaixo traz os mesmos dados em texto; o desenho é só visual. */}
            <div aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="62%"
                    outerRadius="92%"
                    paddingAngle={data.length > 1 ? 2 : 0}
                    cornerRadius={4}
                    stroke="none"
                    isAnimationActive={!prefersReducedMotion()}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow-lg)',
                      fontSize: 'var(--text-sm)',
                    }}
                    itemStyle={{ color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}
                    formatter={(value) => {
                      const v = Number(value);
                      return `${formatCurrency(v)} (${percent(v)})`;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <ul className="legend">
            {data.map((d) => (
              <li key={d.name}>
                <span className="dot" style={{ background: d.fill }} aria-hidden="true" />
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

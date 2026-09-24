const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/** Converte YYYY-MM-DD para DD/MM/YYYY sem problemas de fuso horário. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split('-').map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Arredonda para centavos, evitando resíduos de ponto flutuante (ex.: 0,1 + 0,2). */
export function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Lê um valor digitado no formato brasileiro: "1500", "1500,50", "1.500" ou "1.500,50".
 * Retorna null se o texto não for um valor válido maior que zero.
 */
export function parseAmount(input: string): number | null {
  const text = input.trim();
  if (!/^(\d{1,3}(\.\d{3})+|\d+)(,\d{1,2})?$/.test(text)) return null;
  const value = roundCents(Number(text.replace(/\./g, '').replace(',', '.')));
  return value > 0 ? value : null;
}

/** Indica se a data YYYY-MM-DD tem um ano plausível (evita "0026" digitado pela metade). */
export function isValidDate(isoDate: string): boolean {
  const match = /^(\d{4})-\d{2}-\d{2}$/.exec(isoDate);
  if (!match) return false;
  const year = Number(match[1]);
  return year >= 1900 && year <= 2100;
}

/** Gera um id único; usa um fallback onde crypto.randomUUID não existe (ex.: http pela rede local). */
export function newId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

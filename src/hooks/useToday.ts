import { useEffect, useState } from 'react';
import { todayISO } from '../utils/format';

/**
 * Data de hoje (YYYY-MM-DD) que se atualiza na virada do dia. Também confere ao voltar
 * para a aba, porque timers ficam pausados com o computador ou o celular em repouso.
 */
export function useToday(): string {
  const [today, setToday] = useState(todayISO);

  useEffect(() => {
    let timer: number;

    function update() {
      setToday(todayISO());
    }

    function scheduleMidnight() {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = window.setTimeout(() => {
        update();
        scheduleMidnight();
      }, midnight.getTime() - now.getTime() + 1000);
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') update();
    }

    scheduleMidnight();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', update);
    };
  }, []);

  return today;
}

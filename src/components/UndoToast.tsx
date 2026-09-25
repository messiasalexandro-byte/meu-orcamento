import { useEffect } from 'react';

const DURATION_MS = 6000;

interface Props {
  /** Início opcional da frase, antes do nome (ex.: "Transação"). */
  prefix?: string;
  /** Nome do item afetado; é encurtado com reticências se não couber. */
  subject: string;
  /** Resto da frase, sempre visível (ex.: "excluída."). */
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}

/** Aviso temporário com botão "Desfazer". Use uma `key` diferente para reiniciar o tempo. */
export function UndoToast({ prefix, subject, message, onUndo, onDismiss }: Props) {
  // Sem dependências de propósito: o tempo só reinicia quando a key muda, e não
  // a cada render do pai (onDismiss é uma função nova a cada render).
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="toast" role="status">
      <span className="toast-message">
        {prefix && <span>{prefix}</span>}
        <span className="toast-subject">“{subject}”</span> {message}
      </span>
      <button type="button" className="toast-action" onClick={onUndo}>
        Desfazer
      </button>
      <button type="button" className="toast-close" onClick={onDismiss} aria-label="Fechar aviso">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}

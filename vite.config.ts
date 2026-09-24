import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Endereço no GitHub Pages: https://messiasalexandro-byte.github.io/meu-orcamento/
  base: '/meu-orcamento/',
  plugins: [react()],
});

# Meu Orçamento

Aplicativo web de controle de orçamento pessoal. Registre receitas e despesas por categoria, acompanhe o saldo do mês, defina um limite de gastos e veja para onde o dinheiro está indo.

Tudo roda no navegador: não há servidor, cadastro ou login, e os dados ficam salvos no próprio aparelho.

**Acesse online:** <https://messiasalexandro-byte.github.io/meu-orcamento/>

O site é publicado automaticamente no GitHub Pages a cada push na branch `main` (veja `.github/workflows/deploy.yml`).

## Funcionalidades

- **Receitas e despesas** com descrição, valor, categoria e data.
- **Painel do mês** com total de receitas, total de despesas e saldo (verde quando positivo, vermelho quando negativo).
- **Gráfico de gastos por categoria** (rosca), com o total gasto no centro e o valor e o percentual de cada categoria.
- **Orçamento mensal**: defina um limite de gastos por mês e acompanhe quanto já foi usado e quanto resta. A barra fica âmbar a partir de 80% do limite e vermelha quando ele é ultrapassado.
- **Formulário com validação amigável**: o erro aparece logo abaixo do campo com problema, e uma confirmação ("Despesa adicionada.") aparece depois de cada lançamento.
- **Filtro por mês** (ou "Todos os meses") e filtro da lista por tipo.
- **Desfazer exclusão**: ao excluir uma transação, um aviso permite desfazer por alguns segundos.
- **Sincronização entre abas**: o que é feito em uma aba aparece nas outras abertas no mesmo navegador.
- **Virada do dia e do mês**: com o app aberto, a data padrão e o mês atual se atualizam sozinhos.
- **Valores no formato brasileiro**: aceita `1500`, `1.500`, `1500,50` e `1.500,50`.
- **Tema claro e escuro**, conforme a configuração do sistema.
- **Layout responsivo**: funciona de 320px até telas largas, com botões e campos de pelo menos 44px no celular.
- **Acessibilidade**: foco visível, rótulos ligados aos campos, botões com `aria-label` e respeito à preferência de reduzir movimento do sistema.

### Categorias

| Despesas | Receitas |
|---|---|
| Alimentação, Aluguel, Transporte, Lazer, Saúde, Educação, Contas (luz/água/internet), Compras, Outros | Salário, Freelance, Investimentos, Outros |

## Tecnologias

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) (servidor de desenvolvimento e build)
- [Recharts](https://recharts.org/) (gráfico)
- CSS puro, sem biblioteca de componentes
- `localStorage` do navegador para guardar os dados

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 20.19 ou 22.12 (ou mais recente).

```bash
git clone https://github.com/messiasalexandro-byte/meu-orcamento.git
cd meu-orcamento
npm install
npm run dev
```

Depois, abra <http://localhost:5173/meu-orcamento/> no navegador.

### Abrir no celular

Com o computador e o celular na mesma rede Wi-Fi:

```bash
npx vite --host
```

O terminal mostra um endereço **Network** (por exemplo, `http://192.168.0.10:5173/meu-orcamento/`). Abra esse endereço no navegador do celular. Se não carregar, verifique se o firewall do Windows permite o Node.js na rede atual.

### Outros comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Confere os tipos (TypeScript) e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente a versão gerada em `dist/` |

## Onde ficam os dados

Os dados são salvos no `localStorage` do navegador, nas chaves:

- `orcamento:transacoes`: lista de transações;
- `orcamento:limites`: limite de gastos de cada mês (`AAAA-MM`).

Por isso:

- cada navegador e cada aparelho tem os próprios dados (o que você lança no celular não aparece no computador);
- limpar os dados do site no navegador apaga as transações;
- no modo anônimo, os dados somem ao fechar a janela.

Se os dados salvos estiverem corrompidos, o app descarta só os itens inválidos. Se o conteúdo estiver ilegível, ele guarda uma cópia em `orcamento:transacoes:backup` (ou `orcamento:limites:backup`) antes de começar do zero.

## Estrutura do projeto

```
src/
  main.tsx                  # Ponto de entrada
  App.tsx                   # Layout e estado principal
  types.ts                  # Tipo Transaction
  categories.ts             # Categorias e cores
  index.css                 # Estilos, variáveis de design e temas claro/escuro
  hooks/
    useTransactions.ts      # Transações + localStorage + sincronização entre abas
    useBudgets.ts           # Limites mensais + localStorage
    useToday.ts             # Data de hoje, atualizada na virada do dia
  utils/
    format.ts               # Moeda, datas, leitura de valores em BRL, ids
  components/
    SummaryCards.tsx        # Cards de receitas, despesas e saldo
    BudgetProgress.tsx      # Orçamento mensal com barra de progresso
    TransactionForm.tsx     # Formulário de nova transação
    TransactionList.tsx     # Lista com filtro por tipo e exclusão
    CategoryChart.tsx       # Gráfico de gastos por categoria
    MonthFilter.tsx         # Seletor de mês
    UndoToast.tsx           # Aviso com "Desfazer"
```

## Design e revisão de UI/UX

Todo o visual fica em `src/index.css`. Cores, espaçamentos (escala de 4/8px), tamanhos de texto, raios, sombras e durações de transição são variáveis CSS definidas em `:root`, com versões para o tema escuro. Para mudar a aparência do app, ajuste essas variáveis em vez de usar valores fixos nos componentes.

O projeto inclui um agente do Claude Code em `.claude/agents/ui-ux-specialist.md`. Ele revisa o design visual, a experiência de uso e a responsividade, corrige o que encontrar e roda `npm run build` no final, sem alterar a lógica de dados.

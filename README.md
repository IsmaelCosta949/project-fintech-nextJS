# 💰 Fintech App

Aplicação web para controle financeiro pessoal desenvolvida com Next.js 15 e integrada com backend Spring Boot.

## 🔐 Login de Teste

```
Email: avaliador.fiap@fiap.com
Senha: ilovefiap
```

> **Nota:** Preencha as credenciais de teste acima ou crie uma nova conta através da página de login.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- Backend rodando em `http://localhost:8080`
- npm, yarn, pnpm ou bun

### Instalação e Execução

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd fintech
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

4. **Acesse a aplicação:**

   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### Outros comandos disponíveis:

```bash
# Build para produção
npm run build

# Iniciar em modo produção
npm run start

# Verificar lint
npm run lint
```

---

## 📋 Funcionalidades

- ✅ **Autenticação** - Login e gerenciamento de conta
- 💸 **Transações** - Registro de receitas e despesas
- 🎯 **Metas** - Controle de gastos e objetivos de economia
- 📊 **Dashboard** - Visão geral das finanças
- 👤 **Perfil** - Gerenciamento de dados pessoais e configurações

## 🛠️ Tecnologias

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend:** Spring Boot, Java, Oracle Database
- **API:** REST (http://localhost:8080/api)

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── home/          # Dashboard
│   ├── login/         # Autenticação
│   ├── metas/         # Gerenciamento de metas
│   ├── transacoes/    # Registro de transações
│   ├── usuario/       # Perfil do usuário
│   ├── services/      # Serviços de API
│   └── interfaces/    # TypeScript interfaces
├── components/        # Componentes reutilizáveis
└── utils/            # Funções utilitárias
```

---

## 🔗 Backend

Este projeto requer o backend Spring Boot rodando. Certifique-se de que o servidor está ativo em `http://localhost:8080` antes de iniciar o frontend.

**Repositório do Backend:** `new_fintech`

---

## 📚 Documentação Completa

### Arquitetura do Sistema

A aplicação segue uma arquitetura cliente-servidor, com separação clara entre frontend e backend:

- **Frontend (Next.js):** Interface do usuário, gerenciamento de estado local, chamadas à API
- **Backend (Spring Boot):** Lógica de negócio, persistência de dados, autenticação
- **Comunicação:** REST API com JSON

### Fluxo de Dados

1. **Autenticação:**

   - Usuário faz login através da página `/login`
   - Backend valida credenciais e retorna dados da conta
   - Frontend salva `accountId`, `userName` e `userEmail` no localStorage
   - Todas as requisições subsequentes usam o `accountId` para identificar o usuário

2. **Gestão de Metas (Wallets):**

   - Wallets podem ser do tipo `EXPENSE` (controle de gastos) ou `BUDGET` (objetivos de economia)
   - Cada wallet tem: nome, meta financeira, datas de início/fim
   - Frontend normaliza os tipos entre português (UI) e inglês (API)

3. **Transações:**

   - Vinculadas a uma wallet específica
   - Tipos: `EXPENSE` (despesa) ou `BUDGET` (receita/orçamento)
   - Backend retorna tipos em português, frontend normaliza para inglês
   - Formato de data/hora: `YYYY-MM-DDTHH:mm:ss` (sem conversão UTC)

4. **Dashboard (Home):**
   - Calcula saldo disponível: `salarioMensal - despesasMês`
   - Filtra transações do mês atual
   - Exibe resumo financeiro e últimas transações

### Estrutura de Serviços (Services Layer)

#### `userService.ts`

Gerencia autenticação e perfil do usuário.

**Endpoints:**

- `POST /api/accounts/auth/login` - Autenticação
- `GET /api/accounts/{accountId}` - Buscar perfil
- `PUT /api/accounts/{accountId}` - Atualizar perfil

**Dados salvos no localStorage:**

- `accountId`: Identificador único do usuário
- `userName`: Nome do usuário
- `userEmail`: Email do usuário
- `salarioMensal`: Renda mensal (usado no cálculo do saldo)

#### `walletService.ts`

Gerencia metas financeiras (wallets).

**Endpoints:**

- `GET /api/wallets/{accountId}/{type}` - Listar wallets por tipo
- `POST /api/wallets` - Criar wallet
- `PUT /api/wallets/{id}` - Atualizar wallet
- `DELETE /api/wallets/{id}` - Deletar wallet

**Tipos de Wallet:**

- `EXPENSE`: Controle de gastos mensais
- `BUDGET`: Objetivos de economia/investimento

#### `transactionService.ts`

Gerencia transações financeiras.

**Endpoints:**

- `GET /api/transactions?accountId={id}&type={type}` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/{id}` - Atualizar transação
- `DELETE /api/transactions/{id}` - Deletar transação
- `GET /api/transactions/sum/account/{accountId}?type={type}` - Total por tipo
- `GET /api/transactions/sum/wallet/{walletId}` - Total por wallet

**Normalização de Tipos:**
O backend retorna tipos em português (`despesa`, `receita`), mas o frontend trabalha com tipos em inglês (`EXPENSE`, `BUDGET`). A normalização é feita automaticamente no service.

### Interfaces TypeScript

#### `Users`

```typescript
{
  accountId: number;
  name: string;
  cpf?: string;
  monthlyIncome?: number;
  status: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
```

#### `Wallet` (Goals)

```typescript
{
  id: string;
  name: string;
  type: "EXPENSE" | "BUDGET";
  financialTarget: number;
  startDate: string;
  endDate: string;
}
```

#### `Transaction`

```typescript
{
  transactionId: number;
  walletId: number;
  description: string;
  type: "EXPENSE" | "BUDGET";
  value: number;
  transactionAt: string;
  category?: string;
}
```

### Páginas da Aplicação

#### `/login` - Autenticação

- Login de usuários existentes
- Criação de novas contas
- Validação de credenciais
- Redirecionamento para `/home` após login bem-sucedido

#### `/home` - Dashboard

- Banner com saldo disponível
- Cálculo: `salarioMensal - totalDespesasMêsAtual`
- Indicador visual de % gasto
- Últimas 3 transações
- Preview das metas

#### `/metas` - Gerenciamento de Metas

- **Aba Gastos:** Controle de limites de gastos mensais
- **Aba Orçamentos:** Objetivos de economia/investimento
- CRUD completo: criar, visualizar, editar, excluir
- Barra de progresso visual
- Refetch automático ao trocar de aba

#### `/transacoes` - Registro de Transações

- Filtros: Todas, Orçamentos, Despesas
- CRUD completo de transações
- Seleção de wallet associada
- Date/time picker
- Totalização automática por tipo
- Cálculo de saldo

#### `/usuario` - Perfil do Usuário

- Visualização de dados pessoais
- Edição de perfil
- Alteração de senha (opcional)
- Configuração de renda mensal
- Senha atual obrigatória para confirmar alterações

### Componentes Reutilizáveis

#### `Button`

Botão estilizado com variantes de cor e tamanho.

#### `Card`

Container com sombra e bordas arredondadas para agrupar conteúdo.

#### `Input`

Campo de entrada com label, validação e suporte a diferentes tipos.

#### `registerCard`

Card específico para formulários de registro.

### Utilitários

#### `formatDate.ts`

- `combineDateTime(date, time)`: Combina data e hora em formato ISO
- `formatDate(iso)`: Converte ISO para `YYYY-MM-DD`
- `formatTime(iso)`: Extrai horário de string ISO

### Tratamento de Erros

- **400/404:** Retorna array vazio `[]` (não há dados)
- **401:** Redireciona para login (não autenticado)
- **500:** Exibe mensagem de erro ao usuário
- **Network errors:** Capturados e exibidos com `alert()`

### Boas Práticas Implementadas

1. **Single Source of Truth:** Backend é a fonte única de dados. Após criar/editar/deletar, sempre refaz a busca.
2. **Type Safety:** TypeScript em todos os arquivos com interfaces bem definidas.
3. **Error Handling:** Try-catch em todas as chamadas de API.
4. **Loading States:** Indicadores visuais durante requisições.
5. **Client-Side Rendering:** `"use client"` em componentes interativos.
6. **No Cache:** `cache: "no-store"` nas requisições GET para dados sempre atualizados.

### Segurança

- **Autenticação:** Baseada em localStorage (desenvolvimento)
- **Senha:** Hasheada no backend com BCrypt
- **Validação:** Frontend e backend validam dados
- **HTTPS:** Recomendado em produção

### Performance

- **Code Splitting:** Next.js divide código automaticamente
- **Lazy Loading:** Componentes carregados sob demanda
- **Debouncing:** Em buscas e filtros (futuro)
- **Optimistic UI:** Atualização imediata + refetch para confirmar

---

## 🐛 Troubleshooting

### Backend não conecta

```bash
# Verifique se o backend está rodando
curl http://localhost:8080/api/accounts

# Verifique os logs do Spring Boot
```

### Erro 401 (Não autorizado)

- Faça logout e login novamente
- Limpe o localStorage: `localStorage.clear()`

### Metas não aparecem

- Verifique se o `accountId` está salvo no localStorage
- Verifique os logs do console do navegador

### Transações zeradas

- Backend não retorna `currentValue` ainda
- Valores calculados a partir das transações registradas

---

## 🚧 Melhorias Futuras

- [ ] Autenticação com JWT tokens
- [ ] Backend retornar `currentValue` nas wallets
- [ ] Gráficos de evolução financeira
- [ ] Notificações quando atingir metas
- [ ] Export de dados em CSV/PDF
- [ ] Modo dark theme
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários e E2E

---

## 👥 Autores

Projeto desenvolvido como parte do curso de Engenharia de Software.

## 📄 Licença

Este projeto é de uso acadêmico.

# API de Metas (Wallets) - Documentação

Este documento descreve todas as rotas da API relacionadas às **Metas Financeiras** usando o recurso de Wallets.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tipos de Wallets](#tipos-de-wallets)
3. [Endpoints](#endpoints)
4. [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

A API utiliza o recurso **Wallets** para gerenciar metas financeiras. Cada wallet pode ser:

- **BUDGET**: Meta de orçamento (economia/poupança)
- **SPENDING**: Meta de gastos (limite de gastos por categoria)

---

## 💼 Tipos de Wallets

### BUDGET (Meta de Orçamento)

Usado para definir objetivos de economia com prazo definido.

**Exemplo:** Fundo de emergência, Viagem, Novo computador

### SPENDING (Meta de Gastos)

Usado para definir limites mensais de gastos por categoria.

**Exemplo:** Limite de R$ 800 para Alimentação no mês

---

## 🔌 Endpoints

### Base URL

```
http://localhost:3000/api
```

---

## 1. Listar Todas as Wallets

**GET** `/wallets`

Retorna todas as wallets (metas) do usuário.

### Headers

```json
{
  "Authorization": "Bearer {token}"
}
```

### Resposta de Sucesso (200)

```json
[
  {
    "id": 1,
    "accountId": 123,
    "name": "Fundo de Emergência",
    "type": "BUDGET",
    "financialTarget": 10000.0,
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  },
  {
    "id": 2,
    "accountId": 123,
    "name": "Alimentação",
    "type": "SPENDING",
    "financialTarget": 800.0,
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  }
]
```

### Campos da Resposta

- `id` (number): ID único da wallet
- `accountId` (number): ID da conta associada
- `name` (string): Nome da meta/categoria
- `type` (string): Tipo da wallet (`BUDGET` ou `SPENDING`)
- `financialTarget` (number): Valor alvo/limite
- `startDate` (string): Data de início (formato YYYY-MM-DD)
- `endDate` (string): Data de término (formato YYYY-MM-DD)

---

## 2. Criar Nova Wallet

**POST** `/wallets`

Cria uma nova wallet (meta financeira).

### Headers

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

### Body da Requisição

#### Exemplo: Meta de Orçamento (BUDGET)

```json
{
  "accountId": 123,
  "name": "Viagem para Europa",
  "type": "BUDGET",
  "financialTarget": 8000.0,
  "startDate": "2025-11-05",
  "endDate": "2026-06-30"
}
```

#### Exemplo: Meta de Gastos (SPENDING)

```json
{
  "accountId": 123,
  "name": "Alimentação",
  "type": "SPENDING",
  "financialTarget": 800.0,
  "startDate": "2025-11-01",
  "endDate": "2025-11-30"
}
```

### Campos Obrigatórios

- `accountId` (number): ID da conta do usuário
- `name` (string): Nome da meta ou categoria
- `type` (string): `BUDGET` ou `SPENDING`
- `financialTarget` (number): Valor objetivo (BUDGET) ou limite (SPENDING)
- `startDate` (string): Data de início no formato YYYY-MM-DD
- `endDate` (string): Data de término no formato YYYY-MM-DD

### Resposta de Sucesso (201)

```json
{
  "id": 3,
  "accountId": 123,
  "name": "Viagem para Europa",
  "type": "BUDGET",
  "financialTarget": 8000.0,
  "startDate": "2025-11-05",
  "endDate": "2026-06-30"
}
```

### Resposta de Erro (400)

```json
{
  "error": "Dados inválidos",
  "details": [
    "name é obrigatório",
    "financialTarget deve ser maior que 0",
    "type deve ser BUDGET ou SPENDING"
  ]
}
```

---

## 3. Atualizar Wallet

**PUT** `/wallets/{id}`

Atualiza uma wallet existente completamente.

### Headers

```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

### Parâmetros de URL

- `id` (number): ID da wallet a ser atualizada

### Body da Requisição

```json
{
  "accountId": 123,
  "name": "Viagem para Europa - 2026",
  "type": "BUDGET",
  "financialTarget": 9000.0,
  "startDate": "2025-11-05",
  "endDate": "2026-07-31"
}
```

### Resposta de Sucesso (200)

```json
{
  "id": 3,
  "accountId": 123,
  "name": "Viagem para Europa - 2026",
  "type": "BUDGET",
  "financialTarget": 9000.0,
  "startDate": "2025-11-05",
  "endDate": "2026-07-31"
}
```

### Resposta de Erro (404)

```json
{
  "error": "Wallet não encontrada"
}
```

---

## 4. Deletar Wallet

**DELETE** `/wallets/{id}`

Remove uma wallet (meta financeira).

### Headers

```json
{
  "Authorization": "Bearer {token}"
}
```

### Parâmetros de URL

- `id` (number): ID da wallet a ser deletada

### Resposta de Sucesso (204)

```
No Content
```

### Resposta de Erro (404)

```json
{
  "error": "Wallet não encontrada"
}
```

---

## 5. Buscar Wallets por Conta e Tipo

**GET** `/wallets/{accountId}/{type}`

Retorna todas as wallets de um tipo específico para uma conta.

### Headers

```json
{
  "Authorization": "Bearer {token}"
}
```

### Parâmetros de URL

- `accountId` (number): ID da conta
- `type` (string): Tipo da wallet (`BUDGET` ou `SPENDING`)

### Exemplo de URLs

```
GET /wallets/123/BUDGET
GET /wallets/123/SPENDING
```

### Resposta de Sucesso (200)

#### Para BUDGET:

```json
[
  {
    "id": 1,
    "accountId": 123,
    "name": "Fundo de Emergência",
    "type": "BUDGET",
    "financialTarget": 10000.0,
    "startDate": "2025-01-01",
    "endDate": "2025-12-31"
  },
  {
    "id": 3,
    "accountId": 123,
    "name": "Viagem para Europa",
    "type": "BUDGET",
    "financialTarget": 8000.0,
    "startDate": "2025-11-05",
    "endDate": "2026-06-30"
  }
]
```

#### Para SPENDING:

```json
[
  {
    "id": 2,
    "accountId": 123,
    "name": "Alimentação",
    "type": "SPENDING",
    "financialTarget": 800.0,
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  },
  {
    "id": 4,
    "accountId": 123,
    "name": "Transporte",
    "type": "SPENDING",
    "financialTarget": 400.0,
    "startDate": "2025-11-01",
    "endDate": "2025-11-30"
  }
]
```

---

## 📊 Exemplos de Uso

### Frontend - Buscar metas de orçamento

```typescript
// Buscar todas as metas de orçamento (BUDGET)
const accountId = 123;
const response = await fetch(`/api/wallets/${accountId}/BUDGET`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const budgetGoals = await response.json();
```

### Frontend - Criar meta de gastos

```typescript
// Criar meta de gastos para categoria Alimentação
const novaMeta = {
  accountId: 123,
  name: "Alimentação",
  type: "SPENDING",
  financialTarget: 800.0,
  startDate: "2025-11-01",
  endDate: "2025-11-30",
};

const response = await fetch("/api/wallets", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(novaMeta),
});

const metaCriada = await response.json();
```

### Frontend - Atualizar meta

```typescript
// Atualizar valor alvo de uma meta
const walletId = 3;
const metaAtualizada = {
  accountId: 123,
  name: "Viagem para Europa - Premium",
  type: "BUDGET",
  financialTarget: 12000.0,
  startDate: "2025-11-05",
  endDate: "2026-08-31",
};

const response = await fetch(`/api/wallets/${walletId}`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(metaAtualizada),
});
```

### Frontend - Deletar meta

```typescript
// Deletar uma meta
const walletId = 5;

await fetch(`/api/wallets/${walletId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 🔄 Adaptação do goalService.ts

Para integrar com a API real, atualize o arquivo `goalService.ts`:

```typescript
import { GoalBudget, GoalSpent } from "../interfaces/goals";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const goalService = {
  // Buscar metas de GASTOS (SPENDING)
  async getGoalSpent(accountId: number): Promise<GoalSpent[]> {
    const res = await fetch(`${API_BASE_URL}/wallets/${accountId}/SPENDING`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch spending goals: ${res.statusText}`);
    }

    const data = await res.json();

    // Mapear resposta da API para formato esperado
    return data.map((wallet: any) => ({
      id: wallet.id.toString(),
      category: wallet.name,
      limitValue: wallet.financialTarget,
      spentValue: wallet.currentValue || 0, // Assumindo que virá da API
      date: wallet.startDate.slice(0, 7), // Converter YYYY-MM-DD para YYYY-MM
    }));
  },

  // Buscar metas de ORÇAMENTO (BUDGET)
  async getGoalBudget(accountId: number): Promise<GoalBudget[]> {
    const res = await fetch(`${API_BASE_URL}/wallets/${accountId}/BUDGET`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch budget goals: ${res.statusText}`);
    }

    const data = await res.json();

    // Mapear resposta da API para formato esperado
    return data.map((wallet: any) => ({
      id: wallet.id.toString(),
      name: wallet.name,
      targetValue: wallet.financialTarget,
      currentValue: wallet.currentValue || 0, // Assumindo que virá da API
      startDate: wallet.startDate,
      endDate: wallet.endDate,
    }));
  },

  // Criar meta de gasto
  async createGoalSpent(
    accountId: number,
    goal: Omit<GoalSpent, "id">
  ): Promise<GoalSpent> {
    const wallet = {
      accountId,
      name: goal.category,
      type: "SPENDING",
      financialTarget: goal.limitValue,
      startDate: `${goal.date}-01`,
      endDate: `${goal.date}-${
        new Date(goal.date + "-01").getMonth() === 1 ? 28 : 30
      }`,
    };

    const res = await fetch(`${API_BASE_URL}/wallets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    if (!res.ok) {
      throw new Error(`Failed to create spending goal: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      id: data.id.toString(),
      category: data.name,
      limitValue: data.financialTarget,
      spentValue: 0,
      date: data.startDate.slice(0, 7),
    };
  },

  // Criar meta de orçamento
  async createGoalBudget(
    accountId: number,
    goal: Omit<GoalBudget, "id">
  ): Promise<GoalBudget> {
    const wallet = {
      accountId,
      name: goal.name,
      type: "BUDGET",
      financialTarget: goal.targetValue,
      startDate: goal.startDate,
      endDate: goal.endDate,
    };

    const res = await fetch(`${API_BASE_URL}/wallets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    if (!res.ok) {
      throw new Error(`Failed to create budget goal: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      id: data.id.toString(),
      name: data.name,
      targetValue: data.financialTarget,
      currentValue: 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };
  },

  // Atualizar wallet
  async updateWallet(walletId: number, wallet: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    if (!res.ok) {
      throw new Error(`Failed to update wallet: ${res.statusText}`);
    }

    return await res.json();
  },

  // Deletar wallet
  async deleteWallet(walletId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete wallet: ${res.statusText}`);
    }
  },
};
```

---

## 🔐 Autenticação

Todas as rotas requerem autenticação via Bearer Token:

```
Authorization: Bearer {seu_token_jwt}
```

---

## ⚠️ Códigos de Status HTTP

| Código | Descrição                     |
| ------ | ----------------------------- |
| 200    | Sucesso (GET, PUT)            |
| 201    | Criado com sucesso (POST)     |
| 204    | Deletado com sucesso (DELETE) |
| 400    | Requisição inválida           |
| 401    | Não autenticado               |
| 403    | Sem permissão                 |
| 404    | Recurso não encontrado        |
| 500    | Erro interno do servidor      |

---

## 📝 Validações

### Campos Obrigatórios

- `accountId`: Deve ser um número inteiro válido
- `name`: String não vazia (3-100 caracteres)
- `type`: Deve ser exatamente `BUDGET` ou `SPENDING`
- `financialTarget`: Número maior que 0
- `startDate`: Data válida no formato YYYY-MM-DD
- `endDate`: Data válida no formato YYYY-MM-DD (deve ser posterior a startDate)

### Regras de Negócio

- `endDate` deve ser maior que `startDate`
- `financialTarget` deve ser positivo
- `type` só aceita os valores `BUDGET` ou `SPENDING`

---

## 🎯 Próximos Passos

1. ✅ Documentação das rotas completa
2. ⬜ Atualizar `goalService.ts` com chamadas reais
3. ⬜ Adicionar tratamento de erros
4. ⬜ Implementar loading states
5. ⬜ Adicionar validações de formulário
6. ⬜ Implementar sistema de notificações (toast)
7. ⬜ Adicionar suporte para `currentValue` (valor atual economizado/gasto)

---

Última atualização: 05/11/2025

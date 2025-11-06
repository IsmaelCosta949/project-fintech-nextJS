# 🔄 Integração de Metas - Status e Divergências

## ✅ Integração Concluída!

A página de metas foi integrada com a API de Wallets. Veja abaixo os detalhes da implementação e as divergências encontradas.

---

## 🚨 Divergências Críticas Entre Frontend e API

### 1. **Campo `currentValue` não existe na API** ⚠️

**Problema:**

- Frontend precisa exibir o valor atual gasto/economizado
- API retorna apenas `financialTarget` (valor alvo/limite)
- Não há campo para rastrear o progresso real

**Solução Temporária:**

- Service retorna `currentValue: 0` por padrão
- Frontend exibe 0% de progresso para novas metas
- **PENDENTE**: Backend precisa adicionar campo `currentValue` na tabela wallets

**Impacto:**

- ❌ Barras de progresso sempre em 0%
- ❌ Não é possível rastrear gastos reais vs. limite
- ❌ Não é possível ver quanto já foi economizado

---

### 2. **Formato de ID diferente**

**API:** Retorna `id` como `number`
**Frontend:** Usa `id` como `string`

**Solução:** ✅ Implementada conversão automática no service

```typescript
id: wallet.id.toString();
```

---

### 3. **Formato de data para metas de gastos**

**Frontend:** Usa formato `YYYY-MM` (apenas ano-mês)
**API:** Requer `startDate` e `endDate` no formato `YYYY-MM-DD`

**Solução:** ✅ Implementada conversão automática

- Converte `YYYY-MM` para `YYYY-MM-01` (startDate)
- Calcula último dia do mês para `endDate`

```typescript
startDate: `${date}-01`;
endDate: `${date}-${lastDay}`; // Ex: "2025-11-30"
```

---

### 4. **Campo `accountId` obrigatório**

**Problema:**

- API requer `accountId` em todas as requisições
- Frontend não tinha esse dado disponível

**Solução:** ✅ Implementada função auxiliar

```typescript
const getAccountId = (): number => {
  const accountId = localStorage.getItem("accountId");
  return accountId ? parseInt(accountId) : 1; // Default para 1
};
```

**⚠️ ATENÇÃO:**

- Certifique-se de salvar o `accountId` no localStorage ao fazer login
- Sem isso, todas as metas serão criadas para accountId = 1

---

### 5. **Campo `nome` vs `category`**

**API:** Usa campo `name` para tudo (tanto BUDGET quanto SPENDING)
**Frontend Gastos:** Usa `category` (Alimentação, Transporte, etc.)
**Frontend Orçamento:** Usa `name` (Fundo de Emergência, Viagem, etc.)

**Solução:** ✅ Implementado mapeamento

- SPENDING: `name` da API → `category` do frontend
- BUDGET: `name` da API → `name` do frontend

---

## 📝 Alterações Implementadas

### 1. **goalService.ts** - Completamente Reescrito

✅ **Novas funcionalidades:**

- `getGoalSpent()` - Busca metas de gastos (SPENDING)
- `getGoalBudget()` - Busca metas de orçamento (BUDGET)
- `createGoalSpent()` - Cria meta de gasto
- `createGoalBudget()` - Cria meta de orçamento
- `updateGoalSpent()` - Atualiza meta de gasto
- `updateGoalBudget()` - Atualiza meta de orçamento
- `deleteWallet()` - Deleta qualquer tipo de meta

✅ **Funções auxiliares:**

- `getAuthToken()` - Obtém token do localStorage
- `getAccountId()` - Obtém ID da conta do localStorage
- `getLastDayOfMonth()` - Calcula último dia do mês

✅ **Mapeamento de dados:**

- Converte `number` → `string` para IDs
- Converte `YYYY-MM` ↔ `YYYY-MM-DD` para datas
- Mapeia `name` ↔ `category` conforme o tipo

---

### 2. **page.tsx (Metas)** - Integração com API

✅ **Estado adicionado:**

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

✅ **Funções atualizadas para async:**

- `handleSubmitGasto()` - Agora chama API
- `handleSubmitOrcamento()` - Agora chama API
- `confirmarExclusao()` - Agora chama API
- `fetchGoals()` - Nova função para carregar metas

✅ **UI melhorada:**

- Spinner de loading durante requisições
- Mensagens de erro com toast
- Botões desabilitados durante loading
- Feedback visual "Salvando...", "Excluindo..."

---

## 🔐 Configuração Necessária

### 1. **Variáveis de Ambiente**

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. **localStorage ao fazer Login**

No componente de login, após autenticação bem-sucedida:

```typescript
// Após login bem-sucedido
localStorage.setItem("token", response.token);
localStorage.setItem("accountId", response.accountId.toString());
```

---

## ⚠️ PENDÊNCIAS CRÍTICAS DA API

### 1. **Adicionar campo `currentValue` na tabela wallets**

```sql
ALTER TABLE wallets ADD COLUMN currentValue DECIMAL(10,2) DEFAULT 0;
```

**Por quê?**

- Sem esse campo, não é possível rastrear:
  - Quanto foi gasto em metas de SPENDING
  - Quanto foi economizado em metas de BUDGET
  - Progresso real das metas

### 2. **Endpoint para atualizar apenas `currentValue`**

**Sugestão:** `PATCH /wallets/{id}/current-value`

```json
{
  "currentValue": 1500.0
}
```

**Por quê?**

- Facilita adicionar gastos/depósitos sem reenviar todos os dados
- Evita conflitos de atualização

### 3. **Endpoint para buscar transações de uma wallet**

**Sugestão:** `GET /wallets/{id}/transactions`

**Retorno:**

```json
[
  {
    "id": 1,
    "description": "Supermercado",
    "value": 150.0,
    "date": "2025-11-05",
    "type": "EXPENSE"
  }
]
```

**Por quê?**

- Permitir visualização detalhada dos gastos/depósitos
- Calcular `currentValue` automaticamente

---

## 🎯 Como Testar

### 1. **Configurar Ambiente**

```bash
# Criar .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local

# Instalar dependências (se necessário)
npm install
```

### 2. **Simular Login**

```javascript
// No console do navegador
localStorage.setItem("token", "seu_token_jwt_aqui");
localStorage.setItem("accountId", "123");
```

### 3. **Testar Fluxos**

✅ **Criar Meta de Gasto:**

1. Ir para /metas
2. Clicar em "Nova Meta"
3. Selecionar categoria "Alimentação"
4. Definir limite: R$ 800
5. Criar meta

✅ **Criar Meta de Orçamento:**

1. Trocar para aba "Metas de Orçamento"
2. Clicar em "Nova Meta"
3. Nome: "Viagem"
4. Valor alvo: R$ 5000
5. Definir datas
6. Criar meta

✅ **Editar Meta:**

1. Clicar no ícone de editar
2. Alterar valores
3. Salvar

✅ **Excluir Meta:**

1. Clicar no ícone de lixeira
2. Confirmar exclusão

---

## 📊 Status de Integração

| Funcionalidade            | Status | Observações                            |
| ------------------------- | ------ | -------------------------------------- |
| Listar metas de gastos    | ✅     | Funcionando                            |
| Listar metas de orçamento | ✅     | Funcionando                            |
| Criar meta de gasto       | ✅     | Funcionando                            |
| Criar meta de orçamento   | ✅     | Funcionando                            |
| Editar meta de gasto      | ✅     | Funcionando                            |
| Editar meta de orçamento  | ✅     | Funcionando                            |
| Excluir meta              | ✅     | Funcionando                            |
| Rastrear progresso        | ⚠️     | Limitado - falta `currentValue` na API |
| Barras de progresso       | ⚠️     | Sempre em 0% - falta `currentValue`    |
| Loading states            | ✅     | Implementado                           |
| Tratamento de erros       | ✅     | Implementado                           |
| Validações                | ✅     | Frontend + API                         |

---

## 🐛 Possíveis Erros e Soluções

### Erro: "Failed to fetch spending goals: 401"

**Causa:** Token inválido ou expirado
**Solução:** Fazer login novamente

### Erro: "Failed to fetch spending goals: 404"

**Causa:** AccountId não existe
**Solução:** Verificar se accountId foi salvo corretamente no login

### Erro: Metas não aparecem

**Causa:** accountId não configurado
**Solução:**

```javascript
localStorage.setItem("accountId", "123");
// Recarregar a página
```

### Barras de progresso sempre em 0%

**Causa:** API não retorna `currentValue`
**Solução:** Backend precisa adicionar esse campo

---

## 📞 Próximos Passos

### Backend:

1. ⬜ Adicionar campo `currentValue` na tabela wallets
2. ⬜ Retornar `currentValue` nas respostas da API
3. ⬜ Criar endpoint PATCH /wallets/{id}/current-value
4. ⬜ Criar endpoint GET /wallets/{id}/transactions
5. ⬜ Calcular `currentValue` automaticamente baseado nas transactions

### Frontend:

1. ✅ Integração com API de wallets
2. ✅ Loading states
3. ✅ Tratamento de erros
4. ⬜ Adicionar funcionalidade de "Adicionar Gasto/Depósito"
5. ⬜ Gráficos de progresso
6. ⬜ Notificações quando meta estiver perto do limite
7. ⬜ Exportar relatório de metas

---

## 📚 Documentação Relacionada

- [API_METAS.md](./API_METAS.md) - Documentação completa da API
- [goalService.ts](./src/app/services/goalService.ts) - Código do serviço
- [page.tsx](./src/app/metas/page.tsx) - Código da página

---

**Última atualização:** 05/11/2025
**Status:** ✅ Integração funcional com limitações conhecidas

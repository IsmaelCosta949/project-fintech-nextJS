import { GoalBudget, GoalSpent } from "../interfaces/goals";

// Usando proxy local para evitar problemas de CORS
const API_BASE_URL = "/api/wallets";

// Tipo da resposta da API de Wallets
interface WalletResponse {
  id: number;
  accountId: number;
  name: string;
  type: "BUDGET" | "SPENDING";
  financialTarget: number;
  startDate: string;
  endDate: string;
  currentValue?: number; // Campo pode não existir na API
}

// Função auxiliar para obter o token
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Função auxiliar para obter o userId do usuário logado
const getUserId = (): number => {
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("userId");
    return userId ? parseInt(userId) : 1; // Default para 1 se não existir
  }
  return 1;
};

// Função para calcular o último dia do mês
const getLastDayOfMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${yearMonth}-${String(lastDay).padStart(2, "0")}`;
};

export const goalService = {
  // Buscar metas de GASTOS (SPENDING)
  async getGoalSpent(): Promise<GoalSpent[]> {
    const userId = getUserId();
    const token = getAuthToken();

    const url = `${API_BASE_URL}/${userId}`;
    console.log("🔍 [GET] Buscando todas as wallets:", url);
    console.log("📋 userId:", userId);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      console.error("❌ Erro ao buscar metas de gastos:", res.statusText);
      throw new Error(`Failed to fetch spending goals: ${res.statusText}`);
    }

    const data: WalletResponse[] = await res.json();
    console.log("✅ Todas as wallets recebidas:", data.length, "itens");
    
    // Filtrar apenas SPENDING
    const spendingGoals = data.filter((wallet) => wallet.type === "SPENDING");
    console.log("📊 Metas de gastos (SPENDING):", spendingGoals.length, "itens");

    // Mapear resposta da API para formato esperado
    return spendingGoals.map((wallet) => ({
      id: wallet.id.toString(),
      category: wallet.name,
      limitValue: wallet.financialTarget,
      spentValue: wallet.currentValue || 0, // ⚠️ API pode não ter esse campo
      date: wallet.startDate.slice(0, 7), // Converter YYYY-MM-DD para YYYY-MM
    }));
  },

  // Buscar metas de ORÇAMENTO (BUDGET)
  async getGoalBudget(): Promise<GoalBudget[]> {
    const userId = getUserId();
    const token = getAuthToken();

    const url = `${API_BASE_URL}/${userId}`;
    console.log("🔍 [GET] Buscando todas as wallets:", url);
    console.log("📋 userId:", userId);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      console.error("❌ Erro ao buscar metas de orçamento:", res.statusText);
      throw new Error(`Failed to fetch budget goals: ${res.statusText}`);
    }

    const data: WalletResponse[] = await res.json();
    console.log("✅ Todas as wallets recebidas:", data.length, "itens");
    
    // Filtrar apenas BUDGET
    const budgetGoals = data.filter((wallet) => wallet.type === "BUDGET");
    console.log("📊 Metas de orçamento (BUDGET):", budgetGoals.length, "itens");

    // Mapear resposta da API para formato esperado
    return budgetGoals.map((wallet) => ({
      id: wallet.id.toString(),
      name: wallet.name,
      targetValue: wallet.financialTarget,
      currentValue: wallet.currentValue || 0, // ⚠️ API pode não ter esse campo
      startDate: wallet.startDate,
      endDate: wallet.endDate,
    }));
  },

  // Criar meta de GASTO (SPENDING)
  async createGoalSpent(goal: Omit<GoalSpent, "id">): Promise<GoalSpent> {
    const userId = getUserId();
    const token = getAuthToken();

    const wallet = {
      accountId: userId,
      name: goal.category,
      type: "SPENDING",
      financialTarget: goal.limitValue,
      startDate: `${goal.date}-01`,
      endDate: getLastDayOfMonth(goal.date!),
    };

    const url = `${API_BASE_URL}`;
    console.log("➕ [POST] Criando meta de gasto:", url);
    console.log("📤 Dados enviados:", wallet);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao criar meta de gasto:", res.statusText);
      console.error("📄 Erro detalhado:", errorText);
      throw new Error(`Failed to create spending goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();
    console.log("✅ Meta de gasto criada com sucesso!");
    console.log("📊 Dados retornados:", data);

    return {
      id: data.id.toString(),
      category: data.name,
      limitValue: data.financialTarget,
      spentValue: goal.spentValue || 0,
      date: data.startDate.slice(0, 7),
    };
  },

  // Criar meta de ORÇAMENTO (BUDGET)
  async createGoalBudget(goal: Omit<GoalBudget, "id">): Promise<GoalBudget> {
    const userId = getUserId();
    const token = getAuthToken();

    const wallet = {
      accountId: userId,
      name: goal.name,
      type: "BUDGET",
      financialTarget: goal.targetValue,
      startDate: goal.startDate,
      endDate: goal.endDate,
    };

    const url = `${API_BASE_URL}`;
    console.log("➕ [POST] Criando meta de orçamento:", url);
    console.log("📤 Dados enviados:", wallet);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao criar meta de orçamento:", res.statusText);
      console.error("📄 Erro detalhado:", errorText);
      throw new Error(`Failed to create budget goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();
    console.log("✅ Meta de orçamento criada com sucesso!");
    console.log("📊 Dados retornados:", data);

    return {
      id: data.id.toString(),
      name: data.name,
      targetValue: data.financialTarget,
      currentValue: goal.currentValue || 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };
  },

  // Atualizar meta de GASTO (SPENDING)
  async updateGoalSpent(goal: GoalSpent): Promise<GoalSpent> {
    const userId = getUserId();
    const token = getAuthToken();

    const wallet = {
      accountId: userId,
      name: goal.category,
      type: "SPENDING",
      financialTarget: goal.limitValue,
      startDate: `${goal.date}-01`,
      endDate: getLastDayOfMonth(goal.date!),
    };

    const url = `${API_BASE_URL}/id/${goal.id}`;
    console.log("✏️ [PUT] Atualizando meta de gasto:", url);
    console.log("📤 Dados enviados:", wallet);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao atualizar meta de gasto:", res.statusText);
      console.error("📄 Erro detalhado:", errorText);
      throw new Error(`Failed to update spending goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();
    console.log("✅ Meta de gasto atualizada com sucesso!");
    console.log("📊 Dados retornados:", data);

    return {
      id: data.id.toString(),
      category: data.name,
      limitValue: data.financialTarget,
      spentValue: goal.spentValue,
      date: data.startDate.slice(0, 7),
    };
  },

  // Atualizar meta de ORÇAMENTO (BUDGET)
  async updateGoalBudget(goal: GoalBudget): Promise<GoalBudget> {
    const userId = getUserId();
    const token = getAuthToken();

    const wallet = {
      accountId: userId,
      name: goal.name,
      type: "BUDGET",
      financialTarget: goal.targetValue,
      startDate: goal.startDate,
      endDate: goal.endDate,
    };

    const url = `${API_BASE_URL}/id/${goal.id}`;
    console.log("✏️ [PUT] Atualizando meta de orçamento:", url);
    console.log("📤 Dados enviados:", wallet);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wallet),
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao atualizar meta de orçamento:", res.statusText);
      console.error("📄 Erro detalhado:", errorText);
      throw new Error(`Failed to update budget goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();
    console.log("✅ Meta de orçamento atualizada com sucesso!");
    console.log("📊 Dados retornados:", data);

    return {
      id: data.id.toString(),
      name: data.name,
      targetValue: data.financialTarget,
      currentValue: goal.currentValue,
      startDate: data.startDate,
      endDate: data.endDate,
    };
  },

  // Deletar wallet (meta)
  async deleteWallet(walletId: string): Promise<void> {
    const token = getAuthToken();

    const url = `${API_BASE_URL}/id/${walletId}`;
    console.log("🗑️ [DELETE] Deletando meta:", url);
    console.log("🔑 token:", token ? "✅ Presente" : "❌ Ausente");

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao deletar meta:", res.statusText);
      console.error("📄 Erro detalhado:", errorText);
      throw new Error(`Failed to delete wallet: ${res.statusText}`);
    }

    console.log("✅ Meta deletada com sucesso!");
  },
};

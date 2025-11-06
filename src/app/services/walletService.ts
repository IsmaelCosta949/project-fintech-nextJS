import { GoalBudget, GoalSpent } from "../interfaces/goals";

const API_BASE_URL = "http://localhost:8080/api";

interface WalletResponse {
  walletId: number;
  accountId: number;
  name: string;
  type: string;
  financialTarget: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

const getUserId = (): number => {
  if (typeof window !== "undefined") {
    const accountId = localStorage.getItem("accountId");
    if (!accountId) {
      return 0;
    }
    return parseInt(accountId);
  }
  return 0;
};

const getLastDayOfMonth = (yearMonth: string): string => {
  const [year, month] = yearMonth.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return `${yearMonth}-${String(lastDay).padStart(2, "0")}`;
};

export const walletService = {
  async getGoalSpent(): Promise<GoalSpent[]> {
    const accountId = getUserId();

    const res = await fetch(`${API_BASE_URL}/wallets/${accountId}/EXPENSE`, {
      cache: "no-store",
    });

    if (res.status === 400 || res.status === 404) {
      return [];
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch spending goals: ${res.statusText}`);
    }

    const data: WalletResponse[] = await res.json();

    return data.map((wallet) => ({
      id: wallet.walletId.toString(),
      category: wallet.name,
      limitValue: wallet.financialTarget,
      spentValue: 0,
      date: wallet.startDate.slice(0, 7),
    }));
  },

  async getGoalBudget(): Promise<GoalBudget[]> {
    const accountId = getUserId();

    const res = await fetch(`${API_BASE_URL}/wallets/${accountId}/BUDGET`, {
      cache: "no-store",
    });

    if (res.status === 400 || res.status === 404) {
      return [];
    }

    if (!res.ok) {
      throw new Error(`Failed to fetch budget goals: ${res.statusText}`);
    }

    const data: WalletResponse[] = await res.json();

    return data.map((wallet) => ({
      id: wallet.walletId.toString(),
      name: wallet.name,
      targetValue: wallet.financialTarget,
      currentValue: 0,
      startDate: wallet.startDate,
      endDate: wallet.endDate,
    }));
  },

  async createGoalSpent(goal: Omit<GoalSpent, "id">): Promise<GoalSpent> {
    const accountId = getUserId();

    const body = {
      accountId: accountId,
      name: goal.category,
      type: "EXPENSE",
      financialTarget: goal.limitValue,
      startDate: `${goal.date}-01`,
      endDate: getLastDayOfMonth(goal.date!),
    };

    const res = await fetch(`${API_BASE_URL}/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to create spending goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();

    return {
      id: data.walletId.toString(),
      category: data.name,
      limitValue: data.financialTarget,
      spentValue: goal.spentValue || 0,
      date: data.startDate.slice(0, 7),
    };
  },

  async createGoalBudget(goal: Omit<GoalBudget, "id">): Promise<GoalBudget> {
    const accountId = getUserId();

    const body = {
      accountId: accountId,
      name: goal.name,
      type: "BUDGET",
      financialTarget: goal.targetValue,
      startDate: (goal.startDate || '').split('T')[0],
      endDate: (goal.endDate || '').split('T')[0],
    };

    const res = await fetch(`${API_BASE_URL}/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to create budget goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();

    return {
      id: data.walletId.toString(),
      name: data.name,
      targetValue: data.financialTarget,
      currentValue: goal.currentValue || 0,
      startDate: data.startDate,
      endDate: data.endDate,
    };
  },

  async updateGoalSpent(goal: GoalSpent): Promise<GoalSpent> {
    const accountId = getUserId();

    const body = {
      accountId: accountId,
      name: goal.category,
      type: "EXPENSE",
      financialTarget: goal.limitValue,
      startDate: `${goal.date}-01`,
      endDate: getLastDayOfMonth(goal.date!),
    };

    const res = await fetch(`${API_BASE_URL}/wallets/${goal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to update spending goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();

    return {
      id: data.walletId.toString(),
      category: data.name,
      limitValue: data.financialTarget,
      spentValue: goal.spentValue,
      date: data.startDate.slice(0, 7),
    };
  },

  async updateGoalBudget(goal: GoalBudget): Promise<GoalBudget> {
    const accountId = getUserId();

    const body = {
      accountId: accountId,
      name: goal.name,
      type: "BUDGET",
      financialTarget: goal.targetValue,
      startDate: (goal.startDate || '').split('T')[0],
      endDate: (goal.endDate || '').split('T')[0],
    };

    const res = await fetch(`${API_BASE_URL}/wallets/${goal.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`Failed to update budget goal: ${res.statusText}`);
    }

    const data: WalletResponse = await res.json();

    return {
      id: data.walletId.toString(),
      name: data.name,
      targetValue: data.financialTarget,
      currentValue: goal.currentValue,
      startDate: data.startDate,
      endDate: data.endDate,
    };
  },

  async deleteWallet(walletId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/wallets/${walletId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete wallet: ${res.statusText}`);
    }
  },
};

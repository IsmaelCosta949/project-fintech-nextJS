import { GoalBudget, GoalSpent } from "../interfaces/goals";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const goalService = {
  async getGoalSpent(): Promise<GoalSpent[]> {
    // const res = await fetch(`${API_BASE_URL}/spending-goals`, {
    //   cache: "no-store",
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to fetch spending goals: ${res.statusText}`);
    // }

    // const data = await res.json();

    const data = [
      {
        id: "1",
        category: "Alimentação",
        limitValue: 800,
        spentValue: 528.5,
        date: "2025-11",
      },
      {
        id: "2",
        category: "Transporte",
        limitValue: 400,
        spentValue: 185.0,
        date: "2025-11",
      },
      {
        id: "3",
        category: "Entretenimento",
        limitValue: 300,
        spentValue: 255.9,
        date: "2025-11",
      },
    ];

    return data.map(
      ({ id, category, limitValue, spentValue, date }: GoalSpent) => ({
        id,
        category,
        limitValue,
        spentValue,
        date,
      })
    );
  },

  async getGoalBudget(): Promise<GoalBudget[]> {
    // const res = await fetch(`${API_BASE_URL}/budget-goals`, {
    //   cache: "no-store",
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to fetch budget goals: ${res.statusText}`);
    // }

    // const data = await res.json();

    const data = [
      {
        id: "1",
        name: "Fundo de Emergência",
        targetValue: 10000,
        currentValue: 4500,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      },
      {
        id: "2",
        name: "Viagem 2026",
        targetValue: 5000,
        currentValue: 1200,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      },
      {
        id: "3",
        name: "Novo Computador",
        targetValue: 3500,
        currentValue: 2800,
        startDate: "2025-09-01",
        endDate: "2025-12-31",
      },
    ];

    return data.map(
      ({
        id,
        name,
        targetValue,
        currentValue,
        startDate,
        endDate,
      }: GoalBudget) => ({
        id,
        name,
        targetValue,
        currentValue,
        startDate,
        endDate,
      })
    );
  },
};

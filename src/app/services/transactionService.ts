import { Transactions } from "../interfaces/transactions";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const transactionService = {
  async getTransactions(): Promise<Transactions[]> {
    // const res = await fetch(`${API_BASE_URL}/recent-transactions`);
    // if (!res.ok) {
    //   throw new Error(`Failed to fetch recent transactions: ${res.statusText}`);
    // }

    // const data = await res.json();

    var data = [
      {
        id: "1",
        description: "Salário",
        value: 5000.0,
        type: "receita" as const,
        category: "Salário",
        date: "2025-11-01",
        hour: "08:00",
      },
      {
        id: "2",
        description: "Supermercado",
        value: -328.5,
        type: "despesa" as const,
        category: "Alimentação",
        date: "2025-10-31",
        hour: "18:00",
      },
      {
        id: "3",
        description: "Netflix",
        value: -55.9,
        type: "despesa" as const,
        category: "Entretenimento",
        date: "2025-10-30",
        hour: "10:00",
      },
      {
        id: "4",
        description: "Freelance",
        value: 1200.0,
        type: "receita" as const,
        category: "Receita Extra",
        date: "2025-10-28",
        hour: "04:00",
      },
    ];

    return data.map(
      ({
        id,
        description,
        value,
        type,
        category,
        date,
        hour,
      }: Transactions) => ({
        id,
        description,
        value,
        type,
        category,
        date,
        hour,
      })
    );
  },
};

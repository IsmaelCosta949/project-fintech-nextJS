import { Wallets } from "../interfaces/wallets";

const API_BASE_URL = "https://wallets-api-fintech.onrender.com/";

export const walletService = {
  async getWallets(): Promise<Wallets[]> {
    const data = [
      {
        walletId: 0,
        accountId: 0,
        name: "TEXTO",
        type: "despesa",
        financialTarget: 0,
        startDate: "2025-11-05",
        endDate: "2025-11-05",
        createdAt: "2025-11-05T19:54:14.892Z",
        updatedAt: "2025-11-05T19:54:14.892Z",
      },
      {
        walletId: 0,
        accountId: 0,
        name: "TEXTO",
        type: "receita",
        financialTarget: 0,
        startDate: "2025-11-05",
        endDate: "2025-11-05",
        createdAt: "2025-11-05T19:54:14.892Z",
        updatedAt: "2025-11-05T19:54:14.892Z",
      },
    ];

    return data.map(
      ({
        walletId,
        accountId,
        name,
        type,
        financialTarget,
        startDate,
        endDate,
        createdAt,
        updatedAt,
      }): Wallets => ({
        walletId,
        accountId,
        name,
        type,
        financialTarget,
        startDate,
        endDate,
        createdAt,
        updatedAt,
      })
    );
  },
};

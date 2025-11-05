import { formatDate, formatTime } from "~/utils/formatDate";
import { Transactions } from "../interfaces/transactions";
import { Wallets } from "../interfaces/wallets";

const API_BASE_URL = "https://wallets-api-fintech.onrender.com/";

export const transactionService = {
  async getTransactions(): Promise<Transactions[]> {
    const wallets = await this.getWallets();

    const data = {
      content: [
        {
          transactionId: 0,
          walletId: 0,
          description: "string",
          type: "BUDGET",
          value: 0,
          transactionAt: "2025-11-05T12:27:47.956Z",
          createdAt: "2025-11-05T12:27:47.956Z",
          updatedAt: "2025-11-05T12:27:47.956Z",
        },
      ],
    };

    return data.content.map((item): Transactions => {
      const wallet = wallets.find((w) => w.walletId === item.walletId);
      console.log({
        id: item.transactionId,
        walletId: item.walletId,
        description: item.description,
        value: item.value,
        type: item.type,
        category: wallet ? wallet.name : "Desconhecida",
        date: formatDate(item.transactionAt),
        hour: formatTime(item.transactionAt),
      });

      return {
        id: item.transactionId,
        walletId: item.walletId,
        description: item.description,
        value: item.value,
        type: item.type,
        category: wallet ? wallet.name : "Desconhecida",
        date: formatDate(item.transactionAt),
        hour: formatTime(item.transactionAt),
      };
    });
  },

  async getWallets(): Promise<Wallets[]> {
    const data = [
      {
        walletId: 0,
        accountId: 0,
        name: "TEXTO",
        type: "BUDGET",
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
  async postTransaction(bodyObject: Transactions): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/recent-transactions`, {
      method: "post",
      body: JSON.stringify(bodyObject),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch recent transactions: ${res.statusText}`);
    }

    const data = await res.json();
    console.log(data);
    if (data.status == 200) {
      return true;
    } else {
      return false;
    }
  },
};

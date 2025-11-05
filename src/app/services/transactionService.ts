import { formatDate, formatTime } from "~/utils/formatDate";
import { Transactions, TransactionsPost } from "../interfaces/transactions";
import { Wallets } from "../interfaces/wallets";
import { walletService } from "./walletService";

const API_BASE_URL = "https://wallets-api-fintech.onrender.com/api";

export const transactionService = {
  async getTransactions(): Promise<Transactions[]> {
    const wallets = await walletService.getWallets();

    const data = {
      content: [
        {
          transactionId: 0,
          walletId: 0,
          description: "string",
          type: "despesa",
          value: 0,
          transactionAt: "2025-11-05T12:27:47.956Z",
          createdAt: "2025-11-05T12:27:47.956Z",
          updatedAt: "2025-11-05T12:27:47.956Z",
        },
      ],
    };

    return data.content.map((item): Transactions => {
      const wallet = wallets.find((w) => w.walletId === item.walletId);

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

  async postTransaction(bodyObject: TransactionsPost): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
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
  async editTransaction(
    bodyObject: TransactionsPost,
    transactionId: number
  ): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: "put",
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
  async deleteTransaction(transactionId: number): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: "delete",
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

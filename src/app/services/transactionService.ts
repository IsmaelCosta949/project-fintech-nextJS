import { formatDate, formatTime } from "~/utils/formatDate";
import { Transactions, TransactionsPost } from "../interfaces/transactions";

const API_BASE_URL = "http://localhost:8080/api";

// Tipo da resposta da API de Transactions (conforme backend)
interface TransactionResponse {
  transactionId: number;
  walletId: number;
  description: string;
  type: string; // "BUDGET" ou "EXPENSE"
  value: number;
  transactionAt: string; // ISO DateTime
  createdAt: string;
  updatedAt: string;
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Função auxiliar para obter o accountId
const getAccountId = (): number => {
  if (typeof window !== "undefined") {
    const accountId = localStorage.getItem("accountId");
    if (!accountId) {
      console.error("⚠️ accountId não encontrado no localStorage!");
      return 0;
    }
    return parseInt(accountId);
  }
  return 0;
};

export const transactionService = {
  async getTransactions(
    type?: "BUDGET" | "EXPENSE",
    page: number = 0,
    size: number = 100
  ): Promise<Transactions[]> {
    const accountId = getAccountId();

    const params = new URLSearchParams({
      accountId: accountId.toString(),
      page: page.toString(),
      size: size.toString(),
      sortBy: "CREATED_AT",
      direction: "DESC",
    });

    if (type) {
      params.append("type", type);
    }

    const url = `${API_BASE_URL}/transactions?${params.toString()}`;

    console.log("🔍 [GET] Buscando transactions:", {
      url,
      accountId,
      type,
    });

    const res = await fetch(url, {
      cache: "no-store",
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    // Se retornar 400 ou 404, provavelmente não há transações ainda
    if (res.status === 400 || res.status === 404) {
      console.log("⚠️ Nenhuma transação encontrada");
      return [];
    }

    if (!res.ok) {
      console.error("❌ Erro ao buscar transações:", res.statusText);
      throw new Error(`Failed to fetch transactions: ${res.statusText}`);
    }

    const data: PageResponse<TransactionResponse> = await res.json();

    const mapped = data.content.map(
      (item): Transactions => {
        // Normalizar o tipo que vem do backend para maiúsculo
        let normalizedType = item.type.toUpperCase();
        
        // Se vier em português, converter para inglês
        if (normalizedType === "DESPESA" || normalizedType === "EXPENSE") {
          normalizedType = "EXPENSE";
        } else if (normalizedType === "RECEITA" || normalizedType === "BUDGET" || normalizedType === "ORÇAMENTO") {
          normalizedType = "BUDGET";
        }

        return {
          id: item.transactionId,
          walletId: item.walletId,
          description: item.description,
          value: item.value,
          type: normalizedType,
          category: normalizedType === "BUDGET" ? "Orçamento" : "Despesa",
          date: formatDate(item.transactionAt),
          hour: formatTime(item.transactionAt),
        };
      }
    );
    
    return mapped;
  },

  async postTransaction(bodyObject: TransactionsPost): Promise<boolean> {
    const body = {
      walletId: bodyObject.walletId,
      description: bodyObject.description,
      type: bodyObject.type, // "BUDGET" ou "EXPENSE"
      value: bodyObject.value,
      transactionAt: bodyObject.transactionAt, // Já deve vir em formato ISO
    };

    console.log("➕ [POST] Criando transaction:", {
      url: `${API_BASE_URL}/transactions`,
      body,
    });

    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao criar transação:", errorText);
      throw new Error(`Failed to create transaction: ${res.statusText}`);
    }

    const data: TransactionResponse = await res.json();
    console.log("✅ Transaction criada:", data);

    return true;
  },

  async editTransaction(
    bodyObject: TransactionsPost,
    transactionId: number
  ): Promise<boolean> {
    const body = {
      walletId: bodyObject.walletId,
      description: bodyObject.description,
      type: bodyObject.type, // "BUDGET" ou "EXPENSE"
      value: bodyObject.value,
      transactionAt: bodyObject.transactionAt,
    };

    console.log("✏️ [PUT] Atualizando transaction:", {
      url: `${API_BASE_URL}/transactions/${transactionId}`,
      body,
    });

    const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao atualizar transação:", errorText);
      throw new Error(`Failed to update transaction: ${res.statusText}`);
    }

    const data: TransactionResponse = await res.json();
    console.log("✅ Transaction atualizada:", data);

    return true;
  },

  async deleteTransaction(transactionId: number): Promise<boolean> {
    console.log("🗑️ [DELETE] Deletando transaction:", {
      url: `${API_BASE_URL}/transactions/${transactionId}`,
      transactionId,
    });

    const res = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: "DELETE",
    });

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro ao deletar transação:", errorText);
      throw new Error(`Failed to delete transaction: ${res.statusText}`);
    }

    console.log("✅ Transaction deletada com sucesso!");

    return true;
  },

  // Buscar total de transações por tipo
  async getTotalByType(type: "BUDGET" | "EXPENSE"): Promise<number> {
    const accountId = getAccountId();

    console.log("🔍 [GET] Buscando total por tipo:", {
      url: `${API_BASE_URL}/transactions/sum/account/${accountId}?type=${type}`,
      accountId,
      type,
    });

    const res = await fetch(
      `${API_BASE_URL}/transactions/sum/account/${accountId}?type=${type}`,
      {
        cache: "no-store",
      }
    );

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      console.error("❌ Erro ao buscar total:", res.statusText);
      return 0;
    }

    const total: number = await res.json();
    console.log("✅ Total recebido:", total);

    return total;
  },

  // Buscar total de transações de uma wallet
  async getTotalByWallet(walletId: number): Promise<number> {
    console.log("🔍 [GET] Buscando total por wallet:", {
      url: `${API_BASE_URL}/transactions/sum/wallet/${walletId}`,
      walletId,
    });

    const res = await fetch(
      `${API_BASE_URL}/transactions/sum/wallet/${walletId}`,
      {
        cache: "no-store",
      }
    );

    console.log("📥 Resposta status:", res.status, res.statusText);

    if (!res.ok) {
      console.error("❌ Erro ao buscar total da wallet:", res.statusText);
      return 0;
    }

    const total: number = await res.json();
    console.log("✅ Total da wallet recebido:", total);

    return total;
  },
};

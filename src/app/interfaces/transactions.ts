export interface Transactions {
  id: number;
  walletId?: number;
  description: string;
  value: number;
  type: string;
  category: string;
  date: string;
  hour: string;
}
export interface TransactionsPost {
  walletId: number;
  description: string;
  type: string;
  value: number;
  transactionAt: string;
}

export interface Transactions {
  id?: number;
  walletId?: number;
  description: string;
  value: number;
  type: string;
  category: string
  date: string;
  hour: string
}
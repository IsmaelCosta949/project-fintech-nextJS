export interface Transactions {
  id: string;
  description: string;
  value: number;
  type: "receita" | "despesa";
  category: string;
  date: string;
  hour?: string;
}

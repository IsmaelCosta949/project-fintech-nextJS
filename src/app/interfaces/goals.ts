export interface GoalSpent {
  id: string;
  category: string;
  limitValue: number;
  spentValue: number;
  date?: string;
}

export interface GoalBudget {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  startDate?: string;
  endDate?: string;
}

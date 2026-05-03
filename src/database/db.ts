import Dexie, { type Table } from 'dexie';

export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: number;
  synced: boolean;
}

export interface Budget {
  id?: number;
  category: string;
  limit: number;
  spent: number;
  month: string;
  synced: boolean;
}

export interface Goal {
  id?: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: number;
  color: string;
  synced: boolean;
}

export class WalletZenDB extends Dexie {
  transactions!: Table<Transaction>;
  budgets!: Table<Budget>;
  goals!: Table<Goal>;

  constructor() {
    super('WalletZenDB');
    this.version(1).stores({
      transactions: '++id, type, category, date, synced',
      budgets: '++id, category, month, synced',
      goals: '++id, title, deadline, synced'
    });
  }
}

export const db = new WalletZenDB();

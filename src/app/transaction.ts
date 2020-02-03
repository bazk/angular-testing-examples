export interface Transaction {
  id: string;
  accountId: string;
  createdAt: Date;
  description: string;
  value: Number;
  type: string;
}

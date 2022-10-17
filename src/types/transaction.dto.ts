export interface Transaction {
  id?: string;
  status: boolean;
  date: string | Date;
  subscription?: string | Date;
}

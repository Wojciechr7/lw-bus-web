export interface IUser {
  id?: number;
  name: string;
  login: string;
  email: string;
  roles: any[];
  token?: string;
  company_id?: number;
}

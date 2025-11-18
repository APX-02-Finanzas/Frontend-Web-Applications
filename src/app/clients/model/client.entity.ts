export class Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  dni: string;
  salesManId: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  hasPreviousStateHousing: boolean;
  canApplyForBono: boolean;

  constructor(client: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    dni?: string;
    salesManId?: number;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    hasPreviousStateHousing?: boolean;
    canApplyForBono?: boolean;
  }) {
    this.id = client.id || 0;
    this.name = client.name || '';
    this.email = client.email || '';
    this.phone = client.phone || '';
    this.dni = client.dni || '';
    this.salesManId = client.salesManId || 0;
    this.monthlyIncome = client.monthlyIncome || 0;
    this.monthlyExpenses = client.monthlyExpenses || 0;
    this.hasPreviousStateHousing = client.hasPreviousStateHousing || false;
    this.canApplyForBono = client.canApplyForBono || false;
  }
}

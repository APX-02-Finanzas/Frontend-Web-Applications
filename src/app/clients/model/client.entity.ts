export enum CivilState {
  SINGLE = 'Soltero(a)',
  MARRIED = 'Casado(a)',
  DIVORCED = 'Divorciado(a)',
  WIDOWED = 'Viudo(a)'
}

export class Client {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  dni: string;
  salesManId: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  hasPreviousStateHousing: boolean;
  canApplyForBono: boolean;
  civilState: CivilState;

  constructor(client: {
    id?: number;
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    dni?: string;
    salesManId?: number;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    hasPreviousStateHousing?: boolean;
    canApplyForBono?: boolean;
    civilState?: CivilState | string;
  } = {}) {
    this.id = client.id || 0;
    this.name = client.name || '';
    this.surname = client.surname || '';
    this.email = client.email || '';
    this.phone = client.phone || '';
    this.dni = client.dni || '';
    this.salesManId = client.salesManId || 0;
    this.monthlyIncome = client.monthlyIncome || 0;
    this.monthlyExpenses = client.monthlyExpenses || 0;
    this.hasPreviousStateHousing = client.hasPreviousStateHousing || false;
    this.canApplyForBono = client.canApplyForBono || false;
    this.civilState = (client.civilState as CivilState) || CivilState.SINGLE;
  }
}

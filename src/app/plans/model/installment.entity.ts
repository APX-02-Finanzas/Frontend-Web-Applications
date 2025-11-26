export class Installment {
  id: number;

  number: number;                 // Nº
  annualEffectiveRate: number;    // TEA
  periodEffectiveRate: number;    // i' = TEP = TEM
  annualInflation: number;        // IA
  periodInflation: number;        // IP
  gracePeriodType: string;        // P.G. (T, P, S)
  initialBalance: number;         // Saldo Inicial
  indexedInitialBalance: number;  // Saldo Inicial Indexado
  interest: number;               // Interés
  installmentAmount: number;      // Cuota (inc Seg Des)
  amortization: number;           // Amort.
  prepayment: number;             // Prepago
  creditLifeInsurance: number;    // Seguro desgrav
  riskInsurance: number;          // Seguro riesgo
  commission: number;             // Comisión
  postage: number;                // Portes
  adminFees: number;              // Gastos Adm.
  finalBalance: number;           // Saldo Final
  cashFlow: number;               // Flujo

  constructor(installment: {
    id?: number;
    number?: number;
    annualEffectiveRate?: number;
    periodEffectiveRate?: number;
    annualInflation?: number;
    periodInflation?: number;
    gracePeriodType?: string;
    initialBalance?: number;
    indexedInitialBalance?: number;
    interest?: number;
    installmentAmount?: number;
    amortization?: number;
    prepayment?: number;
    creditLifeInsurance?: number;
    riskInsurance?: number;
    commission?: number;
    postage?: number;
    adminFees?: number;
    finalBalance?: number;
    cashFlow?: number;
  }) {
    this.id = installment.id || 0;

    this.number = installment.number || 0;
    this.annualEffectiveRate = installment.annualEffectiveRate || 0;
    this.periodEffectiveRate = installment.periodEffectiveRate || 0;
    this.annualInflation = installment.annualInflation || 0;
    this.periodInflation = installment.periodInflation || 0;
    this.gracePeriodType = installment.gracePeriodType || '';

    this.initialBalance = installment.initialBalance || 0;
    this.indexedInitialBalance = installment.indexedInitialBalance || 0;
    this.interest = installment.interest || 0;
    this.installmentAmount = installment.installmentAmount || 0;
    this.amortization = installment.amortization || 0;
    this.prepayment = installment.prepayment || 0;
    this.creditLifeInsurance = installment.creditLifeInsurance || 0;
    this.riskInsurance = installment.riskInsurance || 0;
    this.commission = installment.commission || 0;
    this.postage = installment.postage || 0;
    this.adminFees = installment.adminFees || 0;
    this.finalBalance = installment.finalBalance || 0;
    this.cashFlow = installment.cashFlow || 0;
  }
}

import {Installment} from './installment.entity';


export interface InterestRateConfig {
  installmentNumber: number;
  newAnnualRate: number;
}

export class Plan {
  id: number;
  assetSalePrice: number;           // Precio de Venta del Activo
  downPaymentPercentage: number;    // % Cuota Inicial
  years: number;                    // Nº de Años
  paymentFrequency: number;         // Frecuencia de pago (días)
  daysPerYear: number;              // Nº de días por año

  // Costos iniciales
  notarialCosts: number;            // Costes Notariales
  registryCosts: number;            // Costes Registrales
  appraisal: number;                // Tasación
  studyCommission: number;          // Comisión de estudio
  activationCommission: number;     // Comisión activación

  // Costos periódicos
  periodicCommission: number;       // Comisión periódica
  postage: number;                  // Portes
  administrationFees: number;       // Gastos de Administración
  creditLifeInsurance: number;      // % de Seguro desgravamen
  riskInsurance: number;            // % de Seguro riesgo

  // Costo de oportunidad
  discountRate: number;             // Tasa de descuento

  // Configuración
  currency: string;                 // Moneda (mapea al enum Currency del backend)
  interestRateType: string;         // Tipo de tasa (mapea a InterestRateType)

  // Resultados calculados
  financedBalance: number;              // Saldo a financiar
  loanAmount: number;                   // Monto del préstamo
  installmentsPerYear: number;          // Nº Cuotas por Año
  totalInstallments: number;            // Nº Total de Cuotas
  periodicCreditLifeInsurance: number;  // % Seguro desgrav. periódico
  periodicRiskInsurance: number;        // Seguro riesgo periódico

  // Cuotas del plan
  installments: Installment[];

  // Totales
  totalInterest: number;
  totalAmortization: number;
  totalCreditLifeInsurance: number;
  totalRiskInsurance: number;
  totalCommissions: number;
  totalPostageAndFees: number;

  // Indicadores de rentabilidad
  periodicDiscountRate: number;
  irr: number;                        // TIR
  effectiveAnnualCostRate: number;    // TCEA
  npv: number;                        // VAN

  annualInterestRate: number;         // Tasa anual base

  // Referencias
  clientId: number;
  propertyId: number;
  salesManId: number;
  bonusApplied: boolean;
  bonusAmount: number;

  // Cambios de tasa en el tiempo
  interestRateConfigs: InterestRateConfig[];

  constructor(plan: {
    id?: number;

    assetSalePrice?: number;
    downPaymentPercentage?: number;
    years?: number;
    paymentFrequency?: number;
    daysPerYear?: number;

    notarialCosts?: number;
    registryCosts?: number;
    appraisal?: number;
    studyCommission?: number;
    activationCommission?: number;

    periodicCommission?: number;
    postage?: number;
    administrationFees?: number;
    creditLifeInsurance?: number;
    riskInsurance?: number;

    discountRate?: number;

    currency?: string;
    interestRateType?: string;

    financedBalance?: number;
    loanAmount?: number;
    installmentsPerYear?: number;
    totalInstallments?: number;
    periodicCreditLifeInsurance?: number;
    periodicRiskInsurance?: number;

    installments?: Installment[];

    totalInterest?: number;
    totalAmortization?: number;
    totalCreditLifeInsurance?: number;
    totalRiskInsurance?: number;
    totalCommissions?: number;
    totalPostageAndFees?: number;

    periodicDiscountRate?: number;
    irr?: number;
    effectiveAnnualCostRate?: number;
    npv?: number;

    annualInterestRate?: number;

    clientId?: number;
    propertyId?: number;
    salesManId?: number;
    bonusApplied?: boolean;
    bonusAmount?: number;

    interestRateConfigs?: InterestRateConfig[];
  }) {
    this.id = plan.id || 0;

    this.assetSalePrice = plan.assetSalePrice || 0;
    this.downPaymentPercentage = plan.downPaymentPercentage || 0;
    this.years = plan.years || 0;
    this.paymentFrequency = plan.paymentFrequency || 0;
    this.daysPerYear = plan.daysPerYear || 360;

    this.notarialCosts = plan.notarialCosts || 0;
    this.registryCosts = plan.registryCosts || 0;
    this.appraisal = plan.appraisal || 0;
    this.studyCommission = plan.studyCommission || 0;
    this.activationCommission = plan.activationCommission || 0;

    this.periodicCommission = plan.periodicCommission || 0;
    this.postage = plan.postage || 0;
    this.administrationFees = plan.administrationFees || 0;
    this.creditLifeInsurance = plan.creditLifeInsurance || 0;
    this.riskInsurance = plan.riskInsurance || 0;

    this.discountRate = plan.discountRate || 0;

    this.currency = plan.currency || 'PEN';
    this.interestRateType = plan.interestRateType || '';

    this.financedBalance = plan.financedBalance || 0;
    this.loanAmount = plan.loanAmount || 0;
    this.installmentsPerYear = plan.installmentsPerYear || 0;
    this.totalInstallments = plan.totalInstallments || 0;
    this.periodicCreditLifeInsurance = plan.periodicCreditLifeInsurance || 0;
    this.periodicRiskInsurance = plan.periodicRiskInsurance || 0;

    this.installments = plan.installments || [];

    this.totalInterest = plan.totalInterest || 0;
    this.totalAmortization = plan.totalAmortization || 0;
    this.totalCreditLifeInsurance = plan.totalCreditLifeInsurance || 0;
    this.totalRiskInsurance = plan.totalRiskInsurance || 0;
    this.totalCommissions = plan.totalCommissions || 0;
    this.totalPostageAndFees = plan.totalPostageAndFees || 0;

    this.periodicDiscountRate = plan.periodicDiscountRate || 0;
    this.irr = plan.irr || 0;
    this.effectiveAnnualCostRate = plan.effectiveAnnualCostRate || 0;
    this.npv = plan.npv || 0;

    this.annualInterestRate = plan.annualInterestRate || 0;

    this.clientId = plan.clientId || 0;
    this.propertyId = plan.propertyId || 0;
    this.salesManId = plan.salesManId || 0;
    this.bonusApplied = plan.bonusApplied || false;
    this.bonusAmount = plan.bonusAmount || 0;

    this.interestRateConfigs = plan.interestRateConfigs || [];
  }
}

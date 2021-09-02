export interface SalePaymentType{
  SaleId?: number;
  PaymentTypeId? : number;
  PaymentTypeDescription? : string;
}

export interface CustomerOrder {
  SaleId: number;
  DateofSale?: string;
  CustomerName?: string;
  CustomerSurname?: string;
  CustomerTelephone?: string;
  SaleStatusDescription?: string;
  CompletionMethodDescription?: string;
  BranchName?: string;
  paymentTypes?: SalePaymentType[];
  saleStatusId? : number;
  ProductNames? :[];
  Quantities? :[]
}



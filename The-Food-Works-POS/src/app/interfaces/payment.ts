export interface IPaymentDialog {
  paymentType: string;
​  paymentInstruction: string;
  amount: number;
}

export interface IPaymentData {
  saleID: number;
  paymentType: string;
  amount: number;
}

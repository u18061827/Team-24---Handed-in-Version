export interface IOrderFilter {
  customerID: number;
  orderDate: number;
}

export interface IOrders {
  orderID: number;
  orderStatus: string;
  icon: string;
  color: string;
  orderLines: any;
}

export interface IOrder {
  orderID: number;
  orderSatus: number;
  completionMethod: string;
  paymentMethod: string;
  orderLines: any;
}

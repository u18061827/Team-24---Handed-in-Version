import { Content } from "./product";

export interface SupplierOrder {
  SupplierOrderId : number;
  SupplierId?: number;
  SupplierVatNumber? : string
  SupplierName? : string;
  SupplierOrderDate? : string;
  SupplierOrderStatusName? : string;
  SupplierOrderStatusId? : number;
  //supplierOrderLines? : SupplierOrderLine[];
  ProductNames? :[];
  Quantities? :[]
  orderLines? : orderLine[];//or LIST?
  ProductId? : number;
  Quantity? : number
}

export interface SupplierOrderLine {
  SupplierOrderId : number;
  SupplierOrderLineQuantity?: number;
  ProductId? : number;
  ProductName? : string;
}


export interface orderLine {
  ProductId? : number;
  SupplierOrderLineQuantity?: number;
}

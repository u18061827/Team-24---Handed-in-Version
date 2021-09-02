
export interface Sale
{
    SaleTotal?: number,
    CustomerId?: number,
    SaleStatusId?: number,
    SaleTypeId?: number,
    CompletionMethodId?: number,
    EmployeeId?: number,
    BranchId?: number,
    SaleLines: any,
    EmailAddress?: string,
    PaymentType: string,


}

export interface ProductSale{
    ProductBarcode?: string,
}

export interface SaleLine {
    quantity: number;
    productName?: string;
    productPriceAmount: number;
    productBarcode: string;
    ProductId: number,

  }


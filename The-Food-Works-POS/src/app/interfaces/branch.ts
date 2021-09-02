export interface Branch {
  BranchId: number;
  BranchName: string;
  BranchContactNumber: string;
  BranchEmailAddress: string;
  BranchImage: ImageBitmap;
  BranchStatus: boolean;
  BranchDateCreated: Date;
}

export interface BranchForm {
  BranchId: number;
  BranchName: string;
  BranchContactNumber: string;
  BranchEmailAddress: string;
  BranchImage: string;
  BranchStatus: boolean;
  BranchAddressFull: string;
  BranchStreetAddress: string;
  BranchSuburb: string;
  BranchCity: string;
  BranchProvince: string;
  BranchCountry: string;
  BranchZip: string;
  BranchLate: number;
  BranchLng: number;
}

export interface BranchProduct {
  BranchId: number;
  ProductId: number;
  ProductTypeName: string;
  ProductName: string;
  QuantityOnHand: number;
  BaselineQuantity: number;
  EnteredQuantity: any;
  CanDelete: boolean;
  Confirmed: boolean;
  RequestedQuantity: number;
}

export interface BranchRequest {
  BranchRequestId: number;
  BranchRequestDate: Date;
  RequestStatusId: string;
  BranchId: number;
}

export interface BranchUpdate {
  BranchId: number;
  BranchName: string;
  BranchContactNumber: string;
  BranchEmailAddress: string;
  BranchImage: ImageBitmap;
  BranchStatus: boolean;
  BranchDateCreated: Date;
  BranchAddressFull: string;
  BranchStreetAddress: string;
  BranchSuburb: string;
  BranchCity: string;
  BranchProvince: string;
  BranchCountry: string;
  BranchZip: string;
  BranchLate: number;
  BranchLng: number;
}

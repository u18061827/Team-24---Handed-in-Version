/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
  Token?: string;
  EmailAddress: string;
  Password: string;
  Name?: string;
}

export interface ICustomer {
  CustomerID?: number;
  CustomerName: string;
  CustomerSurname: string;
  CustomerDob: Date;
  CustomerTelephone: string;
  CustomerEmail?: string;
  IsLoyaltyProgram: boolean;
  StreetNumber: string;
  StreetName: string;
  City: string;
  PostalCode: string;
  Province: string;
  Lat: number;
  Lng: number;
  Password?: string;
}

export interface IResetPassword {
  CurrentPassword: string;
  email: string;
  NewPassword: string;
  ConfirmPassword: string;
}

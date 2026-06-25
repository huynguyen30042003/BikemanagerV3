export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  gender: string;
  birthday: string;
  address: string;
  totalSpent: number;
  createdAt: string;
  totalOrders: number
  lastPurchaseAt: string
  customerLevel: string
}

export interface CustomerReq {
  FullName: string,
  PhoneNumber: string,
  Email: string,
  Gender: string,
  Birthday: string,
  Address: string
}


export interface CustomerVehicleParams {
  CustomerId?: string,
  Search?: string,
  Page?: number,
  PageSize?: number,
}

export interface CustomerVehicleRes{
  id?: string,
  CustomerId?: string,
  brandId?: string
  modelName: string
  plateNumber:string
  frameNumber:string
  engineNumber:string
  batterySerial:string
  purchaseDate:string
}
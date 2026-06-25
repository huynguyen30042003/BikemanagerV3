export interface brandReq {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface brandRes {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  country: string;
  isActive: boolean;
  createdAt: string;
}

export interface createBrandRequest {
  name: string;
  slug: string;
  logoUrl: File;
  country: string;
  isActive: boolean;
}

export interface updateBrandRequest {
  id: string;
  name: string;
  slug: string;
  logoUrl?: File;
  country: string;
  isActive: boolean;
}

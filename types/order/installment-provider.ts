export interface InstallmentProviderQuery {
  Search?: string;
  IsActive: boolean;
  Page: number;
  PageSize: number;
}

export interface CreateInstallmentProviderRequest {
  Name: string;
  Phone: string;
  ApiEndpoint?: string;
  IsActive: boolean;
}

export interface InstallmentProviderResponse {
  id: string;
  name: string;
  phone: string;
  apiEndpoint?: string;
  isActive: boolean;
}

export interface UpdateInstallmentProviderRequest extends CreateInstallmentProviderRequest {
  id: string;
}

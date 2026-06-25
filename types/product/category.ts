export interface CategoryParentDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryDto {
  id: string;
  children?: CategoryDto[];
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  parentId?: string | null;
  name: string;
  slug: string;
  imageUrl?: string | null;
  description?: string | null;
  isActive?: boolean;
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {
  id: string;
}
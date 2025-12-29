export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadedFileResponse {
  id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  filename: string;
  originalName?: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resourceType: string;
  folder?: string;
  createdAt: Date;
}
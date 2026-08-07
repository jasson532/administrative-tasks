export interface SelectOption {
  value: string;
  label: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface FilterParams {
  search?: string;
  [key: string]: string | undefined;
}

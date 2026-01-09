
export interface Student {
  number: string;
  name: string;
  password?: string;
  totalPageCount?: number;
}

export interface BookEntry {
  no: number;
  date: string;
  title: string;
  publisher: string;
  impression: string;
  pages: number;
  cumulativePages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

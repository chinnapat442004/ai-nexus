export interface FaqResponse {
  id: number;
  question: string;
  answer: string;
}

export interface FaqPaginationResponse {
  data: FaqResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

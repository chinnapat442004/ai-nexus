import type { FaqPaginationResponse, FaqResponse } from '@/types/faq';
import { api } from './api.service';

async function getFaqs(
  page: number,
  pageSize: number,
  search?: string,
): Promise<FaqPaginationResponse> {
  const response = await api.get<FaqPaginationResponse>('/faq', {
    params: {
      page,
      page_size: pageSize,
      search,
    },
  });

  return response.data;
}

async function getFaqByIdService(id: number) {
  const response = await api.get<FaqResponse>(`/faq/${id}`);
  return response.data;
}

async function createFaqService(payload: { question: string; answer: string }) {
  return await api.post<FaqResponse>('/faq', payload);
}

async function updateFaqService(
  id: number,
  payload: { question: string; answer: string },
): Promise<FaqResponse> {
  const response = await api.patch<FaqResponse>(`/faq/${id}`, payload);
  return response.data;
}

async function deleteFaqService(id: number): Promise<void> {
  await api.delete(`/faq/${id}`);
}

export {
  getFaqs,
  createFaqService,
  updateFaqService,
  deleteFaqService,
  getFaqByIdService,
};

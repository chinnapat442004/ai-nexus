import {
  getFaqs,
  createFaqService,
  getFaqByIdService,
  updateFaqService,
  deleteFaqService,
} from '@/services/faq.service';
import type { FaqPaginationResponse } from '@/types/faq';
import { useState } from 'react';

function useFaq() {
  const [loading, setLoading] = useState(false);
  const [dataFaqs, setDataFaqs] = useState<FaqPaginationResponse | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
  });

  const fetchFaqs = async (page: number, search: string) => {
    setLoading(true);

    try {
      const response = await getFaqs(page, 10, search);
      setDataFaqs(response);
    } finally {
      setLoading(false);
    }
  };

  const getFaqById = async (id: number) => {
    return await getFaqByIdService(id);
  };

  const createFaq = async () => {
    await createFaqService(faqForm);
  };

  const updateFaq = async (id: number) => {
    await updateFaqService(id, faqForm);
  };

  const deleteFaq = async (id: number) => {
    await deleteFaqService(id);
  };
  return {
    loading,
    dataFaqs,
    page,
    search,
    faqForm,

    setPage,
    setSearch,
    setFaqForm,
    fetchFaqs,
    createFaq,
    getFaqById,
    updateFaq,
    deleteFaq,
  };
}
export { useFaq };

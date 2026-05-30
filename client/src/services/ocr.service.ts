import { api } from './api.service';
import type { OCRResponse } from '@/types/ocr';

async function scanThaiIdCard(file: File): Promise<OCRResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<OCRResponse>('/ocr', formData);
  return response.data;
}

export { scanThaiIdCard };

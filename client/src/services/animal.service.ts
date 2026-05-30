import { api } from './api.service';
import type { AnimalResponse } from '@/types/animal';

async function scanAnimal(file: File): Promise<AnimalResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<AnimalResponse>('/animal', formData);
  return response.data;
}

export { scanAnimal };

import { useState } from 'react';
import { scanAnimal } from '@/services/animal.service';
import type { AnimalResponse } from '@/types/animal';

function useAnimal() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnimalResponse | null>(null);

  const scan = async (file: File) => {
    setLoading(true);
    try {
      const data = await scanAnimal(file);

      setResult(data);
      return data;
    } catch {
      //   throw new Error('ไม่พบบัตรประชาชนในภาพ หรือภาพไม่ชัดเจน');
    } finally {
      setLoading(false);
    }
  };

  const clearAnimal = () => {
    setResult(null);
    setLoading(false);
  };

  return {
    loading,
    result,
    scan,
    clearAnimal,
  };
}

export { useAnimal };

import { useState } from 'react';
import { scanAnimal, getAnimals } from '@/services/animal.service';
import { type AnimalNameResponse, type AnimalResponse } from '@/types/animal';

function useAnimal() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnimalResponse | null>(null);
  const [animals, setAnimals] = useState<AnimalNameResponse>();

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

  const fetchAnimals = async () => {
    const response = await getAnimals();
    console.log(response);
    setAnimals(response);
  };

  const clearAnimal = () => {
    setResult(null);
    setLoading(false);
  };

  return {
    loading,
    result,
    animals,
    scan,
    fetchAnimals,
    clearAnimal,
  };
}

export { useAnimal };

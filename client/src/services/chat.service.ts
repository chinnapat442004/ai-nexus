import type { ChatRequest, Message } from '@/types/chat';
import { api } from './api.service';

async function getMessages(): Promise<Message[]> {
  const response = await api.get<Message[]>(
    '/chat',
    // อนุญาตให้ Browser ส่ง Cookie ไปยัง Backend
    { withCredentials: true },
  );
  return response.data;
}

async function sendMessage(params: ChatRequest) {
  const response = await api.post(
    '/chat',
    params,
    // อนุญาตให้ Browser ส่ง Cookie ไปยัง Backend
    { withCredentials: true },
  );
  return response.data;
}
export { getMessages, sendMessage };

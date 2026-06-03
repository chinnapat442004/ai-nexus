import type { ChatRequest, Message } from '@/types/chat';
import { api } from './api.service';

async function getMessages(): Promise<Message[]> {
  const response = await api.get<Message[]>('/chat');
  return response.data;
}

async function sendMessage(params: ChatRequest) {
  const response = await api.post('/chat', params);
  return response.data;
}
export { getMessages, sendMessage };

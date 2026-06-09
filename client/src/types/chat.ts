export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

export interface ChatRequest {
  question: string;
}

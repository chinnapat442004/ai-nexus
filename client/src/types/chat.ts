export interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface ChatRequest {
  question: string;
}

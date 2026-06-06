import { useState } from 'react';

import { sendMessage, getMessages } from '@/services/chat.service';

import type { ChatRequest, Message } from '@/types/chat';

function useChat() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRequest, setChatRequest] = useState<ChatRequest>({
    question: '',
  });
  const [messagesLoading, setMessageLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await getMessages();
      setMessages(response);
    } finally {
      setLoading(false);
    }
  };

  async function sendChatMessage(request: ChatRequest) {
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
        role: 'user',
        content: request.question,
        created_at: new Date(),
      },
    ]);
    try {
      setMessageLoading(true);
      const response = await sendMessage(request);

      setMessages((prev) => [
        ...prev,
        {
          id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
          role: 'assistant',
          content: response.answer,
          created_at: new Date(),
        },
      ]);
    } finally {
      setMessageLoading(false);
    }
  }

  function clearChatRequest() {
    setChatRequest({
      question: '',
    });
  }

  function clearMessage() {
    setMessages([]);
  }

  return {
    loading,
    messages,
    chatRequest,
    messagesLoading,
    fetchMessages,
    setChatRequest,
    sendChatMessage,
    clearChatRequest,
    clearMessage,
  };
}

export { useChat };

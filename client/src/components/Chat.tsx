import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { TypingIndicator } from './ui/typingIndicator';

export const Chat = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const {
    loading,
    messages,
    chatRequest,
    messagesLoading,
    fetchMessages,
    setChatRequest,
    sendChatMessage,
    clearChatRequest,
  } = useChat();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage(chatRequest);
    clearChatRequest();
  };

  return (
    <div className="flex h-[800px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <h2 className="font-semibold text-zinc-800">AI Assistant</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';

          const currentDate = formatDate(msg.created_at);
          const prevDate =
            index > 0 ? formatDate(messages[index - 1].created_at) : null;

          const showDivider = currentDate !== prevDate;

          return (
            <div key={msg.id}>
              {showDivider && (
                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-xs font-medium text-zinc-500">
                    {currentDate}
                  </span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
              )}

              <div
                className={`mb-4 flex ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="max-w-[80%]">
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isUser
                        ? 'rounded-tr-none bg-[#84a98c] text-white'
                        : 'rounded-tl-none bg-zinc-100 text-zinc-800'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  <p
                    className={`mt-1 text-xs text-zinc-500 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
        {messagesLoading && (
          <div className={' flex justify-start '}>
            <div className="max-w-[80%]">
              <div
                className={
                  'rounded-2xl px-4 py-2 rounded-tl-none bg-zinc-100 text-zinc-800'
                }
              >
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className=" p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            value={chatRequest.question}
            onChange={(e) =>
              setChatRequest({
                question: e.target.value,
              })
            }
            placeholder="พิมพ์ข้อความที่นี่..."
            className="h-10 flex-1 rounded-3xl border border-zinc-300 bg-gray-50 px-4 text-sm"
          />

          {chatRequest.question.length > 0 && (
            <Button
              type="submit"
              disabled={loading}
              variant="outline"
              size="icon"
              aria-label="Submit"
              className="h-10 w-10 rounded-full bg-[#84a98c] text-white hover:bg-[#84a98c] disabled:opacity-50"
            >
              <Send className="h-4 w-4 text-white pointer-events-none" />
            </Button>
          )}
        </form>
      </footer>
    </div>
  );
};

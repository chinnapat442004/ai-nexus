import { useEffect, useRef } from 'react';

import { Send } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import { TypingIndicator } from './ui/typingIndicator';
import { useAuth } from '@/hooks/use-auth';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import ReactMarkdown from 'react-markdown';
import { LogOutIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Chat = () => {
  const navigate = useNavigate();
  const {
    user,
    login,
    getUser,
    handleLogout,
    loading: authLoading,
  } = useAuth();

  useEffect(() => {
    getUser();
  }, []);

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
    clearMessage,
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

  const logout = async () => {
    await googleLogout();
    await handleLogout();
    await clearMessage();
    await fetchMessages();
  };

  return (
    <div className="flex h-[800px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <header className="border-b border-zinc-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-800">AI Assistant</h2>

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <p className="max-w-[250px] truncate text-sm font-medium text-zinc-800">
                  {user.name}
                </p>
                <p className="max-w-[250px] truncate text-xs text-zinc-500">
                  {user.email}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none">
                    <img
                      src={user.picture}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 rounded-full border border-zinc-200 object-cover"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-50">
                  <div className="px-3 py-2 sm:hidden">
                    <p className="truncate text-sm font-medium text-zinc-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {user.email}
                    </p>
                  </div>

                  <div className="hidden px-3 py-2 sm:block">
                    <p className="truncate text-sm font-medium text-zinc-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-3xl text-sm leading-6 text-zinc-500">
            สอบถามข้อมูลกับ AI ได้ตามปกติ หรือจัดการข้อมูล FAQ
            เพื่อช่วยให้ระบบตอบคำถามได้แม่นยำมากขึ้น
          </p>

          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/faq')}
            className="shrink-0 gap-2 bg-sky-200 text-slate-700 font-semibold hover:bg-sky-300 hover:text-slate-800 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            จัดการ FAQ
          </Button>
        </div>
      </header>

      {user !== undefined ? (
        <main className="flex-1 overflow-y-auto p-4 ">
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
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
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
      ) : (
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-zinc-900">AI Assistant</h1>

              <p className="mt-2 text-sm text-zinc-500">
                เข้าสู่ระบบเพื่อเริ่มต้นใช้งาน AI Assistant
              </p>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (!credentialResponse.credential) return;

                  await login({
                    credential: credentialResponse.credential,
                  });

                  await fetchMessages();
                }}
                onError={() => {
                  console.log('Login Failed');
                }}
              />
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-zinc-400">
                ใช้บัญชี Google ของคุณเพื่อเข้าสู่ระบบอย่างปลอดภัย
              </p>
            </div>
          </div>
        </main>
      )}

      <footer className=" p-4">
        {user !== undefined && (
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
        )}
      </footer>

      {authLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
          <Spinner className="size-20 text-blue-500" />
        </div>
      )}
    </div>
  );
};

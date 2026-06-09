import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <main className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}

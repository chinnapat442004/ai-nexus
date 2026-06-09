import MainLayout from '@/layouts/MainLayout';
import FaqPage from '@/pages/Faq';
import Home from '@/pages/Home';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/faq" element={<FaqPage />} />
    </Routes>
  );
}

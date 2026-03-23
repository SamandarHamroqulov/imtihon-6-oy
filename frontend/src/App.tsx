import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import BooksPage from "./pages/BooksPage";
import BookDetailPage from "./pages/BookDetailPage";
import BookFormPage from "./pages/BookFormPage";
import PoetsPage from "./pages/PoetsPage";
import PoetDetailPage from "./pages/PoetDetailPage";
import PoetFormPage from "./pages/PoetFormPage";
import BookshelfPage from "./pages/BookshelfPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePoets from "./pages/admin/ManagePoets";
import ManageBooks from "./pages/admin/ManageBooks";
import ProfileAdminPage from "./pages/admin/ProfileAdminPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/books/create" element={<ProtectedRoute adminOnly><BookFormPage /></ProtectedRoute>} />
            <Route path="/books/:id/edit" element={<ProtectedRoute adminOnly><BookFormPage /></ProtectedRoute>} />

            <Route path="/poets" element={<PoetsPage />} />
            <Route path="/poets/:id" element={<PoetDetailPage />} />
            <Route path="/poets/create" element={<ProtectedRoute adminOnly><PoetFormPage /></ProtectedRoute>} />
            <Route path="/poets/:id/edit" element={<ProtectedRoute adminOnly><PoetFormPage /></ProtectedRoute>} />

            <Route path="/bookshelf" element={<ProtectedRoute><BookshelfPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/poets" element={<ProtectedRoute adminOnly><ManagePoets /></ProtectedRoute>} />
            <Route path="/admin/books" element={<ProtectedRoute adminOnly><ManageBooks /></ProtectedRoute>} />
            <Route path="/profile/:userId" element={<ProtectedRoute adminOnly><ProfileAdminPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

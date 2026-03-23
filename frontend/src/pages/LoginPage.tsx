/**
 * Login page — handles email/password login.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email: email.trim(), password });
      const payload = data.data || data;
      setAuth(payload.user, payload.accessToken);
      toast.success('Xush kelibsiz!');
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login muvaffaqiyatsiz tugadi';
      // If account not verified, redirect to OTP
      if (msg.toLowerCase().includes('verify') || msg.toLowerCase().includes('otp')) {
        toast.error(msg);
        navigate('/verify-otp', { state: { email } });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-reveal-up">
        <div className="text-center mb-8">
          <BookOpen className="mx-auto h-10 w-10 text-primary mb-3" />
          <h1 className="font-display text-2xl font-semibold">Xush kelibsiz</h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">Mutolaa hisobingizga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@misol.com" />
          </div>
          <div>
            <Label htmlFor="password">Parol</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Parolni unutdingizmi?</Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size={18} className="text-primary-foreground" /> : 'Kirish'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground font-body">
          Hisobingiz yo'qmi?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">Ro'yxatdan o'tish</Link>
        </p>
      </div>
    </div>
  );
}

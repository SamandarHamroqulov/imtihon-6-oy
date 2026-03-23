/**
 * Forgot password page — sends reset OTP to email.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Iltimos, email manzilingizni kiriting');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/forgot/password', { email: email.trim() });
      toast.success('Tiklash kodi emailingizga yuborildi');
      navigate('/reset-password', { state: { email: email.trim() } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-reveal-up">
        <div className="text-center mb-8">
          <KeyRound className="mx-auto h-10 w-10 text-primary mb-3" />
          <h1 className="font-display text-2xl font-semibold">Parolni unutdingizmi?</h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">Email manzilingizni kiriting va biz sizga tiklash kodini yuboramiz</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@misol.com" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size={18} className="text-primary-foreground" /> : 'Kodni yuborish'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline">Kirishga qaytish</Link>
        </p>
      </div>
    </div>
  );
}

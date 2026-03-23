/**
 * OTP verification page — receives email from navigation state.
 */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { ShieldCheck } from 'lucide-react';

export default function VerifyOtpPage() {
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Iltimos, tasdiqlash kodini kiriting');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/verify/otp', { email, otp: otp.trim() });
      toast.success('Email tasdiqlandi! Endi tizimga kirishingiz mumkin.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Tasdiqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend/otp', { email });
      toast.success('Kodi emailingizga qayta yuborildi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Kodni qayta yuborishda xatolik yuz berdi');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-reveal-up">
        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto h-10 w-10 text-accent mb-3" />
          <h1 className="font-display text-2xl font-semibold">Emailni tasdiqlash</h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">
            Biz <span className="font-medium text-foreground">{email || 'emailingizga'}</span> kod yubordik
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <Label htmlFor="otp">Tasdiqlash kodi</Label>
            <Input id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Kodni kiriting" className="text-center text-lg tracking-widest" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size={18} className="text-primary-foreground" /> : 'Tasdiqlash'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" onClick={handleResend} disabled={resending}>
            {resending ? 'Yuborilmoqda...' : "Kod kelmadimi? Qayta yuborish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

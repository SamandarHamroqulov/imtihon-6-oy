import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Yangi parollar mos kelmadi');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Yangi parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/password/change', { oldPassword, newPassword });
      toast.success('Parol muvaffaqiyatli o\'zgartirildi');
      navigate('/profile');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 md:py-12 max-w-sm">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1 text-muted-foreground">
        <ArrowLeft className="h-4 w-4" /> Orqaga
      </Button>
      
      <div className="text-center mb-8 animate-reveal-up">
        <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-2xl font-bold">Parolni o'zgartirish</h1>
        <p className="text-sm text-muted-foreground font-body mt-2">Xavfsizlik uchun parolingizni muntazam yangilab turing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 animate-reveal-up" style={{ animationDelay: '80ms' }}>
        <div>
          <Label htmlFor="oldPassword">Hozirgi parol</Label>
          <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="newPassword">Yangi parol</Label>
          <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Kamida 6 ta belgi" />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Yangi parolni tasdiqlash</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Qayta kiriting" />
        </div>
        <Button type="submit" className="w-full h-11" disabled={loading}>
          {loading ? <Spinner size={18} className="text-primary-foreground" /> : 'Yangilash'}
        </Button>
      </form>
    </div>
  );
}

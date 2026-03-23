/**
 * Registration page with form validation.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen } from 'lucide-react';

export default function RegisterPage() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password || !confirmPassword) {
      toast.error('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }
    if (password.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Parollar mos kelmadi');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstname', firstname.trim());
      formData.append('lastname', lastname.trim());
      formData.append('email', email.trim());
      formData.append('password', password);
      if (avatar) {
        formData.append('image', avatar);
      }

      await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Hisob yaratildi! Iltimos, emailingizni tasdiqlang.');
      navigate('/verify-otp', { state: { email: email.trim() } });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm animate-reveal-up">
        <div className="text-center mb-8">
          <BookOpen className="mx-auto h-10 w-10 text-primary mb-3" />
          <h1 className="font-display text-2xl font-semibold">Hisob yaratish</h1>
          <p className="mt-1 text-sm text-muted-foreground font-body">Mutolaaga qo'shiling va mutolaa sayohatingizni boshlang</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname">Ism</Label>
              <Input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} placeholder="Alisher" />
            </div>
            <div>
              <Label htmlFor="lastname">Familiya</Label>
              <Input id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} placeholder="Navoiy" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@misol.com" />
          </div>
          <div>
            <Label htmlFor="password">Parol</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Kamida 6 ta belgi" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Parolni tasdiqlash</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Parolni qayta kiriting" />
          </div>
          <div>
            <Label htmlFor="avatar">Profil rasmi (ixtiyoriy)</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Spinner size={18} className="text-primary-foreground" /> : 'Hisob yaratish'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground font-body">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Kirish</Link>
        </p>
      </div>
    </div>
  );
}

/**
 * User profile page — view and edit profile, change password, avatar upload.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getStaticUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner, PageLoader } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { User, Camera, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [firstname, setFirstname] = useState(user?.firstname || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.get('/profile/me')
      .then((res) => {
        const p = res.data.profile || res.data.data || res.data;
        setProfile(p);
        setFirstname(p.firstname || '');
        setLastname(p.lastname || '');
      })
      .catch(() => toast.error('Profilni yuklashda xatolik yuz berdi'))
      .finally(() => setFetching(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstname.trim() || !lastname.trim()) {
      toast.error('Ism va familiya majburiy');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstname', firstname.trim());
      formData.append('lastname', lastname.trim());
      if (avatar) formData.append('avatar', avatar);

      const { data } = await api.put('/profile/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updated = data.data || data;
      setProfile(updated);
      if (user) {
        setUser({ ...user, firstname: updated.firstname, lastname: updated.lastname, avatar: updated.avatar });
      }
      toast.success('Profil muvaffaqiyatli yangilandi');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };



  if (fetching) return <PageLoader />;

  const avatarUrl = getStaticUrl(profile?.avatar);

  return (
    <div className="container py-8 md:py-12 max-w-lg">
      <h1 className="font-display text-2xl font-bold mb-8 animate-reveal-up">Profil</h1>

      {/* Avatar & Profile Form */}
      <form onSubmit={handleUpdateProfile} className="space-y-5 animate-reveal-up" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-muted ring-2 ring-border">
              {avatarUrl ? (
                <img src={avatarUrl} alt={firstname} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-surface-warm">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="sr-only" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
          </div>
          <div>
            <p className="font-display font-semibold text-lg">{profile?.firstname} {profile?.lastname}</p>
            <p className="text-sm text-muted-foreground">{profile?.User?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 text-xs font-medium text-gold bg-gold/10 px-2 py-0.5 rounded-full">Admin</span>
            )}
          </div>
        </div>

        {avatar && <p className="text-xs text-muted-foreground">Yangi avatar tanlandi: {avatar.name}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstname">Ism</Label>
            <Input id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="lastname">Familiya</Label>
            <Input id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile?.User?.email || ''} disabled className="bg-muted" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner size={18} className="text-primary-foreground" /> : 'Saqlash'}
        </Button>
      </form>

      {/* Change Password */}
      <div className="mt-10 pt-8 border-t animate-reveal-up" style={{ animationDelay: '160ms' }}>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-display text-lg font-semibold">Parol boshqaruvi</h2>
          </div>
          <Link to="/change-password">
            <Button variant="outline" size="sm">O'zgartirish</Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground font-body">Xavfsizlik maqsadida parolingizni bu yerda o'zgartirishingiz mumkin.</p>
      </div>
    </div>
  );
}

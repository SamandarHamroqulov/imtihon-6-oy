import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getStaticUrl } from '@/lib/api';
import { PageLoader } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { User, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfileAdminPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profile/${userId}`)
      .then((res) => {
        setProfile(res.data.profile || res.data.data || res.data);
      })
      .catch((err) => {
        toast.error('Profilni yuklashda xatolik yuz berdi');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <PageLoader />;

  const avatarUrl = getStaticUrl(profile?.avatar);

  const userFullName = `${profile?.firstname} ${profile?.lastname}`;

  return (
    <div className="container py-8 md:py-12 max-w-lg">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1">
        <ArrowLeft className="h-4 w-4" /> Orqaga
      </Button>

      <div className="flex items-center gap-4 mb-8 animate-reveal-up">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-muted ring-2 ring-border">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userFullName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-surface-warm">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{userFullName}</h1>
          <p className="text-muted-foreground">{profile?.User?.email}</p>
          <div className="flex gap-2 mt-2">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${profile?.User?.role === 'admin' ? 'text-gold bg-gold/10' : 'text-primary bg-primary/10'}`}>
              {profile?.User?.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6 animate-reveal-up" style={{ animationDelay: '100ms' }}>
        <div className="p-6 rounded-xl border border-border bg-surface-warm/30">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-gold" /> Tizim ma'lumotlari
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span>{profile?.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Roli:</span>
              <span className="capitalize">{profile?.User?.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ro'yxatdan o'tgan:</span>
              <span>{new Date(profile?.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

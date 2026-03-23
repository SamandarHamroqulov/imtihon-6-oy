import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageLoader } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Save, 
  User, 
  MapPin, 
  Feather, 
  Loader2, 
  Image as ImageIcon,
  Calendar,
  History as HistoryIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function PoetFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [country, setCountry] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [genre, setGenre] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/poets/${id}`)
        .then((res) => {
          const poet = res.data.data || res.data;
          setFirstname(poet.firstname || '');
          setLastname(poet.lastname || '');
          setCountry(poet.country || '');
          setBirthDate(poet.birthDate ? poet.birthDate.split('T')[0] : '');
          setDeathDate(poet.deathDate ? poet.deathDate.split('T')[0] : '');
          setGenre(poet.genre || '');
          setBio(poet.bio || '');
        })
        .catch(() => toast.error('Shoir topilmadi'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      formData.append('country', country.trim());
      formData.append('birthDate', birthDate);
      if (deathDate) formData.append('deathDate', deathDate);
      formData.append('genre', genre.trim());
      formData.append('bio', bio.trim());
      if (image) formData.append('image', image);

      if (isEdit) {
        await api.put(`/poets/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Shoir ma\'lumotlari yangilandi');
      } else {
        await api.post('/poets/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Yangi shoir qo\'shildi');
      }
      navigate('/poets');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageLoader />;

  return (
    <div className="container pt-32 pb-24 max-w-3xl min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 gap-2 hover:bg-secondary/50 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4" /> Orqaga qaytish
        </Button>
        
        <div className="flex items-center gap-4 mb-2">
           <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="h-5 w-5" />
           </div>
           <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight">
             {isEdit ? 'Ijodkorni tahrirlash' : 'Yangi ijodkor qo\'shish'}
           </h1>
        </div>
        <p className="text-muted-foreground font-body mb-10 pb-2 border-b border-glass-border">
          Shoir yoki yozuvchi haqidagi ma'lumotlarni premium formatda to'ldiring.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="space-y-10 p-10 rounded-[2.5rem] bg-secondary/10 border border-glass-border backdrop-blur-xl shadow-2xl"
      >
        <div className="space-y-8">
          {/* Identity Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstname" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Ism *</Label>
              <Input 
                id="firstname" 
                value={firstname} 
                onChange={(e) => setFirstname(e.target.value)} 
                placeholder="Ism..." 
                className="h-14 rounded-2xl bg-background/50 border-glass-border focus:border-primary/50 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Familiya *</Label>
              <Input 
                id="lastname" 
                value={lastname} 
                onChange={(e) => setLastname(e.target.value)} 
                placeholder="Familiya..." 
                className="h-14 rounded-2xl bg-background/50 border-glass-border focus:border-primary/50 text-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="country" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Mamlakat
              </Label>
              <Input 
                id="country" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)} 
                placeholder="Misol: O'zbekiston" 
                className="h-14 rounded-2xl bg-background/50 border-glass-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <Feather className="h-3 w-3" /> Asosiy janr
              </Label>
              <Input 
                id="genre" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)} 
                placeholder="Misol: G'azal, She'riyat" 
                className="h-14 rounded-2xl bg-background/50 border-glass-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <Calendar className="h-3 w-3" /> Tug'ilgan sana
              </Label>
              <Input 
                id="birthDate" 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                className="h-14 rounded-2xl bg-background/50 border-glass-border appearance-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deathDate" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <HistoryIcon className="h-3 w-3" /> Vafot etgan sana (ixtiyoriy)
              </Label>
              <Input 
                id="deathDate" 
                type="date" 
                value={deathDate} 
                onChange={(e) => setDeathDate(e.target.value)} 
                className="h-14 rounded-2xl bg-background/50 border-glass-border appearance-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Tarjimai hol</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Ijodkor hayoti va faoliyati haqida batafsil ma'lumot..." 
              className="min-h-[200px] rounded-2xl bg-background/50 border-glass-border focus:border-primary/50 text-lg p-6 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Profil rasmi</Label>
            <div className="relative">
              <input 
                id="image" 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImage(e.target.files?.[0] || null)} 
                className="hidden"
              />
              <label 
                htmlFor="image"
                className="flex items-center justify-between h-14 px-5 rounded-2xl bg-background/50 border border-dashed border-glass-border hover:border-primary/50 cursor-pointer transition-all"
              >
                <span className="text-muted-foreground truncate">
                  {image ? image.name : 'Rasm tanlanmagan'}
                </span>
                <ImageIcon className="h-5 w-5 text-primary" />
              </label>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-16 rounded-[1.5rem] text-lg font-bold gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95" 
          disabled={loading}
        >
          {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
          {isEdit ? 'O\'zgarishlarni saqlash' : 'Ijodkorni platformaga qo\'shish'}
        </Button>
      </motion.form>
    </div>
  );
}


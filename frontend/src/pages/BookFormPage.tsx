import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import type { Poet } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLoader } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { ArrowLeft, Save, Image as ImageIcon, Book as BookIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [poetId, setPoetId] = useState('');
  const [genre, setGenre] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [poets, setPoets] = useState<Poet[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    api.get('/poets/all')
      .then((res) => setPoets(res.data.poets || res.data.data || (Array.isArray(res.data) ? res.data : [])))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      api.get(`/books/${id}`)
        .then((res) => {
          const book = res.data.book || res.data.data || res.data;
          setTitle(book.title || '');
          setDescription(book.description || '');
          setPrice(book.price ? book.price.toString() : '');
          setPoetId(book.poetId ? book.poetId.toString() : '');
          setGenre(book.genre || '');
        })
        .catch(() => toast.error('Kitob topilmadi'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !poetId) {
      toast.error('Sarlavha va shoir majburiy');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('price', price || '0');
      formData.append('poetId', poetId);
      formData.append('genre', genre.trim());
      if (cover) formData.append('cover_image', cover);

      if (isEdit) {
        await api.put(`/books/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Kitob muvaffaqiyatli yangilandi');
      } else {
        await api.post('/books/create', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Yangi kitob yaratildi');
      }
      navigate('/books');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <PageLoader />;

  return (
    <div className="container pt-32 pb-24 max-w-2xl min-h-screen">
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
              <BookIcon className="h-5 w-5" />
           </div>
           <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight">
             {isEdit ? 'Kitobni tahrirlash' : 'Yangi asar qo\'shish'}
           </h1>
        </div>
        <p className="text-muted-foreground font-body mb-10 pb-2 border-b border-glass-border">
          Asar haqidagi ma'lumotlarni premium formatda to'ldiring.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit} 
        className="space-y-8 p-8 rounded-[2.5rem] bg-secondary/10 border border-glass-border backdrop-blur-xl shadow-2xl"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Sarlavha *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Asar nomini kiriting" 
              className="h-14 rounded-2xl bg-background/50 border-glass-border focus:border-primary/50 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Tavsif</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Asar haqida qisqacha ma'lumot..." 
              className="min-h-[150px] rounded-2xl bg-background/50 border-glass-border focus:border-primary/50 text-lg p-5 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Narxi (so'm)</Label>
              <Input 
                id="price" 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Masalan: 45000" 
                className="h-14 rounded-2xl bg-background/50 border-glass-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Shoir *</Label>
              <Select value={poetId} onValueChange={setPoetId}>
                <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-glass-border">
                  <SelectValue placeholder="Muallifni tanlang" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-secondary/80 backdrop-blur-xl border-glass-border">
                  {poets.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()} className="h-12 cursor-pointer">{p.firstname} {p.lastname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
              <Label htmlFor="genre" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Janr *</Label>
              <Input 
                id="genre" 
                value={genre} 
                onChange={(e) => setGenre(e.target.value)} 
                placeholder="Masalan: She'riyat, Drama" 
                className="h-14 rounded-2xl bg-background/50 border-glass-border"
              />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Muqova rasmi</Label>
            <div className="relative">
              <input 
                id="cover" 
                type="file" 
                accept="image/*" 
                onChange={(e) => setCover(e.target.files?.[0] || null)} 
                className="hidden"
              />
              <label 
                htmlFor="cover"
                className="flex items-center justify-between h-14 px-5 rounded-2xl bg-background/50 border border-dashed border-glass-border hover:border-primary/50 cursor-pointer transition-all"
              >
                <span className="text-muted-foreground truncate">
                  {cover ? cover.name : 'Rasm tanlanmagan'}
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
          {isEdit ? 'O\'zgarishlarni saqlash' : 'Asarni platformaga qo\'shish'}
        </Button>
      </motion.form>
    </div>
  );
}

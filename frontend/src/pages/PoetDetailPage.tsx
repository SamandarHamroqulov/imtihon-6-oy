import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import type { Poet, Book } from '@/lib/types';
import { BookCard } from '@/components/BookCard';
import { PageLoader } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  MapPin, 
  Feather, 
  Calendar, 
  History,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

import { getStaticUrl } from '@/lib/api';

export default function PoetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [poet, setPoet] = useState<Poet | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/poets/${id}`)
      .then((res) => setPoet(res.data.data || res.data))
      .catch(() => toast.error('Shoir topilmadi'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/poets/${id}`);
      toast.success('Shoir muvaffaqiyatli o\'chirildi');
      navigate('/poets');
    } catch {
      toast.error('O\'chirishda xatolik yuz berdi');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!poet) return (
    <div className="container py-32 text-center">
      <h2 className="text-2xl font-display font-bold mb-4">Shoir topilmadi</h2>
      <Button onClick={() => navigate('/poets')}>Shoirlar ro'yxatiga qaytish</Button>
    </div>
  );

  const fullName = `${poet.firstname} ${poet.lastname}`;
  const imageUrl = getStaticUrl(poet.image);

  return (
    <div className="relative min-h-screen">
      {/* Background Aura */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[-5%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="container pt-32 pb-24 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-12 text-sm font-medium text-muted-foreground"
        >
          <Link to="/poets" className="hover:text-primary transition-colors">Shoirlar</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate">{fullName}</span>
        </motion.div>

        {/* Hero Profile Section */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 lg:gap-20 items-start mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative group"
          >
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-secondary/30 ring-4 ring-glass-border shadow-2xl transition-transform duration-700 group-hover:rotate-2">
              {imageUrl ? (
                <img src={imageUrl} alt={fullName} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-secondary/50 text-7xl font-display font-black text-muted-foreground/20">
                  {poet.firstname.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-3xl bg-primary flex items-center justify-center shadow-2xl border-4 border-background transform group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
              <Feather className="h-8 w-8 text-primary-foreground" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  {poet.genre} mutaxassisi
                </span>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MapPin className="h-3.5 w-3.5" /> {poet.country}
                </span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                {fullName}
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col px-6 py-3 rounded-2xl bg-secondary/30 border border-glass-border">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Tug'ilgan</span>
                  <span className="font-bold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {poet.birthDate ? new Date(poet.birthDate).getFullYear() : 'Noma\'lum'}
                  </span>
                </div>
                {poet.deathDate && (
                  <div className="flex flex-col px-6 py-3 rounded-2xl bg-secondary/30 border border-glass-border">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Vafot etgan</span>
                    <span className="font-bold flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      {new Date(poet.deathDate).getFullYear()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col px-6 py-3 rounded-2xl bg-primary/5 border border-primary/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60 mb-1">Asarlar soni</span>
                  <span className="font-bold flex items-center gap-2 text-primary">
                    <BookOpen className="h-4 w-4" />
                    {poet.Books?.length || 0} ta
                  </span>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="font-body text-xl leading-relaxed text-muted-foreground/90 italic border-l-4 border-primary/20 pl-8 py-2">
                {poet.bio || "Ijodkor haqida ma'lumotlar yaqin orada to'ldiriladi."}
              </p>
            </div>

            {user?.role === 'admin' && (
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => navigate(`/poets/${id}/edit`)} className="h-12 px-8 rounded-xl gap-2 border-glass-border">
                  <Pencil className="h-4 w-4" /> Tahrirlash
                </Button>
                <Button variant="outline" onClick={() => setDeleteOpen(true)} className="h-12 px-8 rounded-xl gap-2 border-destructive/20 text-destructive hover:bg-destructive/5">
                  <Trash2 className="h-4 w-4" /> O'chirish
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Collection Section */}
        {poet.Books && poet.Books.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="flex items-end justify-between border-b border-glass-border pb-8">
              <div className="space-y-2">
                <h2 className="font-display text-4xl font-bold tracking-tight">Tanlangan asarlar</h2>
                <p className="text-muted-foreground font-body italic">{fullName} qalamiga mansub sara durdonalar.</p>
              </div>
              <div className="hidden md:block h-px flex-1 bg-glass-border mx-10 mb-4" />
              <div className="text-right">
                <span className="text-5xl font-display font-black text-primary/20">{poet.Books.length.toString().padStart(2, '0')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
              {poet.Books.map((book: Book, i: number) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <ConfirmDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        title="Ijodkorni o'chirish" 
        description={`Haqiqatan ham "${fullName}" ni o'chirmoqchimisiz? Ushbu ijodkorga tegishli barcha ma'lumotlar o'chib ketadi.`} 
        onConfirm={handleDelete} 
        loading={deleting} 
      />
    </div>
  );
}

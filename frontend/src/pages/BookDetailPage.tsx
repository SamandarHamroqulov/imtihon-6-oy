import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/lib/api';
import type { Book } from '@/lib/types';
import { PageLoader } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import CommentSection from '@/components/CommentSection';
import { 
  ArrowLeft, 
  Pencil, 
  Trash2, 
  BookmarkPlus, 
  BookmarkMinus, 
  User, 
  Tag, 
  Calendar,
  ChevronRight,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getStaticUrl } from '@/lib/api';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [inBookshelf, setInBookshelf] = useState(false);
  const [toggling, setToggling] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/books/${id}`)
      .then((res) => setBook(res.data.book || res.data.data || res.data))
      .catch(() => toast.error('Kitob topilmadi'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && id) {
      api.get('/books/bookshelf/all')
        .then((res) => {
          const items = res.data.data || res.data || [];
          setInBookshelf(items.some((b: any) => b.id.toString() === id.toString()));
        })
        .catch(() => {});
    }
  }, [isAuthenticated, id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/books/${id}`);
      toast.success('Kitob muvaffaqiyatli o\'chirildi');
      navigate('/books');
    } catch {
      toast.error('O\'chirishda xatolik yuz berdi');
    } finally {
      setDeleting(false);
    }
  };

  const toggleBookshelf = async () => {
    setToggling(true);
    try {
      if (inBookshelf) {
        await api.delete('/books/bookshelf/remove', { data: { bookId: id } });
        setInBookshelf(false);
        toast.success('Javondan olib tashlandi');
      } else {
        await api.post('/books/bookshelf/add', { bookId: id });
        setInBookshelf(true);
        toast.success('Javonga qo\'shildi!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setToggling(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!book) return (
    <div className="container py-32 text-center">
      <h2 className="text-2xl font-display font-bold mb-4">Kitob topilmadi</h2>
      <Button onClick={() => navigate('/books')}>Kutubxonaga qaytish</Button>
    </div>
  );

  const coverUrl = getStaticUrl(book.cover_image);
  const poetImageUrl = getStaticUrl(book.Poet?.image);

  const poetName = book.Poet ? `${book.Poet.firstname} ${book.Poet.lastname}` : '';

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="container pt-32 pb-24 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-10 text-sm font-medium text-muted-foreground"
        >
          <Link to="/books" className="hover:text-primary transition-colors">Kutubxona</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{book.title}</span>
        </motion.div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-12 lg:gap-20">
          {/* Left Column: Cover & Actions */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden bg-secondary/30 shadow-2xl group"
            >
              {coverUrl ? (
                <img 
                  src={coverUrl} 
                  alt={book.title} 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-secondary/50 text-6xl">📖</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col gap-3"
            >
               {isAuthenticated && (
                <Button 
                  variant={inBookshelf ? 'secondary' : 'default'} 
                  onClick={toggleBookshelf} 
                  disabled={toggling} 
                  className="h-14 rounded-2xl gap-3 text-lg font-bold shadow-xl transition-all active:scale-95"
                >
                  {inBookshelf ? <BookmarkMinus className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
                  {inBookshelf ? "Javondan olish" : "Javonga qo'shish"}
                </Button>
              )}
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2 border-glass-border bg-secondary/10">
                  <Share2 className="h-4 w-4" /> Ulashish
                </Button>
                {user?.role === 'admin' && (
                  <>
                    <Button variant="outline" onClick={() => navigate(`/books/${id}/edit`)} className="h-12 w-12 rounded-xl p-0 border-glass-border">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => setDeleteOpen(true)} className="h-12 w-12 rounded-xl p-0 border-destructive/20 text-destructive hover:bg-destructive/5">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  {book.genre || book.Poet?.genre || "Adabiyot"}
                </span>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-secondary-foreground/60 text-sm font-mono tracking-tighter">ID: #{book.id.toString().padStart(4, '0')}</span>
              </div>
              
              <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
                {book.title}
              </h1>

              {poetName && (
                <div 
                  className="inline-flex items-center gap-4 p-2 pr-6 rounded-full bg-secondary/30 border border-glass-border hover:bg-secondary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/poets/${book.poetId}`)}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {poetImageUrl ? (
                        <img src={poetImageUrl} alt={poetName} className="h-full w-full object-cover" />
                    ) : <User className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Muallif</p>
                    <p className="font-display text-lg font-bold group-hover:text-primary transition-colors">{poetName}</p>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-glass-border"
            >
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Tag className="h-3 w-3" /> Narxi
                </p>
                <p className="text-2xl font-black text-gold">
                  {book.price ? `${book.price.toLocaleString()} so'm` : 'Bepul'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3 w-3" /> Nashr
                </p>
                <p className="text-xl font-bold">Zamonamiz durdonasi</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <h3 className="font-display text-2xl font-bold">Asar haqida</h3>
              <div className="prose prose-invert max-w-none">
                <p className="font-body text-xl leading-relaxed text-muted-foreground/90 first-letter:text-5xl first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:text-primary">
                  {book.description || "Ushbu asar uchun hali tavsif qo'shilmagan."}
                </p>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <CommentSection bookId={book.id} />
            </motion.div>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        title="Kitobni o'chirish" 
        description={`Haqiqatan ham "${book.title}" kitobini o'chirmoqchimisiz? Ushbu amalni qaytarib bo'lmaydi.`} 
        onConfirm={handleDelete} 
        loading={deleting} 
      />
    </div>
  );
}

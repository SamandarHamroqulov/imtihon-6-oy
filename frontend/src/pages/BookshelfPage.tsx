import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { BookCard } from '@/components/BookCard';
import { BookSkeleton } from '@/components/Skeletons';
import { toast } from 'sonner';
import { Library, BookOpen, ArrowRight } from 'lucide-react';
import type { Book } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BookshelfPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/books/bookshelf/all')
      .then((res) => {
        const items = res.data.data || res.data || [];
        setBooks(Array.isArray(items) ? items : []);
      })
      .catch(() => toast.error('Javonni yuklashda xatolik yuz berdi'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container pt-32 pb-24 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 mb-16"
      >
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Library className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl font-black tracking-tight">Mening javonim</h1>
            <p className="text-muted-foreground font-body italic mt-1">
              {!loading ? `${books.length} ta durdona asar sizni kutmoqda` : 'Javon ko\'zdan kechirilmoqda...'}
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
          {[...Array(5)].map((_, i) => <BookSkeleton key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="h-24 w-24 rounded-full bg-secondary/30 flex items-center justify-center mb-6 relative">
            <Library className="h-10 w-10 text-muted-foreground/20" />
            <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-primary animate-ping" />
          </div>
          <h2 className="font-display text-3xl font-bold mb-3">Sizning javoningiz bo'sh</h2>
          <p className="text-muted-foreground font-body text-lg mb-10 max-w-md">
            Hali hech qanday kitob saqlamabsiz. Kutubxonamizdan o'zingizga ma'qul asarlarni tanlang.
          </p>
          <Button onClick={() => navigate('/books')} className="h-14 px-10 rounded-2xl gap-2 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
            Kutubxonaga o'tish <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10"
        >
          {books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

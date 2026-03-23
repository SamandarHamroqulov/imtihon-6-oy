import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import type { Book } from '@/lib/types';
import { BookCard } from '@/components/BookCard';
import { BookSkeleton } from '@/components/Skeletons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/authStore';
import { Search, Plus, FilterX, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import { motion } from 'framer-motion';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const { user } = useAuthStore();
  const [allGenres, setAllGenres] = useState<string[]>([]);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedGenre !== 'all') params.append('genre', selectedGenre);
        if (debouncedSearch) params.append('search', debouncedSearch);

        const res = await api.get(`/books/all?${params.toString()}`);
        const booksArray = res.data.data || (Array.isArray(res.data) ? res.data : []);
        const safeBooks = Array.isArray(booksArray) ? booksArray : [];
        setBooks(safeBooks);

        if (allGenres.length === 0 && safeBooks.length > 0 && selectedGenre === 'all' && !debouncedSearch) {
          const genreSet = new Set<string>();
          safeBooks.forEach(book => {
            if (book.genre) genreSet.add(book.genre);
            else if (book.Poet?.genre) genreSet.add(book.Poet.genre);
          });
          setAllGenres(Array.from(genreSet).sort());
        }
      } catch (err) {
        toast.error('Kitoblarni yuklashda xatolik yuz berdi');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [debouncedSearch, selectedGenre]);

  const resetFilters = () => {
    setSearch('');
    setSelectedGenre('all');
  };

  return (
    <div className="container pt-32 pb-24 min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-10 mb-16"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Kutubxona</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight text-foreground">
              Kitoblar Olami
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-body italic decoration-primary/20 underline-offset-8 decoration-dashed">
               {!loading ? `${books.length} ta durdona asarlar jamlangan` : 'Asarlar yuklanmoqda...'}
            </p>
          </div>
          
          {user?.role === 'admin' && (
            <Link to="/books/create">
              <Button className="h-14 px-8 rounded-2xl gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 active:scale-95">
                <Plus className="h-5 w-5" />
                Yangi kitob qo'shish
              </Button>
            </Link>
          )}
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 p-2 rounded-[2rem] bg-secondary/20 border border-glass-border backdrop-blur-md shadow-inner">
          <div className="flex-1 min-w-[300px] relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Sarlavha yoki shoir nomi..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-14 h-14 bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="h-10 w-px bg-glass-border hidden md:block" />

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="h-14 w-[200px] bg-transparent border-none focus:ring-0 text-base font-medium">
              <SelectValue placeholder="Barcha janrlar" />
            </SelectTrigger>
            <SelectContent className="bg-glass-bg backdrop-blur-xl border-glass-border">
              <SelectItem value="all" className="cursor-pointer">Barcha janrlar</SelectItem>
              {allGenres.map(genre => (
                <SelectItem key={genre} value={genre} className="cursor-pointer">{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || selectedGenre !== 'all') && (
            <Button 
              variant="secondary" 
              onClick={resetFilters}
              className="h-14 w-14 rounded-full bg-glass-bg hover:bg-destructive/10 hover:text-destructive p-0 transition-all border border-glass-border"
              title="Filtrni tozalash"
            >
              <FilterX className="h-5 w-5" />
            </Button>
          )}
        </div>
      </motion.div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
        {loading ? (
          [...Array(10)].map((_, i) => <BookSkeleton key={i} />)
        ) : books.length > 0 ? (
          books.map((book, i) => (
            <BookCard key={book.id} book={book} index={i} />
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="h-24 w-24 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-muted-foreground/20" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">Kitoblar topilmadi</h2>
            <p className="text-muted-foreground font-body text-lg mb-10 max-w-md">
              Qidiruv shartlariga mos keluvchi kitoblar mavjud emas. Filtrlarni tozalab ko'ring.
            </p>
            <Button onClick={resetFilters} variant="outline" className="h-12 px-10 rounded-full border-primary/30 text-primary hover:bg-primary/5">
              Barcha asarlar
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}


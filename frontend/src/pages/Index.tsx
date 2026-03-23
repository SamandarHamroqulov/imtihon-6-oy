import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, Star, Quote, Library } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { BookCard } from '@/components/BookCard';
import { PoetCard } from '@/components/PoetCard';
import { BookSkeleton, PoetSkeleton } from '@/components/Skeletons';
import type { Book, Poet } from '@/lib/types';
import api from '@/lib/api';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const [counts, setCounts] = useState({ poets: 0, books: 0 });
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [featuredPoets, setFeaturedPoets] = useState<Poet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      setLoading(true);
      try {
        const [poetsRes, booksRes] = await Promise.all([
          api.get('/poets/all'),
          api.get('/books/all')
        ]);
        
        const poetsData = poetsRes.data.poets || poetsRes.data.data || [];
        const booksData = Array.isArray(booksRes.data) ? booksRes.data : (booksRes.data.data || []);
        
        setCounts({ poets: poetsData.length, books: booksData.length });
        
        // Featured = first 4 (placeholder logic, could be based on rating/views)
        setFeaturedBooks(booksData.slice(0, 4));
        // New = last 4 (assuming sorted by ID or date)
        setNewBooks([...booksData].reverse().slice(0, 5));
        // Featured Poets = first 4
        setFeaturedPoets(poetsData.slice(0, 4));
      } catch (error) {
        console.error('Data fetch failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-8"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-glass-border backdrop-blur-md">
              <Star className="h-4 w-4 text-gold fill-gold" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-muted-foreground">Eng sara asarlar maskani</span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="font-display text-5xl md:text-8xl font-black tracking-tight leading-[0.95] max-w-4xl"
            >
              So'zning sehri, <br />
              <span className="italic text-primary relative">
                qalbning taskini
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-gold/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="font-body text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              Hozirda platformada <span className="text-foreground font-bold">{counts.poets} ta</span> shoir va <span className="text-foreground font-bold">{counts.books} ta</span> durdona asarlar jamlangan. 
              Siz ham o'z javoningizni yarating.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 justify-center pt-4">
              <Link to="/books">
                <Button size="lg" className="h-14 px-10 rounded-full text-lg font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                  Mutolaani boshlash
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button variant="outline" size="lg" className="h-14 px-10 rounded-full text-lg font-bold backdrop-blur-md hover:bg-secondary/50 transition-all active:scale-95 border-glass-border">
                    Hisob yaratish
                  </Button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="flex items-end justify-between mb-12 animate-reveal-up">
            <div>
              <h2 className="font-display text-4xl font-black tracking-tight mb-4">Saralangan asarlar</h2>
              <p className="text-muted-foreground text-lg max-w-lg">Siz uchun maxsus tanlab olingan eng sara durdona asarlar to'plami.</p>
            </div>
            <Link to="/books" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline group">
              Barchasini ko'rish <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {!isAuthenticated ? (
            <div className="p-12 rounded-[3.5rem] bg-secondary/10 border border-glass-border backdrop-blur-xl text-center">
              <Library className="h-12 w-12 text-muted-foreground/30 mx-auto mb-6" />
              <h3 className="font-display text-2xl font-bold mb-4">Asarlarni ko'rish uchun kiring</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Saralangan asarlar va shoirlar ijodini kuzatish uchun tizimga kirishingiz lozim.</p>
              <Link to="/login">
                <Button className="rounded-full px-8">Kirish</Button>
              </Link>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => <BookSkeleton key={i} />)}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-8"
            >
              {featuredBooks.map((book, i) => (
                <motion.div key={book.id} variants={itemVariants}>
                  <BookCard book={book} index={i} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* New Books Section */}
      <section className="py-24 relative bg-secondary/10 border-y border-glass-border">
        <div className="container relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">Yangi</div>
              <h2 className="font-display text-4xl font-black tracking-tight mb-4">Yangi nashrlar</h2>
              <p className="text-muted-foreground text-lg max-w-lg">Kutubxonamizga yaqinda qo'shilgan yangi ijod namunalari.</p>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 opacity-40 grayscale pointer-events-none">
              {[...Array(5)].map((_, i) => <BookSkeleton key={i} />)}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {[...Array(5)].map((_, i) => <BookSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
              {newBooks.map((book, i) => (
                <BookCard key={book.id} book={book} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Authors Section */}
      <section className="py-24 relative">
        <div className="container relative z-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-4xl font-black tracking-tight mb-4">Mashhur ijodkorlar</h2>
              <p className="text-muted-foreground text-lg max-w-lg">O'z asarlari bilan qalbimizdan chuqur joy olgan aziz shoir va yozuvchilar.</p>
            </div>
            <Link to="/poets" className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline group">
              Barchasini ko'rish <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {!isAuthenticated ? (
             <div className="grid md:grid-cols-2 gap-6 opacity-40 grayscale pointer-events-none">
              {[...Array(4)].map((_, i) => <PoetSkeleton key={i} />)}
            </div>
          ) : loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <PoetSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-x-10 gap-y-8">
              {featuredPoets.map((poet, i) => (
                <PoetCard key={poet.id} poet={poet} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats / Final Features */}
      <section className="bg-secondary/20 border-t border-glass-border backdrop-blur-sm relative py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: Quote, 
                title: 'Alisher Navoiy', 
                desc: "\"Kitob — inson do'stidir, u senga hech qachon xiyonat qilmaydi va hamisha to'g'ri yo'l ko'rsatadi.\"" 
              },
              { 
                icon: BookOpen, 
                title: 'Saralangan kutubxona', 
                desc: "Ehtiyotkorlik bilan tanlangan she'riyat va adabiyot kutubxonasini o'rganing." 
              },
              { 
                icon: Library, 
                title: 'Shaxsiy javon', 
                desc: "Sizga manzur bo'lgan asarlarni saqlab qo'ying. Shaxsiy mutolaa ro'yxatingiz doim intizor." 
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="relative p-8 rounded-3xl bg-glass-bg border border-glass-border group hover:border-primary/20 transition-all duration-500"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

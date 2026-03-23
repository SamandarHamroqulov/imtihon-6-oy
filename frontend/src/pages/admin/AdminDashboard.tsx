import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Feather, Users, Book as BookIcon } from "lucide-react";
import api from "@/lib/api";
import { PageLoader } from "@/components/ui/spinner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ poets: 0, books: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poetsRes, booksRes] = await Promise.all([
          api.get("/poets/all"),
          api.get("/books/all")
        ]);
        
        const poetsArray = poetsRes.data.data || [];
        const booksArray = booksRes.data.data || [];
        
        setStats({
          poets: poetsArray.length,
          books: booksArray.length
        });
      } catch (error) {
        console.error("Statistikalarni yuklashda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 animate-reveal-up">
        <h1 className="font-display text-3xl font-bold italic text-gold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground font-body">Platforma holati va boshqaruvi</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="bg-card/50 backdrop-blur-sm border-gold/20 animate-reveal-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jami Shoirlar</CardTitle>
            <Feather className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.poets}</div>
            <p className="text-xs text-muted-foreground mt-1">Ro'yxatga olingan shoirlar</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border-gold/20 animate-reveal-up" style={{ animationDelay: '200ms' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Jami Kitoblar</CardTitle>
            <BookIcon className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.books}</div>
            <p className="text-xs text-muted-foreground mt-1">Platformadagi asarlar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 animate-reveal-up" style={{ animationDelay: '300ms' }}>
        <div className="p-6 rounded-xl border border-border bg-surface-warm/50 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-semibold mb-2">Shoirlarni Boshqarish</h3>
            <p className="text-sm text-muted-foreground mb-4">Shoirlar ma'lumotlarini tahrirlash, yangi shoir qo'shish yoki o'chirish.</p>
          </div>
          <Link to="/admin/poets">
            <Button className="w-full sm:w-auto">Boshqarish</Button>
          </Link>
        </div>

        <div className="p-6 rounded-xl border border-border bg-surface-warm/50 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-semibold mb-2">Kitoblarni Boshqarish</h3>
            <p className="text-sm text-muted-foreground mb-4">Kitoblar va asarlar ro'yxatini tahrirlash, yangilarini yuklash.</p>
          </div>
          <Link to="/admin/books">
            <Button className="w-full sm:w-auto">Boshqarish</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Poet } from "@/lib/types";
import { PoetCard } from "@/components/PoetCard";
import { PoetSkeleton } from "@/components/Skeletons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { Search, Plus, Users, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function PoetsPage() {
  const [poets, setPoets] = useState<Poet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    api.get('/poets/all')
      .then((res) => {
        const data = res.data;
        const poetsArrayRaw = data.poets || data.data || (Array.isArray(data) ? data : []);
        setPoets(Array.isArray(poetsArrayRaw) ? poetsArrayRaw : []);
      })
      .catch((err) => {
        console.error('Shoirlarni yuklashda xatolik:', err);
        toast.error('Shoirlarni yuklashda xatolik yuz berdi');
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = poets.filter((p) => {
    const fullName = `${p.firstname} ${p.lastname}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

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
              <Users className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Ijodkorlar</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight text-foreground">
              So'z Ustalarimiz
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl font-body italic">
              {!loading ? `${poets.length} nafar boqiylar va zamonaviy ijodkorlar maskani.` : 'Ijodkorlar yuklanmoqda...'}
            </p>
          </div>
          
          {user?.role === "admin" && (
            <Link to="/poets/create">
              <Button className="h-14 px-8 rounded-2xl gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-500 active:scale-95">
                <Plus className="h-5 w-5" />
                Yangi ijodkor qo'shish
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 p-2 rounded-[2rem] bg-secondary/20 border border-glass-border backdrop-blur-md shadow-inner max-w-2xl">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Ism yoki familiya orqali qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 h-14 bg-transparent border-none focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mr-2">
            <LayoutGrid className="h-5 w-5" />
          </div>
        </div>
      </motion.div>

      {/* Poets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {loading ? (
          [...Array(6)].map((_, i) => <PoetSkeleton key={i} />)
        ) : filtered.length > 0 ? (
          filtered.map((poet, i) => (
            <PoetCard
              key={poet.id}
              poet={poet}
              index={i}
            />
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="h-24 w-24 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
              <Users className="h-10 w-10 text-muted-foreground/20" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">Hech kim topilmadi</h2>
            <p className="text-muted-foreground font-body text-lg max-w-md">
              Qidiruvingizga mos ijodkor topilmadi.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}


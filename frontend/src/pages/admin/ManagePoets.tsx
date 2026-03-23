import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Poet } from "@/lib/types";
import { PageLoader } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ManagePoets() {
  const [poets, setPoets] = useState<Poet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoets = async () => {
    try {
      const res = await api.get("/poets/all");
      setPoets(res.data.data || []);
    } catch (error) {
      toast.error("Shoirlarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoets();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham ushbu shoirni o'chirib tashlamoqchimisiz?")) return;
    try {
      await api.delete(`/poets/${id}`);
      toast.success("Shoir muvaffaqiyatli o'chirildi");
      fetchPoets();
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold italic text-gold mb-2">Shoirlarni Boshqarish</h1>
          <p className="text-muted-foreground font-body">{poets.length} ta shoir mavjud</p>
        </div>
        <Link to="/poets/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Yangi Shoir
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card/30">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>F.I.SH</TableHead>
              <TableHead>Mamlakat</TableHead>
              <TableHead>Janr</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {poets.map((poet) => (
              <TableRow key={poet.id}>
                <TableCell className="font-medium">
                  {poet.firstname} {poet.lastname}
                </TableCell>
                <TableCell>{poet.country}</TableCell>
                <TableCell>{poet.genre}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/poets/${poet.id}`}>
                      <Button variant="ghost" size="icon" title="Ko'rish">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/poets/${poet.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Tahrirlash">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(Number(poet.id))} title="O'chirish" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import type { Book } from "@/lib/types";
import { PageLoader } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ManageBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books/all");
      setBooks(res.data.data || []);
    } catch (error) {
      toast.error("Kitoblarni yuklashda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham ushbu kitobni o'chirib tashlamoqchimisiz?")) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success("Kitob muvaffaqiyatli o'chirildi");
      fetchBooks();
    } catch (error) {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold italic text-gold mb-2">Kitoblarni Boshqarish</h1>
          <p className="text-muted-foreground font-body">{books.length} ta kitob mavjud</p>
        </div>
        <Link to="/books/create">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Yangi Kitob
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card/30">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sarlavha</TableHead>
              <TableHead>Shoir</TableHead>
              <TableHead>Narxi</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>
                  {book.Poet ? `${book.Poet.firstname} ${book.Poet.lastname}` : "-"}
                </TableCell>
                <TableCell>{book.price} so'm</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link to={`/books/${book.id}`}>
                      <Button variant="ghost" size="icon" title="Ko'rish">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/books/${book.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Tahrirlash">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(Number(book.id))} title="O'chirish" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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

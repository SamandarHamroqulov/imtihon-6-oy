import { useState, useEffect, FormEvent } from 'react';
import api from '@/lib/api';
import type { Comment } from '@/lib/types';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { CommentSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { uz } from 'date-fns/locale';
import { MessageSquare, Send, Star, User as UserIcon, LogIn, Trash2, Edit2, X } from 'lucide-react';

interface Props {
  bookId: number;
}

/** Star-rating selector (1-5) */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star === value ? 0 : star)}
          className="transition-transform hover:scale-110 active:scale-95 flex items-center justify-center p-1"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hover || value)
                ? 'fill-gold text-gold scale-110'
                : 'text-muted-foreground/30'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/** Average rating badge */
function RatingBadge({ rating }: { rating: number }) {
  if (!rating || rating <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-bold shadow-sm">
      <Star className="h-4 w-4 fill-gold" />
      {rating.toFixed(1)}
    </span>
  );
}

function getDisplayName(comment: any): string {
  const u = comment.User || {};
  if (u.firstname || u.firstName) return u.firstname || u.firstName;
  return 'Foydalanuvchi';
}

function getInitials(name: string): string {
  if (!name || name === 'Foydalanuvchi') return '';
  return name[0]?.toUpperCase() || '';
}

export default function CommentSection({ bookId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [isEditingSubmit, setIsEditingSubmit] = useState(false);

  const { isAuthenticated, user } = useAuthStore();
  const currentUserId = Number(user?.id);

  /* -- Safe data fetch -- */
  const fetchComments = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/comments/${bookId}`);
      const fetchedComments = res.data?.comments ?? res.data?.data ?? [];
      
      if (Array.isArray(fetchedComments)) {
        setComments(fetchedComments);
        const avg = res.data?.averageRating ?? 0;
        setAverageRating(typeof avg === 'number' ? avg : 0);
      } else {
        setComments([]);
      }
    } catch (err: any) {
      setError(true);
      toast.error('Izohlar yuklanmadi');
      setComments([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  /* -- Submit new comment (Optimistic UI) -- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const commentText = text.trim();
    if (!commentText) return;

    // 1. Prepare Payload matching backend expectations
    const payload: { commentText: string; rating?: number } = {
      commentText
    };
    if (rating > 0) payload.rating = rating;

    // 2. Set Optimistic State
    const tempId = Date.now();
    const optimisticComment: any = {
      id: tempId,
      bookId,
      userId: currentUserId || 0,
      commentText: commentText,
      rating: rating > 0 ? rating : null,
      User: {
        id: currentUserId || 0,
        firstname: user?.firstname || 'Siz'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOptimistic: true
    };

    setComments((prev) => [...prev, optimisticComment as Comment]);
    setText('');
    setRating(0);
    setSubmitting(true);

    // 3. Perform API request
    try {
      const res = await api.post(`/comments/${bookId}`, payload);
      const realComment = res.data?.comment || res.data?.data || res.data;

      setComments((prev) => {
        const updated = prev.map(c => c.id === tempId ? { ...c, ...realComment } : c);
        recalcAvg(updated);
        return updated;
      });

      toast.success("Izoh muvaffaqiyatli qo'shildi!");
    } catch (err: any) {
      setComments((prev) => prev.filter(c => c.id !== tempId));
      setText(commentText);
      setRating(payload.rating || 0);
      const msg = err.response?.data?.message || "Izoh qo‘shib bo‘lmadi";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* -- Delete Comment -- */
  const handleDelete = async (commentId: number) => {
    if (!confirm("Haqiqatdan ham ushbu izohni o'chirmoqchimisiz?")) return;
    
    // Optimistic delete
    const previousComments = [...comments];
    setComments(prev => {
        const updated = prev.filter(c => c.id !== commentId);
        recalcAvg(updated);
        return updated;
    });

    try {
        await api.delete(`/comments/${commentId}`);
        toast.success("Izoh o'chirildi");
    } catch (err: any) {
        setComments(previousComments);
        const msg = err.response?.data?.message || "Izohni o'chirib bo'lmadi";
        toast.error(msg);
    }
  };

  const startEdit = (comment: Comment) => {
      setEditingId(comment.id);
      setEditText((comment as any).commentText || comment.text || '');
      setEditRating(comment.rating || 0);
  };

  const cancelEdit = () => {
      setEditingId(null);
      setEditText('');
      setEditRating(0);
  };

  /* -- Update Comment -- */
  const handleEditSubmit = async (e: FormEvent, commentId: number) => {
      e.preventDefault();
      const updatedText = editText.trim();
      if (!updatedText || isEditingSubmit) return;

      setIsEditingSubmit(true);
      const payload: { commentText: string; rating?: number } = { commentText: updatedText };
      if (editRating > 0) payload.rating = editRating;

      try {
          const res = await api.put(`/comments/${commentId}`, payload);
          const realComment = res.data?.data || res.data;

          setComments(prev => {
              const updated = prev.map(c => c.id === commentId ? { ...c, ...realComment } : c);
              recalcAvg(updated);
              return updated;
          });
          toast.success("Izoh yangilandi");
          cancelEdit();
      } catch (err: any) {
          const msg = err.response?.data?.message || "Izohni yangilab bo'lmadi";
          toast.error(msg);
      } finally {
          setIsEditingSubmit(false);
      }
  };

  const recalcAvg = (list: Comment[]) => {
      const validRatings = list.map(c => c.rating).filter((r): r is number => typeof r === 'number' && r > 0);
      if (validRatings.length > 0) {
          setAverageRating(validRatings.reduce((a, b) => a + b, 0) / validRatings.length);
      } else {
          setAverageRating(0);
      }
  };

  /* -- Render -- */
  const safeComments = Array.isArray(comments) ? comments : [];

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="font-display text-2xl font-bold flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          Izohlar
          {!loading && !error && (
            <span className="text-base font-mono bg-secondary/30 px-3 py-1 rounded-full text-muted-foreground">
              {safeComments.length}
            </span>
          )}
        </h3>
        {averageRating > 0 && <RatingBadge rating={averageRating} />}
      </div>

      {loading && (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => <CommentSkeleton key={i} />)}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-10 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="font-semibold text-lg">Izohlar yuklanmadi</p>
          <Button variant="outline" size="sm" onClick={fetchComments} className="border-destructive/30 hover:bg-destructive hover:text-white mt-4">
            Qayta urinish
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && safeComments.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-dashed border-glass-border bg-secondary/5">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground font-medium">Hozircha izohlar yo'q</p>
        </div>
      )}

      {/* Comment list */}
      {!loading && !error && safeComments.length > 0 && (
        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {safeComments.map((comment, idx) => {
              const name = getDisplayName(comment);
              const initials = getInitials(name);
              const displayText = (comment as any).commentText || comment.text || '';
              const isOptimistic = (comment as any).isOptimistic;
              const isOwner = comment.userId === currentUserId && !isOptimistic;
              const isEditing = editingId === comment.id;

              return (
                <motion.div
                  key={comment.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: isOptimistic ? 0.6 : 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3, delay: isOptimistic ? 0 : idx * 0.05 }}
                  className={`flex gap-4 p-5 rounded-2xl border transition-all ${
                    isOptimistic 
                      ? 'bg-primary/5 border-primary/20 shadow-inner' 
                      : 'bg-secondary/10 border-glass-border'
                  }`}
                >
                  {/* Avatar */}
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shrink-0 text-base font-bold text-primary shadow-sm ring-1 ring-primary/20">
                    {initials || <UserIcon className="h-5 w-5" />}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2 py-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="font-bold text-sm tracking-tight truncate">
                        {name}
                      </span>
                      {comment.rating && comment.rating > 0 && !isEditing ? (
                        <span className="inline-flex items-center gap-1 text-gold text-xs font-bold bg-gold/10 px-2 py-0.5 rounded-sm">
                          <Star className="h-3 w-3 fill-gold" />
                          {comment.rating}
                        </span>
                      ) : null}
                      <span className="text-[11px] font-medium text-muted-foreground/50 sm:ml-auto whitespace-nowrap bg-background/50 px-2 py-1 rounded-md w-fit">
                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                          locale: uz,
                        }) : 'Hozir'}
                      </span>
                    </div>

                    {isEditing ? (
                        <form onSubmit={(e) => handleEditSubmit(e, comment.id)} className="space-y-3 pt-2">
                             <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                disabled={isEditingSubmit}
                                className="w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none transition-all"
                                rows={3}
                                required
                            />
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-xl border border-glass-border shadow-sm">
                                    <span className="text-xs uppercase font-medium text-muted-foreground/80">Baho</span>
                                    <StarRating value={editRating} onChange={setEditRating} />
                                </div>
                                <div className="flex items-center gap-2">
                                     <Button type="button" variant="ghost" size="sm" onClick={cancelEdit} disabled={isEditingSubmit} className="text-xs">
                                         <X className="h-3.5 w-3.5 mr-1" /> Bekor qilish
                                     </Button>
                                     <Button type="submit" size="sm" disabled={isEditingSubmit || !editText.trim()} className="text-xs ml-2">
                                         {isEditingSubmit ? "Saqlanmoqda..." : "Saqlash"}
                                     </Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line break-words">
                            {displayText}
                        </p>
                    )}

                    {isOwner && !isEditing && (
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => startEdit(comment)}
                                className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors flex items-center gap-1.5"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                                Tahrirlash
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDelete(comment.id)}
                                className="text-xs font-semibold text-destructive/70 hover:text-destructive transition-colors flex items-center gap-1.5"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                O'chirish
                            </button>
                        </div>
                    )}

                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {/* Comment form - authenticated only */}
      <div className="pt-4 border-t border-glass-border/50">
        {isAuthenticated ? (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-4 p-6 rounded-2xl border border-glass-border bg-gradient-to-b from-secondary/10 to-transparent shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MessageSquare className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold text-foreground">
                Fikringizni bildiring
              </p>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting}
              placeholder="Kitob haqida nima deb o'ylaysiz? Bu yerga yozing..."
              maxLength={1000}
              rows={3}
              className="w-full rounded-xl border border-glass-border bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background/90 resize-none transition-all disabled:opacity-50"
            />

            <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-3 bg-background/50 px-4 py-2 rounded-xl border border-glass-border tracking-wider shadow-sm">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Baho</span>
                <div className="h-4 w-px bg-glass-border" />
                <StarRating value={rating} onChange={setRating} />
              </div>

              <Button
                type="submit"
                disabled={submitting || !text.trim()}
                className="h-12 rounded-xl gap-2 px-8 font-bold shadow-lg hover:shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                {submitting ? (
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Qoldirish</span>
              </Button>
            </div>
          </motion.form>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border border-dashed border-glass-border bg-secondary/5 text-center">
            <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center mb-2">
              <LogIn className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">Fikr qoldirish uchun tizimga kiring</p>
            <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 mt-2">
              Tizimga kirish
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}


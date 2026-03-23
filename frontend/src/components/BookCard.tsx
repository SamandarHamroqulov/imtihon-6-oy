/**
 * Book card component for grid displays.
 */
import { Link } from 'react-router-dom';
import { Book } from '@/lib/types';
import { motion } from 'framer-motion';
import { BookOpen, User } from 'lucide-react';
import { getStaticUrl } from '@/lib/api';

interface BookCardProps {
  book: Book;
  index?: number;
  style?: React.CSSProperties;
}

export function BookCard({ book, index = 0, style }: BookCardProps) {
  const imageUrl = getStaticUrl(book.cover_image);

  const poetName = book.Poet ? `${book.Poet.firstname} ${book.Poet.lastname}` : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group"
      style={style}
    >
      <Link to={`/books/${book.id}`} className="block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/30 border border-glass-border shadow-xl transition-all duration-500 group-hover:shadow-primary/10 group-hover:border-primary/20">
          {/* Image */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-700 scale-[1.01] group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-secondary/50 backdrop-blur-sm">
              <BookOpen className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Price Tag */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-glass-bg backdrop-blur-md border border-glass-border text-xs font-bold text-primary shadow-lg backdrop-saturate-150">
            {book.price?.toLocaleString()} so'm
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 px-1">
          <h3 className="font-display text-lg font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {book.title}
          </h3>
          {book.Poet && (
            <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              <User className="h-3.5 w-3.5" />
              <span className="text-sm font-body font-medium truncate italic decoration-primary/30 underline-offset-4 group-hover:underline">
                {poetName}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

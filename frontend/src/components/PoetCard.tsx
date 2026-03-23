/**
 * Poet card component for grid displays.
 */
import { Link } from 'react-router-dom';
import { Poet } from '@/lib/types';
import { motion } from 'framer-motion';
import { Feather, MapPin } from 'lucide-react';
import { getStaticUrl } from '@/lib/api';

interface PoetCardProps {
  poet: Poet;
  index?: number;
  style?: React.CSSProperties;
}

export function PoetCard({ poet, index = 0, style }: PoetCardProps) {
  const fullName = `${poet.firstname} ${poet.lastname}`;
  const imageUrl = getStaticUrl(poet.image);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      className="group"
      style={style}
    >
      <Link to={`/poets/${poet.id}`} className="block">
        <div className="relative flex items-center gap-5 p-4 rounded-3xl bg-secondary/20 border border-glass-border backdrop-blur-sm transition-all duration-500 group-hover:bg-primary/5 group-hover:border-primary/20 group-hover:shadow-2xl group-hover:shadow-primary/5">
          {/* Avatar Area */}
          <div className="relative">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-secondary/50 ring-2 ring-glass-border transition-all duration-500 group-hover:ring-primary group-hover:rotate-3 shadow-lg">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={fullName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-secondary/50 text-2xl font-display font-bold text-muted-foreground/30">
                  {poet.firstname.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shadow-lg border-2 border-background transform group-hover:rotate-12 transition-transform duration-500">
              <Feather className="h-3 w-3 text-primary-foreground" />
            </div>
          </div>

          {/* Info Area */}
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-lg md:text-xl font-bold leading-tight truncate group-hover:text-primary transition-colors">
              {fullName}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs md:text-sm font-body truncate">{poet.country}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-primary/70">{poet.genre}</span>
            </div>
          </div>

          {/* Decorative Arrow */}
          <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor shadow-glow">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

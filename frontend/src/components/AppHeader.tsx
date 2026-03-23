import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, User, Menu, X, Library, Feather, LogOut, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getStaticUrl } from '@/lib/api';

export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/books', label: 'Kitoblar', icon: BookOpen },
    { to: '/poets', label: 'Shoirlar', icon: Feather },
  ];

  const authLinks = isAuthenticated
    ? [{ to: '/bookshelf', label: 'Mening javonim', icon: Library }]
    : [];

  const userFullName = user ? `${user.firstname} ${user.lastname}` : 'Foydalanuvchi';
  const avatarUrl = getStaticUrl(user?.avatar);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-glass-bg border-b border-glass-border backdrop-blur-xl py-3 shadow-xl shadow-black/5" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group relative">
          <div className="relative">
            <BookOpen className="h-7 w-7 text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
            <motion.div 
              className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-foreground relative">
            Mutolaa
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-500 group-hover:w-full" />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/30 backdrop-blur-md border border-white/5">
          {[...navLinks, ...authLinks].map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to} className="relative px-4 py-2 group">
                {isActive && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary/10 rounded-full border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className={cn(
                  "relative flex items-center gap-2 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Auth section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-secondary/50 transition-all duration-300 group outline-none border border-transparent hover:border-white/10">
                  <div className="h-8 w-8 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background transition-all duration-500 group-hover:ring-primary overflow-hidden bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={userFullName} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      user?.firstname?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </div>
                  <span className="font-body text-sm font-medium max-w-[120px] truncate">{userFullName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2 p-1 bg-glass-bg backdrop-blur-xl border-glass-border shadow-2xl animate-reveal-up">
                <DropdownMenuItem className="rounded-md gap-2.5 py-2.5 cursor-pointer" onClick={() => navigate('/profile')}>
                  <User className="h-4 w-4 text-primary" /> Profil
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem className="rounded-md gap-2.5 py-2.5 cursor-pointer" onClick={() => navigate('/admin')}>
                    <Shield className="h-4 w-4 text-primary" /> Admin panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-white/5 mx-1" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-md gap-2.5 py-2.5 text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" /> Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="rounded-full px-6 hover:bg-secondary/50">Kirish</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
                  Ro'yxatdan o'tish
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-secondary/50" onClick={() => setMobileOpen(!mobileOpen)}>
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, rotate: -90 }}>
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-glass-border bg-glass-bg backdrop-blur-2xl overflow-hidden"
          >
            <nav className="container py-6 flex flex-col gap-2">
              {[...navLinks, ...authLinks].map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className={cn(
                    "w-full justify-start gap-4 h-12 rounded-xl text-base px-5 transition-all duration-300",
                    location.pathname === link.to ? "bg-primary/10 text-primary border border-primary/20" : "hover:bg-secondary/50"
                  )}>
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl text-base px-5 hover:bg-secondary/50 mt-2">
                      <User className="h-5 w-5" /> Profil
                    </Button>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl text-base px-5 hover:bg-secondary/50">
                        <Shield className="h-5 w-5" /> Admin panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-xl text-base px-5 text-destructive hover:text-destructive hover:bg-destructive/10 mt-2" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                    <LogOut className="h-5 w-5" /> Chiqish
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4 border-t border-white/5 mt-4">
                  <Link to="/login" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full h-12 rounded-xl text-base">Kirish</Button>
                  </Link>
                  <Link to="/register" className="w-full" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full h-12 rounded-xl text-base bg-primary shadow-lg shadow-primary/20">Ro'yxatdan o'tish</Button>
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


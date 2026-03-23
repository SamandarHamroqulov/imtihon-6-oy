import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Instagram, Mail } from 'lucide-react';

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-paper border-t border-glass-border pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 group">
              <BookOpen className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">Mutolaa</span>
            </Link>
            <p className="text-muted-foreground font-body leading-relaxed max-w-sm">
              Kitoblar va she'riyatning osuda maskani. Shaxsiy kitob javoningizni yarating va qalbingiz taskin istaganda unga qayting.
            </p>
            <div className="flex items-center gap-4 mt-8">
              {[
                { icon: Github, href: 'https://github.com/SamandarHamroqulov' },
                { icon: Instagram, href: 'https://www.instagram.com/1.hamroqulov/' },
                { icon: Mail, href: 's4410206@gmail.com' },
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-white/5"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Platforma</h4>
            <ul className="space-y-4">
              <li><Link to="/books" className="text-muted-foreground hover:text-primary transition-colors font-body">Kitoblar</Link></li>
              <li><Link to="/poets" className="text-muted-foreground hover:text-primary transition-colors font-body">Shoirlar</Link></li>
              <li><Link to="/genres" className="text-muted-foreground hover:text-primary transition-colors font-body">Janrlar</Link></li>
              <li><Link to="/authors" className="text-muted-foreground hover:text-primary transition-colors font-body">Mualliflar</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">Yordam</h4>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors font-body">Profil</Link></li>
              <li><Link to="/bookshelf" className="text-muted-foreground hover:text-primary transition-colors font-body">Mening javonim</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors font-body">Ko'p beriladigan savollar</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors font-body">Bog'lanish</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground font-body">
            &copy; {currentYear} Mutolaa jamoasi. Barcha huquqlar himoyalangan.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Maxfiylik siyosati</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Foydalanish shartlari</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

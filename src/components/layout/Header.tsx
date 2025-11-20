import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "L'Association", href: "/association" },
    { name: "Nos Actions", href: "/nos-actions" },
    { name: "Projets & Événements", href: "/projets" },
    { name: "Actualités", href: "/actualites" },
    { name: "Témoignages", href: "/temoignages" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" fill="currentColor" />
          <span className="text-xl font-bold text-foreground">
            Les Maillons de l'Espoir
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-6 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden items-center space-x-4 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link to="/auth">Admin</Link>
          </Button>
          <Button asChild className="gradient-sunset">
            <Link to="/soutenir">Soutenir</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Ouvrir le menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button asChild className="w-full gradient-sunset">
                <Link to="/soutenir">Soutenir</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

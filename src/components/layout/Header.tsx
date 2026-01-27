import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User } from "lucide-react";
import { useNavigation } from "@/hooks/useSiteContent";
import { useAuth } from "@/lib/auth";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: navigationItems } = useNavigation();
  const { user } = useAuth();

  // Fallback navigation while loading or if no data
  const defaultNavigation = [
    { label: "Accueil", url: "/" },
    { label: "L'Association", url: "/association" },
    { label: "Nos Actions", url: "/nos-actions" },
    { label: "Projets & Événements", url: "/projets" },
    { label: "Actualités", url: "/actualites" },
    { label: "Témoignages", url: "/temoignages" },
    { label: "Contact", url: "/contact" },
  ];

  const navigation = navigationItems && navigationItems.length > 0 
    ? navigationItems 
    : defaultNavigation;

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
              key={item.url}
              to={item.url}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden items-center space-x-4 lg:flex">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link to="/membre">
                  <User className="h-4 w-4 mr-2" />
                  Espace membre
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin">Admin</Link>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Connexion</Link>
            </Button>
          )}
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
                key={item.url}
                to={item.url}
                className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {user ? (
                <>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/membre" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Espace membre
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                  </Button>
                </>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                </Button>
              )}
              <Button asChild className="w-full gradient-sunset">
                <Link to="/soutenir" onClick={() => setMobileMenuOpen(false)}>Soutenir</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";
import { Heart, Facebook, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* À propos */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <span className="text-lg font-bold">Les Maillons de l'Espoir</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Groupe d'Entraide Mutuelle contre l'alcoolisme, l'exclusion et l'isolement à La Réunion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Navigation</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/association" className="text-muted-foreground hover:text-primary transition-colors">
                  L'Association
                </Link>
              </li>
              <li>
                <Link to="/nos-actions" className="text-muted-foreground hover:text-primary transition-colors">
                  Nos Actions
                </Link>
              </li>
              <li>
                <Link to="/projets" className="text-muted-foreground hover:text-primary transition-colors">
                  Projets & Événements
                </Link>
              </li>
              <li>
                <Link to="/temoignages" className="text-muted-foreground hover:text-primary transition-colors">
                  Témoignages
                </Link>
              </li>
            </ul>
          </div>

          {/* Aide & Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Aide & Info</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/actualites" className="text-muted-foreground hover:text-primary transition-colors">
                  Actualités
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/soutenir" className="text-muted-foreground hover:text-primary transition-colors">
                  Comment nous aider
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>18 Allée Avé Maria<br />97400 Saint-Denis</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:contact@maillonsespoir.re" className="hover:text-primary transition-colors">
                  contact@maillonsespoir.re
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0">
            <p>&copy; {new Date().getFullYear()} Les Maillons de l'Espoir. Tous droits réservés.</p>
            <div className="flex justify-center space-x-4">
              <Link to="/mentions-legales" className="hover:text-primary transition-colors">
                Mentions Légales
              </Link>
              <span>•</span>
              <Link to="/politique-confidentialite" className="hover:text-primary transition-colors">
                Politique de Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

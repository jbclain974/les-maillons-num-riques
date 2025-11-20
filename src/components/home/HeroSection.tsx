import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import heroImage from "@/assets/hero-home.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Contenu texte */}
          <div className="space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
              <Heart className="mr-2 h-4 w-4" fill="currentColor" />
              Depuis 2007 à La Réunion
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Ensemble contre{" "}
              <span className="text-primary">l'alcoolisme</span>,{" "}
              <span className="text-secondary">l'exclusion</span> et{" "}
              <span className="text-accent">l'isolement</span>
            </h1>
            
            <p className="text-lg text-muted-foreground lg:text-xl">
              Les Maillons de l'Espoir est un Groupe d'Entraide Mutuelle (GEM) qui accompagne 
              les personnes en difficulté à travers des ateliers, du sport et de l'entraide à Saint-Denis.
            </p>

            {/* Chiffres clés */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <div className="text-4xl font-bold text-primary">120</div>
                <div className="text-sm text-muted-foreground">Adhérents</div>
              </div>
              <div className="space-y-1">
                <div className="text-4xl font-bold text-secondary">80</div>
                <div className="text-sm text-muted-foreground">Abstinents</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="gradient-ocean shadow-elegant">
                <Link to="/nos-actions">
                  Découvrir nos actions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Besoin d'aide ?</Link>
              </Button>
            </div>
          </div>

          {/* Image hero */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={heroImage}
                alt="Solidarité et espoir à La Réunion"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            {/* Badge flottant */}
            <div className="absolute -bottom-6 -right-6 rounded-xl bg-accent p-6 text-white shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold">66%</div>
                <div className="text-sm">Taux d'abstinence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import ActionCard from "./ActionCard";
import { useHomepageActions } from "@/hooks/useHomepageActions";

const ActionsOverview = () => {
  const { data: actions, isLoading, error } = useHomepageActions();

  if (error) {
    console.error("Error loading actions:", error);
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Nos Actions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un accompagnement diversifié pour reconstruire sa vie à travers l'entraide, la créativité et le sport
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
            {actions?.map((action) => (
              <ActionCard
                key={action.id}
                title={action.title}
                description={action.description}
                icon={action.icon}
                colorClass={action.color_class}
                linkAnchor={action.link_anchor}
              />
            ))}
          </div>
        )}

        <div className="text-center">
          <Button size="lg" asChild variant="outline" className="group">
            <Link to="/nos-actions">
              Voir toutes nos actions
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ActionsOverview;

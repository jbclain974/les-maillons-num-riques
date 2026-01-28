import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickLinkProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  colorClass?: string;
}

const QuickLink = ({ title, description, icon, href, colorClass = "bg-primary/10" }: QuickLinkProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
      onClick={() => navigate(href)}
    >
      <CardContent className="pt-6 flex items-center gap-4">
        <div className={cn("p-3 rounded-lg", colorClass)}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </CardContent>
    </Card>
  );
};

interface QuickLinksGridProps {
  links: QuickLinkProps[];
}

export function QuickLinksGrid({ links }: QuickLinksGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link, index) => (
        <QuickLink key={index} {...link} />
      ))}
    </div>
  );
}

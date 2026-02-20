import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, CreditCard, Building2, Users, HandHeart, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dons = () => {
  const waysToHelp = [
    {
      icon: CreditCard,
      title: "Don ponctuel",
      description: "Soutenez nos actions avec un don libre",
      action: "Faire un don",
      link: "#don-ponctuel"
    },
    {
      icon: Building2,
      title: "Don par virement",
      description: "RIB disponible sur demande",
      action: "Demander le RIB",
      link: "/contact"
    },
    {
      icon: Users,
      title: "Devenir adhérent",
      description: "Rejoignez notre communauté (10€/an)",
      action: "Adhérer",
      link: "#adhesion"
    },
    {
      icon: HandHeart,
      title: "Devenir bénévole",
      description: "Partagez votre temps et vos compétences",
      action: "S'engager",
      link: "/contact"
    }
  ];

  const impacts = [
    { amount: "20€", impact: "1 atelier créatif pour 5 personnes" },
    { amount: "50€", impact: "1 sortie sportive pour le groupe" },
    { amount: "100€", impact: "1 semaine d'activités pour les adhérents" },
    { amount: "500€", impact: "Équipement sportif complet" }
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-accent/10 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-6">
            <Heart className="h-5 w-5" />
            <span className="font-medium">Soutenez notre mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Ensemble, construisons l'espoir
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chaque don compte. Aidez-nous à accompagner les personnes en difficulté 
            vers une vie meilleure.
          </p>
        </div>
      </section>

      {/* Comment aider */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment nous aider ?</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {waysToHelp.map((way, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <way.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{way.title}</h3>
                  <p className="text-muted-foreground">{way.description}</p>
                  <Button asChild className="w-full gradient-sunset">
                    <Link to={way.link}>{way.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">L'impact de votre don</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Votre générosité permet de financer nos activités et d'accompagner 
            plus de 200 adhérents chaque année.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {impacts.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-primary mb-2">{item.amount}</div>
                <p className="text-muted-foreground">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages fiscaux */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-0">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Réduction fiscale</h2>
                  <p className="text-muted-foreground mb-4">
                    En tant qu'association loi 1901, vos dons vous donnent droit à une 
                    réduction d'impôt de <strong className="text-primary">66%</strong> du montant versé.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Reçu fiscal automatique",
                      "Déductible de vos impôts",
                      "Soutien à une cause locale"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-bold mb-4 text-center">Exemple</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Don de 100€</span>
                      <span className="font-bold">-66€</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold text-primary">
                      <span>Coût réel pour vous</span>
                      <span>34€</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-accent to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à faire la différence ?</h2>
          <p className="mb-8 opacity-90">
            Chaque geste compte. Rejoignez les Maillons de l'Espoir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100">
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button size="lg" className="bg-white text-accent hover:bg-gray-100">
              <Link to="/association">En savoir plus</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dons;

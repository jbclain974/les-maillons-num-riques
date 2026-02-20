import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Bike, Music, Palette, Heart } from "lucide-react";

const ProgrammeAnnuel = () => {
  const months = [
    {
      month: "Janvier",
      events: [
        { day: "08-10", title: "Dry January - Tour de l'île vélo", icon: Bike, type: "sport" },
        { day: "25", title: "Assemblée Générale Extraordinaire", icon: Users, type: "reunion" }
      ]
    },
    {
      month: "Février",
      events: [
        { day: "22", title: "Trail des Anglais", icon: Bike, type: "sport" },
        { day: "28", title: "Atelier créatif - Mosaïque", icon: Palette, type: "atelier" }
      ]
    },
    {
      month: "Mars",
      events: [
        { day: "08", title: "Journée de la Femme", icon: Heart, type: "evenement" },
        { day: "15-16", title: "Randonnée Mafate", icon: Bike, type: "sport" },
        { day: "22", title: "Concert Partage", icon: Music, type: "culture" }
      ]
    },
    {
      month: "Avril",
      events: [
        { day: "05", title: "Atelier bien-être - Yoga", icon: Heart, type: "atelier" },
        { day: "19", title: "Sortie famille - Plage", icon: Users, type: "evenement" }
      ]
    },
    {
      month: "Mai",
      events: [
        { day: "01", title: "Fête du Travail - Pique-nique", icon: Users, type: "evenement" },
        { day: "09", title: "Assemblée Générale Annuelle", icon: Users, type: "reunion" },
        { day: "24", title: "Trail Bélouve", icon: Bike, type: "sport" }
      ]
    },
    {
      month: "Juin",
      events: [
        { day: "14", title: "Fête de la Musique", icon: Music, type: "culture" },
        { day: "21", title: "Randonnée volcans", icon: Bike, type: "sport" }
      ]
    },
    {
      month: "Juillet",
      events: [
        { day: "14", title: "20ème Anniversaire - La Source", icon: Heart, type: "evenement", highlight: true },
        { day: "27", title: "Grand Raid - Départ", icon: Bike, type: "sport" }
      ]
    },
    {
      month: "Août",
      events: [
        { day: "15", title: "Assomption - Repos", icon: Heart, type: "evenement" },
        { day: "23", title: "Atelier d'été", icon: Palette, type: "atelier" }
      ]
    },
    {
      month: "Septembre",
      events: [
        { day: "06", title: "Rentrée des ateliers", icon: Palette, type: "atelier" },
        { day: "20", title: "Forum des Associations", icon: Users, type: "evenement" }
      ]
    },
    {
      month: "Octobre",
      events: [
        { day: "04", title: "Trail de Cilaos", icon: Bike, type: "sport" },
        { day: "18", title: "Journée Portes Ouvertes", icon: Users, type: "evenement" }
      ]
    },
    {
      month: "Novembre",
      events: [
        { day: "15", title: "Préparation fêtes de fin d'année", icon: Palette, type: "atelier" },
        { day: "22", title: "Concert de Noël", icon: Music, type: "culture" }
      ]
    },
    {
      month: "Décembre",
      events: [
        { day: "13", title: "Dîner dansant sans alcool", icon: Music, type: "evenement", highlight: true },
        { day: "20", title: "Fête de fin d'année", icon: Heart, type: "evenement" }
      ]
    }
  ];

  const typeColors: Record<string, string> = {
    sport: "bg-blue-100 text-blue-700 border-blue-200",
    atelier: "bg-purple-100 text-purple-700 border-purple-200",
    evenement: "bg-green-100 text-green-700 border-green-200",
    culture: "bg-orange-100 text-orange-700 border-orange-200",
    reunion: "bg-gray-100 text-gray-700 border-gray-200"
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary">Année 2026</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Programme Annuel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez tous les événements, ateliers et activités prévus pour cette année.
          </p>
        </div>
      </section>

      {/* Légende */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { type: "sport", label: "Sport" },
              { type: "atelier", label: "Ateliers" },
              { type: "evenement", label: "Événements" },
              { type: "culture", label: "Culture" },
              { type: "reunion", label: "Réunions" }
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${typeColors[item.type].split(' ')[0]}`}></div>
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calendrier */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {months.map((monthData, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-3">
                  <h3 className="text-lg font-bold">{monthData.month}</h3>
                </div>
                <CardContent className="p-4 space-y-3">
                  {monthData.events.length > 0 ? (
                    monthData.events.map((event, i) => (
                      <div 
                        key={i} 
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          event.highlight ? 'bg-accent/10 border border-accent/30' : 'bg-muted/50'
                        }`}
                      >
                        <event.icon className={`h-5 w-5 mt-0.5 ${
                          event.highlight ? 'text-accent' : 'text-primary'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={`text-xs ${typeColors[event.type]}`}>
                              {event.day}
                            </Badge>
                          </div>
                          <p className="font-medium text-sm">{event.title}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm italic">Aucun événement prévu</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Événements phares */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Événements phares 2026</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">20ème Anniversaire</h3>
                    <p className="text-muted-foreground">14 Juillet 2026 - La Source</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Célébrez avec nous 20 ans d'engagement et de solidarité à La Réunion.
                  Une journée exceptionnelle avec animations, concerts et partage.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Bike className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Dry January - Tour de l'île</h3>
                    <p className="text-muted-foreground">8-10 Janvier 2026</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  3 jours de vélo pour célébrer le sevrage et la santé. 
                  200 km autour de l'île avec l'équipe des Maillons.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Rejoignez-nous !</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Tous ces événements sont ouverts à nos adhérents et bénévoles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/soutenir" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-white hover:bg-primary/90"
            >
              Devenir adhérent
            </a>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center rounded-lg border border-primary px-8 py-3 text-primary hover:bg-primary/5"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgrammeAnnuel;

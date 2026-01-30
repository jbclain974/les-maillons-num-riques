import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Mail, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

const Contact = () => {
  const { getContent, updateContent } = usePageContent("contact");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast.success("Message envoyé avec succès ! Nous vous recontacterons rapidement.");
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <EditablePageText
              value={getContent("hero_title", "Contactez-nous")}
              onSave={(v) => updateContent("hero_title", v)}
              as="h1"
              className="mb-6"
            />
            <EditablePageText
              value={getContent(
                "hero_subtitle",
                "Besoin d'aide, d'informations ou envie de rejoindre notre association ? N'hésitez pas à nous contacter."
              )}
              onSave={(v) => updateContent("hero_subtitle", v)}
              as="p"
              className="text-xl text-muted-foreground"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Informations de contact */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nos Coordonnées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Adresse</p>
                      <EditablePageText
                        value={getContent(
                          "adresse",
                          "18 Allée Avé Maria\n97400 Saint-Denis\nLa Réunion"
                        )}
                        onSave={(v) => updateContent("adresse", v)}
                        as="p"
                        className="text-sm text-muted-foreground whitespace-pre-line"
                        multiline
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a 
                        href="mailto:contact@maillonsespoir.re"
                        className="text-sm text-primary hover:underline"
                      >
                        contact@maillonsespoir.re
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Horaires d'ouverture</p>
                      <EditablePageText
                        value={getContent(
                          "horaires",
                          "Lundi - Vendredi\n9h00 - 17h00"
                        )}
                        onSave={(v) => updateContent("horaires", v)}
                        as="p"
                        className="text-sm text-muted-foreground whitespace-pre-line"
                        multiline
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">Besoin d'aide urgent ?</CardTitle>
                </CardHeader>
                <CardContent>
                  <EditablePageText
                    value={getContent(
                      "urgence_intro",
                      "Si vous ou un proche êtes en situation de crise, contactez :"
                    )}
                    onSave={(v) => updateContent("urgence_intro", v)}
                    as="p"
                    className="text-sm text-muted-foreground mb-4"
                  />
                  <ul className="text-sm space-y-2">
                    <li>
                      <strong>Alcooliques Anonymes :</strong><br />
                      <a href="tel:0262418282" className="text-primary hover:underline">
                        0262 41 82 82
                      </a>
                    </li>
                    <li>
                      <strong>SOS Addiction Réunion :</strong><br />
                      <a href="tel:0262907878" className="text-primary hover:underline">
                        0262 90 78 78
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Jean Dupont"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="jean@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0692..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) => setFormData({ ...formData, subject: value })}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisissez un sujet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="besoin_aide">Besoin d'aide</SelectItem>
                            <SelectItem value="info">Demande d'information</SelectItem>
                            <SelectItem value="adhesion">Adhésion</SelectItem>
                            <SelectItem value="benevolat">Bénévolat</SelectItem>
                            <SelectItem value="partenariat">Partenariat</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Décrivez votre demande..."
                        rows={8}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-ocean"
                      disabled={loading}
                    >
                      {loading ? "Envoi en cours..." : "Envoyer le message"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      * Champs obligatoires. Vos données sont protégées conformément à notre{" "}
                      <a href="/politique-confidentialite" className="text-primary hover:underline">
                        politique de confidentialité
                      </a>.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <EditablePageText
            value={getContent("map_title", "Où nous trouver")}
            onSave={(v) => updateContent("map_title", v)}
            as="h2"
            className="mb-8 text-center"
          />
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.3!2d55.4484!3d-20.8789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDUyJzQ0LjAiUyA1NcKwMjYnNTQuMiJF!5e0!3m2!1sfr!2sfr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Carte de l'association Les Maillons de l'Espoir"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

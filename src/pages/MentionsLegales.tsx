import Layout from "@/components/layout/Layout";
import { usePageContent } from "@/hooks/usePageContent";
import EditablePageText from "@/components/editable/EditablePageText";

const MentionsLegales = () => {
  const { getContent, updateContent } = usePageContent("mentions-legales");

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <EditablePageText
              value={getContent("title", "Mentions Légales")}
              onSave={(v) => updateContent("title", v)}
              as="h1"
            />
            
            <EditablePageText
              value={getContent("section1_title", "1. Informations légales")}
              onSave={(v) => updateContent("section1_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section1_content",
                "Nom de l'association : Les Maillons de l'Espoir\nForme juridique : Association loi 1901\nSiège social : 18 Allée Avé Maria, 97400 Saint-Denis, La Réunion\nEmail : contact@maillonsespoir.re"
              )}
              onSave={(v) => updateContent("section1_content", v)}
              as="p"
              className="whitespace-pre-line"
              multiline
            />

            <EditablePageText
              value={getContent("section2_title", "2. Directeur de la publication")}
              onSave={(v) => updateContent("section2_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section2_content",
                "Le directeur de la publication du site est le président de l'association Les Maillons de l'Espoir."
              )}
              onSave={(v) => updateContent("section2_content", v)}
              as="p"
              multiline
            />

            <EditablePageText
              value={getContent("section3_title", "3. Hébergement")}
              onSave={(v) => updateContent("section3_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section3_content",
                "Le site est hébergé par :\nLovable.dev\nService de développement et d'hébergement web"
              )}
              onSave={(v) => updateContent("section3_content", v)}
              as="p"
              className="whitespace-pre-line"
              multiline
            />

            <EditablePageText
              value={getContent("section4_title", "4. Propriété intellectuelle")}
              onSave={(v) => updateContent("section4_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section4_content",
                "L'ensemble du contenu de ce site (textes, images, vidéos, graphismes, logo, icônes, etc.) est la propriété exclusive de l'association Les Maillons de l'Espoir, à l'exception des éléments pour lesquels des crédits sont mentionnés.\n\nToute reproduction, distribution, modification, adaptation, retransmission ou publication de ces différents éléments est strictement interdite sans l'accord exprès par écrit de l'association Les Maillons de l'Espoir."
              )}
              onSave={(v) => updateContent("section4_content", v)}
              as="p"
              className="whitespace-pre-line"
              multiline
            />

            <EditablePageText
              value={getContent("section5_title", "5. Responsabilité")}
              onSave={(v) => updateContent("section5_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section5_content",
                "L'association Les Maillons de l'Espoir s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site.\n\nToutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site. En conséquence, l'association décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site."
              )}
              onSave={(v) => updateContent("section5_content", v)}
              as="p"
              className="whitespace-pre-line"
              multiline
            />

            <EditablePageText
              value={getContent("section6_title", "6. Liens hypertextes")}
              onSave={(v) => updateContent("section6_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section6_content",
                "Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. Les liens vers ces autres ressources vous font quitter le site. L'association Les Maillons de l'Espoir ne peut être tenue responsable du contenu de ces sites externes."
              )}
              onSave={(v) => updateContent("section6_content", v)}
              as="p"
              multiline
            />

            <EditablePageText
              value={getContent("section7_title", "7. Protection des données personnelles")}
              onSave={(v) => updateContent("section7_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section7_content",
                "Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.\n\nPour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@maillonsespoir.re\n\nPour plus d'informations sur la protection de vos données, consultez notre Politique de Confidentialité."
              )}
              onSave={(v) => updateContent("section7_content", v)}
              as="p"
              className="whitespace-pre-line"
              multiline
            />

            <EditablePageText
              value={getContent("section8_title", "8. Cookies")}
              onSave={(v) => updateContent("section8_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section8_content",
                "Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de suivi ou publicitaire n'est utilisé."
              )}
              onSave={(v) => updateContent("section8_content", v)}
              as="p"
              multiline
            />

            <EditablePageText
              value={getContent("section9_title", "9. Droit applicable et juridiction compétente")}
              onSave={(v) => updateContent("section9_title", v)}
              as="h2"
            />
            <EditablePageText
              value={getContent(
                "section9_content",
                "Les présentes mentions légales sont soumises au droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur."
              )}
              onSave={(v) => updateContent("section9_content", v)}
              as="p"
              multiline
            />

            <p className="text-sm text-muted-foreground mt-12">
              <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</em>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MentionsLegales;

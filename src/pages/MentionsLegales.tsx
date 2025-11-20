import Layout from "@/components/layout/Layout";

const MentionsLegales = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h1>Mentions Légales</h1>
            
            <h2>1. Informations légales</h2>
            <p>
              <strong>Nom de l'association :</strong> Les Maillons de l'Espoir<br />
              <strong>Forme juridique :</strong> Association loi 1901<br />
              <strong>Siège social :</strong> 18 Allée Avé Maria, 97400 Saint-Denis, La Réunion<br />
              <strong>Email :</strong> contact@maillonsespoir.re
            </p>

            <h2>2. Directeur de la publication</h2>
            <p>
              Le directeur de la publication du site est le président de l'association Les Maillons de l'Espoir.
            </p>

            <h2>3. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Lovable.dev</strong><br />
              Service de développement et d'hébergement web
            </p>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, vidéos, graphismes, logo, icônes, etc.) 
              est la propriété exclusive de l'association Les Maillons de l'Espoir, à l'exception des 
              éléments pour lesquels des crédits sont mentionnés.
            </p>
            <p>
              Toute reproduction, distribution, modification, adaptation, retransmission ou publication 
              de ces différents éléments est strictement interdite sans l'accord exprès par écrit de 
              l'association Les Maillons de l'Espoir.
            </p>

            <h2>5. Responsabilité</h2>
            <p>
              L'association Les Maillons de l'Espoir s'efforce d'assurer au mieux de ses possibilités 
              l'exactitude et la mise à jour des informations diffusées sur ce site.
            </p>
            <p>
              Toutefois, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations 
              mises à disposition sur ce site. En conséquence, l'association décline toute responsabilité 
              pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site.
            </p>

            <h2>6. Liens hypertextes</h2>
            <p>
              Le site peut contenir des liens hypertextes vers d'autres sites présents sur le réseau Internet. 
              Les liens vers ces autres ressources vous font quitter le site. L'association Les Maillons de 
              l'Espoir ne peut être tenue responsable du contenu de ces sites externes.
            </p>

            <h2>7. Protection des données personnelles</h2>
            <p>
              Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement 
              Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, 
              de suppression et d'opposition aux données personnelles vous concernant.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse : contact@maillonsespoir.re
            </p>
            <p>
              Pour plus d'informations sur la protection de vos données, consultez notre{" "}
              <a href="/politique-confidentialite" className="text-primary hover:underline">
                Politique de Confidentialité
              </a>.
            </p>

            <h2>8. Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. 
              Aucun cookie de suivi ou publicitaire n'est utilisé.
            </p>

            <h2>9. Droit applicable et juridiction compétente</h2>
            <p>
              Les présentes mentions légales sont soumises au droit français. En cas de litige et à défaut 
              d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles 
              de compétence en vigueur.
            </p>

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

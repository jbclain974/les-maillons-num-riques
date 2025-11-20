import Layout from "@/components/layout/Layout";

const PolitiqueConfidentialite = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h1>Politique de Confidentialité</h1>
            
            <p className="lead">
              Les Maillons de l'Espoir s'engage à protéger la confidentialité de vos données personnelles 
              conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique 
              et Libertés.
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données est :<br />
              <strong>Association Les Maillons de l'Espoir</strong><br />
              18 Allée Avé Maria<br />
              97400 Saint-Denis, La Réunion<br />
              Email : contact@maillonsespoir.re
            </p>

            <h2>2. Données collectées</h2>
            <p>
              Nous collectons uniquement les données personnelles que vous nous fournissez volontairement 
              lorsque vous :
            </p>
            <ul>
              <li>Remplissez notre formulaire de contact</li>
              <li>Adhérez à l'association</li>
              <li>Participez à nos événements</li>
              <li>Vous inscrivez à nos activités</li>
            </ul>

            <p>Ces données peuvent inclure :</p>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse postale (pour les adhésions)</li>
              <li>Toute autre information que vous choisissez de partager avec nous</li>
            </ul>

            <h2>3. Finalités du traitement</h2>
            <p>Vos données personnelles sont utilisées pour :</p>
            <ul>
              <li>Répondre à vos demandes d'information ou de contact</li>
              <li>Gérer votre adhésion à l'association</li>
              <li>Vous informer de nos activités et événements</li>
              <li>Organiser les ateliers et sorties</li>
              <li>Assurer le suivi de notre accompagnement</li>
              <li>Établir des statistiques anonymes</li>
            </ul>

            <h2>4. Base légale du traitement</h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul>
              <li><strong>Votre consentement</strong> : lorsque vous remplissez nos formulaires</li>
              <li><strong>L'exécution d'un contrat</strong> : pour la gestion de votre adhésion</li>
              <li><strong>Notre intérêt légitime</strong> : pour vous informer de nos activités si vous êtes adhérent</li>
            </ul>

            <h2>5. Destinataires des données</h2>
            <p>
              Vos données personnelles sont destinées exclusivement :
            </p>
            <ul>
              <li>Aux membres du bureau de l'association</li>
              <li>Aux bénévoles habilités dans le cadre de leurs missions</li>
              <li>À nos prestataires techniques (hébergement du site) dans le strict respect du RGPD</li>
            </ul>
            <p>
              Nous ne vendons, n'échangeons et ne louons jamais vos données personnelles à des tiers.
            </p>

            <h2>6. Durée de conservation</h2>
            <p>Vos données sont conservées pendant :</p>
            <ul>
              <li><strong>Messages de contact</strong> : 3 ans à compter de notre dernière interaction</li>
              <li><strong>Données d'adhésion</strong> : durée de l'adhésion + 1 an</li>
              <li><strong>Données comptables</strong> : 10 ans conformément aux obligations légales</li>
            </ul>

            <h2>7. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées 
              pour protéger vos données personnelles contre la destruction accidentelle ou illicite, 
              la perte, l'altération, la divulgation ou l'accès non autorisé.
            </p>

            <h2>8. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et y accéder</li>
              <li><strong>Droit de rectification</strong> : faire corriger vos données inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
              <li><strong>Droit à la limitation</strong> : demander la limitation du traitement de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré</li>
              <li><strong>Droit de retirer votre consentement</strong> : à tout moment</li>
            </ul>

            <p>
              Pour exercer ces droits, contactez-nous à : <strong>contact@maillonsespoir.re</strong>
            </p>
            <p>
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL 
              (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>
            </p>

            <h2>9. Cookies</h2>
            <p>
              Notre site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement 
              du site. Nous n'utilisons pas de cookies de traçage ou publicitaires.
            </p>

            <h2>10. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              La version en vigueur est celle publiée sur cette page.
            </p>

            <h2>11. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
              vous pouvez nous contacter :
            </p>
            <ul>
              <li>Par email : contact@maillonsespoir.re</li>
              <li>Par courrier : Les Maillons de l'Espoir, 18 Allée Avé Maria, 97400 Saint-Denis, La Réunion</li>
              <li>Via notre <a href="/contact" className="text-primary hover:underline">formulaire de contact</a></li>
            </ul>

            <p className="text-sm text-muted-foreground mt-12">
              <em>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</em>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PolitiqueConfidentialite;

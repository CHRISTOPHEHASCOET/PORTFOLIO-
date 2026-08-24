(() => {
  "use strict";

  /* =========================================================
     DATA

     REQ  = exigence du cahier des charges
     DEC  = décision de conception
     RISK = contrainte / risque identifié
     VAL  = élément effectivement validé
     ========================================================= */

  const PROJECTS = {

    /* =====================================================
       COOK'N WAY
       ===================================================== */

    cnw: {
      code: "CNW-01",
      name: "COOK'N WAY",

      summary: {
        type: "Plateforme multi-acteurs",
        year: "2024",
        duration: "6 mois",
        sprints: "15",
        role: "Cadrage · Conception · Pilotage",
        status: "CONCEPTION FINALISÉE",
        context: "Cahier des charges finalisé — stage",

        technologies: [
          "Laravel",
          "PHP",
          "JavaScript",
          "HTML5",
          "CSS3",
          "MySQL",
          "Stripe",
          "Google Maps",
          "AWS"
        ]
      },

      fdr: [
        {
          title: "Architecture système",
          html: `
            <p>
              Architecture fonctionnelle organisée autour de
              <strong>quatre profils utilisateurs</strong>.
            </p>

            <div class="analysis-section">
              <span class="analysis-label">PROFILS IDENTIFIÉS</span>

              <div class="analysis-tags">
                <span>Cuisinier</span>
                <span>Client</span>
                <span>Livreur</span>
                <span>Administrateur</span>
              </div>
            </div>

            <div class="analysis-section">
              <span class="analysis-label">MODULES PRINCIPAUX</span>

              <ul class="analysis-list">
                <li>Gestion des comptes</li>
                <li>Menus et catalogue</li>
                <li>Commande et paiement</li>
                <li>Suivi des livraisons en temps réel</li>
                <li>Dashboard administrateur</li>
                <li>Notifications</li>
              </ul>
            </div>

            <p class="analysis-source">
              REQ · Architecture définie dans le cahier des charges.
            </p>
          `
        },

        {
          title: "Stack technique",
          html: `
            <p>
              Environnement technique prévu dans les spécifications.
            </p>

            <dl class="analysis-tech-grid">
              <div><dt>BACKEND</dt><dd>Laravel / PHP</dd></div>
              <div><dt>FRONTEND</dt><dd>JavaScript · HTML5 · CSS3</dd></div>
              <div><dt>BDD</dt><dd>MySQL</dd></div>
              <div><dt>PAIEMENT</dt><dd>Stripe</dd></div>
              <div><dt>CARTOGRAPHIE</dt><dd>Google Maps</dd></div>
              <div><dt>INFRASTRUCTURE</dt><dd>AWS</dd></div>
            </dl>

            <p class="analysis-source">
              REQ · Stack définie dans le cahier des charges.
            </p>
          `
        },

        {
          title: "Fonctionnalités",
          html: `
            <ul class="analysis-list">
              <li>Mise en relation cuisiniers, clients et livreurs</li>
              <li>Commande de plats faits maison</li>
              <li>Gestion des commandes</li>
              <li>Gestion et suivi des livraisons en temps réel</li>
              <li>Paiement sécurisé</li>
              <li>Fonction anti-gaspillage</li>
              <li>Fonction « plat mystère »</li>
            </ul>

            <p class="analysis-source">
              REQ · Périmètre fonctionnel défini pendant le cadrage.
            </p>
          `
        },

        {
          title: "Modélisation & flux",
          html: `
            <p>
              Le travail de conception comprend la
              <strong>modélisation UML</strong> et la définition
              des flux reliant les différents profils.
            </p>

            <ul class="analysis-list">
              <li>Parcours utilisateurs structurés</li>
              <li>Relations entre profils identifiées</li>
              <li>Flux de commande définis</li>
              <li>Flux de livraison définis</li>
              <li>Architecture fonctionnelle documentée</li>
            </ul>

            <p class="analysis-source">
              VAL · Modélisation et architecture fonctionnelle réalisées.
            </p>
          `
        },

        {
          title: "Sécurité",
          html: `
            <ul class="analysis-list">
              <li>Authentification sécurisée</li>
              <li>Gestion des rôles</li>
              <li>Conformité RGPD</li>
              <li>Paiement sécurisé</li>
              <li>Journalisation des actions</li>
              <li>Tests fonctionnels</li>
            </ul>

            <p class="analysis-source">
              REQ · Protocoles prévus dans le cahier des charges.
            </p>
          `
        },

        {
          title: "Contraintes & risques",
          html: `
            <ul class="analysis-list analysis-list--warning">
              <li>Adoption de la plateforme</li>
              <li>Coordination multi-profils</li>
              <li>Suivi des commandes en temps réel</li>
              <li>Sécurisation des paiements</li>
              <li>Complexité des flux métier</li>
            </ul>

            <p class="analysis-source">
              RISK · Risques identifiés pendant le cadrage.
            </p>
          `
        },

        {
          title: "Responsive & performances",
          html: `
            <p>
              Le frontend prévu repose sur HTML5, CSS3 et JavaScript.
              Le cahier des charges transmis ne fournit cependant
              aucune métrique chiffrée de performance.
            </p>

            <p>
              Aucun score, temps de chargement ou résultat de test
              multi-écrans n'est donc présenté ici comme validé.
            </p>

            <p class="analysis-source">
              INFO · Aucune métrique de performance documentée.
            </p>
          `
        }
      ],

      cvr: [
        {
          title: "Contexte",
          html: `
            <p>
              Digitalisation d'une activité artisanale au moyen
              d'une <strong>plateforme multi-acteurs</strong>.
            </p>

            <p>
              La mission est centrée sur le cadrage,
              les flux métiers et l'expérience utilisateur.
            </p>
          `
        },

        {
          title: "Besoin utilisateur",
          html: `
            <p>
              Permettre aux cuisiniers de proposer leurs plats,
              aux clients de commander et aux livreurs de prendre
              en charge les livraisons.
            </p>

            <p>
              Le principal enjeu consiste à faire cohabiter ces
              différents parcours au sein d'un système cohérent.
            </p>
          `
        },

        {
          title: "Objectifs",
          html: `
            <ul class="analysis-list">
              <li>Digitaliser l'activité</li>
              <li>Structurer les interactions entre acteurs</li>
              <li>Organiser commande, paiement et livraison</li>
              <li>Définir les parcours utilisateurs</li>
              <li>Préparer une roadmap Agile exploitable</li>
            </ul>
          `
        },

        {
          title: "Mon rôle",
          html: `
            <p>
              Mon intervention porte principalement sur
              <strong>la conception et le pilotage</strong>.
            </p>

            <ul class="analysis-list">
              <li>Rédaction du cahier des charges</li>
              <li>Modélisation UML et des flux</li>
              <li>Conception des wireframes</li>
              <li>Pilotage d'une roadmap de 15 sprints</li>
              <li>Coordination développement et UX/UI</li>
              <li>Animation des réunions</li>
            </ul>
          `
        },

        {
          title: "Décisions & arbitrages",
          html: `
            <p>
              Le caractère multi-acteurs conduit à distinguer
              les parcours cuisinier, client, livreur
              et administrateur.
            </p>

            <p>
              Des fonctionnalités différenciantes comme
              l'anti-gaspillage et le « plat mystère »
              sont intégrées au périmètre de conception.
            </p>

            <p class="analysis-source">
              DEC · Orientations issues du cadrage produit.
            </p>
          `
        },

        {
          title: "Bilan",
          html: `
            <p>
              La mission aboutit à un
              <strong>cahier des charges complet</strong>,
              une architecture fonctionnelle, des parcours
              utilisateurs structurés et une roadmap Agile.
            </p>

            <p>
              Le projet est documenté comme livré en
              <strong>phase de conception</strong>.
            </p>
          `
        },

        {
          title: "Compétences consolidées",
          html: `
            <div class="analysis-tags">
              <span>Gestion de projet Agile</span>
              <span>Cadrage produit</span>
              <span>Modélisation UML</span>
              <span>UX</span>
              <span>Architecture applicative</span>
              <span>Coordination d'équipe</span>
            </div>
          `
        }
      ],

      timeline: [
        {
          time: "T+00",
          status: "REQ",
          title: "Briefing",
          text: "Analyse de l'activité et identification des besoins des différents acteurs."
        },
        {
          time: "T+01",
          status: "DEC",
          title: "Conception",
          text: "Modélisation UML, définition des flux et conception des wireframes."
        },
        {
          time: "T+02",
          status: "DEC",
          title: "Planification",
          text: "Construction d'une roadmap Agile organisée en 15 sprints."
        },
        {
          time: "T+03",
          status: "RISK",
          title: "Risque identifié",
          text: "La coordination multi-profils et le temps réel augmentent la complexité des flux métier."
        },
        {
          time: "T+04",
          status: "DEC",
          title: "Réponse de conception",
          text: "Séparation des parcours utilisateurs et structuration des modules fonctionnels."
        },
        {
          time: "T+05",
          status: "VAL",
          title: "Validation",
          text: "Cahier des charges, architecture, parcours et roadmap finalisés."
        }
      ]
    },


    /* =====================================================
       CAMI COURSES EXPRESS
       ===================================================== */

    cce: {
      code: "CCE-02",
      name: "CAMI COURSES EXPRESS",

      summary: {
        type: "Plateforme de gestion de livraisons",
        year: "2024",
        duration: "6 mois",
        sprints: "15",
        role: "Cadrage · Pilotage · Coordination",
        status: "CONCEPTION VALIDÉE",
        context: "Conception en stage · développement externe",

        technologies: [
          "Laravel",
          "PHP",
          "JavaScript",
          "HTML5",
          "CSS3",
          "MySQL",
          "Stripe",
          "Google Maps",
          "AWS"
        ]
      },

      fdr: [
        {
          title: "Architecture système",
          html: `
            <p>
              Architecture fonctionnelle organisée autour de
              <strong>trois profils principaux</strong>.
            </p>

            <div class="analysis-tags">
              <span>Administrateur</span>
              <span>Livreur</span>
              <span>Client</span>
            </div>

            <ul class="analysis-list">
              <li>Attribution automatique des missions</li>
              <li>Suivi des livraisons</li>
              <li>Optimisation des trajets</li>
              <li>Paiement sécurisé</li>
              <li>Dashboard et reporting</li>
            </ul>

            <p class="analysis-source">
              REQ · Architecture issue du cadrage fonctionnel.
            </p>
          `
        },

        {
          title: "Stack technique",
          html: `
            <dl class="analysis-tech-grid">
              <div><dt>BACKEND</dt><dd>Laravel / PHP</dd></div>
              <div><dt>FRONTEND</dt><dd>JavaScript · HTML5 · CSS3</dd></div>
              <div><dt>BDD</dt><dd>MySQL</dd></div>
              <div><dt>PAIEMENT</dt><dd>Stripe</dd></div>
              <div><dt>API</dt><dd>Google Maps</dd></div>
              <div><dt>INFRA</dt><dd>AWS</dd></div>
            </dl>

            <p class="analysis-source">
              REQ · Environnement prévu dans le cahier des charges.
            </p>
          `
        },

        {
          title: "Fonctionnalités",
          html: `
            <ul class="analysis-list">
              <li>Automatisation de la gestion des courses</li>
              <li>Attribution des missions aux livreurs</li>
              <li>Suivi des livraisons en temps réel</li>
              <li>Optimisation des trajets</li>
              <li>Gestion de la facturation</li>
              <li>Gestion des paiements</li>
            </ul>
          `
        },

        {
          title: "Modèle métier & flux",
          html: `
            <p>
              Le cadrage vise à transformer un processus manuel
              en flux métiers structurés.
            </p>

            <ul class="analysis-list">
              <li>Création d'une course</li>
              <li>Attribution d'une mission</li>
              <li>Suivi de la livraison</li>
              <li>Coordination client / livreur / administration</li>
              <li>Facturation et paiement</li>
            </ul>

            <p class="analysis-source">
              VAL · Flux métiers structurés pendant l'intervention.
            </p>
          `
        },

        {
          title: "Sécurité",
          html: `
            <ul class="analysis-list">
              <li>Authentification sécurisée</li>
              <li>Gestion des accès</li>
              <li>Journalisation des actions</li>
              <li>Paiement sécurisé</li>
              <li>Tests fonctionnels</li>
            </ul>

            <p class="analysis-source">
              REQ · Protocoles prévus dans le cahier des charges.
            </p>
          `
        },

        {
          title: "Contraintes & risques",
          html: `
            <ul class="analysis-list analysis-list--warning">
              <li>Processus manuel inefficace</li>
              <li>Manque de traçabilité</li>
              <li>Répartition des missions</li>
              <li>Complexité de facturation</li>
              <li>Coordination des acteurs</li>
            </ul>

            <p class="analysis-source">
              RISK · Risques identifiés pendant le cadrage.
            </p>
          `
        },

        {
          title: "Performance & qualité",
          html: `
            <p>
              L'optimisation des trajets et le suivi en temps réel
              font partie des exigences fonctionnelles.
            </p>

            <p>
              Aucune métrique chiffrée de temps de réponse,
              de charge ou de performance n'est fournie
              dans le dossier disponible.
            </p>

            <p class="analysis-source">
              INFO · Aucune mesure de performance documentée.
            </p>
          `
        }
      ],

      cvr: [
        {
          title: "Contexte",
          html: `
            <p>
              Modernisation d'un
              <strong>système manuel de gestion des livraisons</strong>.
            </p>

            <p>
              La mission est centrée sur le cadrage
              et les flux métiers.
            </p>
          `
        },

        {
          title: "Besoin métier",
          html: `
            <p>
              Centraliser les courses, répartir les missions
              aux livreurs et améliorer la traçabilité
              des opérations de livraison.
            </p>
          `
        },

        {
          title: "Objectifs",
          html: `
            <ul class="analysis-list">
              <li>Automatiser la gestion des courses</li>
              <li>Améliorer l'attribution des missions</li>
              <li>Suivre les livraisons</li>
              <li>Optimiser les trajets</li>
              <li>Structurer la facturation et les paiements</li>
            </ul>
          `
        },

        {
          title: "Mon rôle",
          html: `
            <ul class="analysis-list">
              <li>Analyse des besoins</li>
              <li>Rédaction du cahier des charges</li>
              <li>Pilotage de la roadmap</li>
              <li>Coordination développement et UX/UI</li>
              <li>Animation des réunions</li>
              <li>Gestion des priorités</li>
            </ul>
          `
        },

        {
          title: "Décisions de conception",
          html: `
            <p>
              La réponse fonctionnelle s'appuie sur
              l'automatisation de l'attribution des missions,
              le suivi des livraisons et la centralisation
              des informations dans un dashboard.
            </p>

            <p class="analysis-source">
              DEC · Orientations définies pendant le cadrage.
            </p>
          `
        },

        {
          title: "Bilan",
          html: `
            <p>
              L'intervention aboutit à un cadrage fonctionnel validé,
              une architecture définie et des flux métiers structurés.
            </p>

            <p>
              Le dossier précise que le
              <strong>développement a eu lieu après mon intervention</strong>.
              Cette distinction est volontairement conservée.
            </p>
          `
        },

        {
          title: "Compétences consolidées",
          html: `
            <div class="analysis-tags">
              <span>Gestion de projet Agile</span>
              <span>Cadrage fonctionnel</span>
              <span>Architecture applicative</span>
              <span>Optimisation des flux</span>
              <span>Coordination technique</span>
            </div>
          `
        }
      ],

      timeline: [
        {
          time: "T+00",
          status: "REQ",
          title: "Briefing",
          text: "Analyse du fonctionnement manuel et identification des besoins."
        },
        {
          time: "T+01",
          status: "DEC",
          title: "Cadrage",
          text: "Formalisation du cahier des charges et structuration des flux métiers."
        },
        {
          time: "T+02",
          status: "DEC",
          title: "Planification",
          text: "Organisation de la roadmap et gestion des priorités."
        },
        {
          time: "T+03",
          status: "RISK",
          title: "Risque identifié",
          text: "Traçabilité, répartition des missions et facturation constituent les principaux points de complexité."
        },
        {
          time: "T+04",
          status: "DEC",
          title: "Réponse fonctionnelle",
          text: "Automatisation de l'attribution, suivi des livraisons et centralisation dans un dashboard."
        },
        {
          time: "T+05",
          status: "VAL",
          title: "Transmission",
          text: "Cadrage et architecture validés puis transmis pour développement après l'intervention."
        }
      ]
    },


    /* =====================================================
       FKM MOBILITÉ
       ===================================================== */

    fkm: {
      code: "FKM-03",
      name: "FKM MOBILITÉ",

      summary: {
        type: "Plateforme de mobilité inclusive",
        year: "2024",
        duration: "4 mois",
        sprints: "10",
        role: "Conception · UX · Cadrage",
        status: "PRÊT POUR DÉVELOPPEMENT",
        context: "Projet conçu post-stage",

        technologies: [
          "Laravel",
          "PHP",
          "JavaScript",
          "HTML5",
          "CSS3",
          "MySQL",
          "Stripe",
          "Google Maps",
          "AWS"
        ]
      },

      fdr: [
        {
          title: "Architecture système",
          html: `
            <p>
              Architecture fonctionnelle distinguant
              <strong>quatre profils utilisateurs</strong>.
            </p>

            <div class="analysis-tags">
              <span>Client</span>
              <span>Entreprise / Association</span>
              <span>Transporteur</span>
              <span>Administrateur</span>
            </div>

            <ul class="analysis-list">
              <li>Gestion des comptes</li>
              <li>Réservation de trajets</li>
              <li>Gestion des demandes</li>
              <li>Suivi en temps réel</li>
              <li>Gestion d'événements</li>
              <li>Dashboard administrateur</li>
            </ul>

            <p class="analysis-source">
              REQ · Architecture définie pendant le cadrage.
            </p>
          `
        },

        {
          title: "Stack technique",
          html: `
            <dl class="analysis-tech-grid">
              <div><dt>BACKEND</dt><dd>Laravel / PHP</dd></div>
              <div><dt>FRONTEND</dt><dd>JavaScript · HTML5 · CSS3</dd></div>
              <div><dt>BDD</dt><dd>MySQL</dd></div>
              <div><dt>PAIEMENT</dt><dd>Stripe</dd></div>
              <div><dt>API</dt><dd>Google Maps</dd></div>
              <div><dt>INFRA</dt><dd>AWS</dd></div>
            </dl>

            <p class="analysis-source">
              REQ · Environnement prévu dans les spécifications.
            </p>
          `
        },

        {
          title: "Fonctionnalités",
          html: `
            <ul class="analysis-list">
              <li>Réservation de trajets adaptés</li>
              <li>Gestion des demandes de mobilité</li>
              <li>Suivi des trajets</li>
              <li>Accès à des activités</li>
              <li>Gestion d'événements</li>
              <li>Administration de la plateforme</li>
            </ul>
          `
        },

        {
          title: "Accessibilité",
          html: `
            <p>
              L'accessibilité constitue un
              <strong>enjeu central du produit</strong>.
            </p>

            <p>
              Les parcours sont pensés pour des personnes
              en situation de handicap et doivent limiter
              les obstacles lors de la recherche
              et de la réservation d'un trajet.
            </p>

            <p class="analysis-source">
              REQ · Accessibilité identifiée comme exigence majeure.
            </p>
          `
        },

        {
          title: "Modélisation & parcours",
          html: `
            <p>
              La conception comprend la modélisation UML
              et la préparation des parcours utilisateurs.
            </p>

            <ul class="analysis-list">
              <li>Parcours utilisateurs modélisés</li>
              <li>Flux métiers structurés</li>
              <li>Profils et responsabilités identifiés</li>
              <li>Spécifications fonctionnelles préparées</li>
            </ul>

            <p class="analysis-source">
              VAL · Spécifications préparées pour développement.
            </p>
          `
        },

        {
          title: "Sécurité & données",
          html: `
            <ul class="analysis-list">
              <li>Gestion des rôles</li>
              <li>Protection des données</li>
              <li>Conformité RGPD</li>
              <li>Journalisation</li>
              <li>Tests fonctionnels</li>
            </ul>

            <p class="analysis-source">
              REQ · Exigences prévues dans le cahier des charges.
            </p>
          `
        },

        {
          title: "Contraintes & risques",
          html: `
            <ul class="analysis-list analysis-list--warning">
              <li>Diversité des besoins utilisateurs</li>
              <li>Contraintes d'accessibilité</li>
              <li>Coordination multi-acteurs</li>
              <li>Sécurisation des données</li>
              <li>Adoption de la plateforme</li>
            </ul>

            <p class="analysis-source">
              RISK · Contraintes identifiées pendant la conception.
            </p>
          `
        },

        {
          title: "Performance & qualité",
          html: `
            <p>
              Le suivi en temps réel constitue une exigence
              susceptible d'avoir un impact sur l'architecture
              et les performances.
            </p>

            <p>
              Les données disponibles ne fournissent cependant
              aucun indicateur chiffré de performance.
            </p>

            <p class="analysis-source">
              INFO · Performances à valider pendant le développement.
            </p>
          `
        }
      ],

      cvr: [
        {
          title: "Contexte",
          html: `
            <p>
              Conception d'une plateforme destinée à faciliter
              la mobilité des
              <strong>personnes en situation de handicap</strong>.
            </p>

            <p>
              Le travail est centré sur l'accessibilité
              et les parcours utilisateurs.
            </p>
          `
        },

        {
          title: "Besoin utilisateur",
          html: `
            <p>
              Faciliter l'accès à des déplacements adaptés,
              contribuer à réduire les obstacles à la mobilité
              et limiter l'isolement social.
            </p>
          `
        },

        {
          title: "Objectifs",
          html: `
            <ul class="analysis-list">
              <li>Faciliter la réservation de trajets adaptés</li>
              <li>Réduire les obstacles liés à la mobilité</li>
              <li>Donner accès à des activités</li>
              <li>Assurer le suivi des trajets</li>
              <li>Garantir une plateforme accessible</li>
            </ul>
          `
        },

        {
          title: "Mon rôle",
          html: `
            <ul class="analysis-list">
              <li>Rédaction du cahier des charges</li>
              <li>Modélisation UML</li>
              <li>Conception des parcours</li>
              <li>Planification en sprints</li>
              <li>Coordination des équipes</li>
              <li>Animation des réunions</li>
            </ul>
          `
        },

        {
          title: "Décisions & arbitrages",
          html: `
            <p>
              L'accessibilité et la compréhension des parcours
              sont placées au premier plan de la conception.
            </p>

            <p>
              Les profils client, entreprise/association,
              transporteur et administrateur sont distingués
              afin de clarifier les responsabilités.
            </p>

            <p class="analysis-source">
              DEC · Organisation issue du cadrage fonctionnel.
            </p>
          `
        },

        {
          title: "Bilan",
          html: `
            <p>
              Le projet aboutit à un cahier des charges validé,
              des parcours utilisateurs modélisés,
              des flux métiers structurés et
              des spécifications prêtes.
            </p>

            <p>
              Son statut est
              <strong>prêt pour développement</strong>.
            </p>
          `
        },

        {
          title: "Compétences consolidées",
          html: `
            <div class="analysis-tags">
              <span>Gestion de projet</span>
              <span>Modélisation UML</span>
              <span>Cadrage produit</span>
              <span>UX</span>
              <span>Accessibilité</span>
              <span>Coordination technique</span>
            </div>
          `
        }
      ],

      timeline: [
        {
          time: "T+00",
          status: "REQ",
          title: "Briefing",
          text: "Identification du besoin de mobilité adaptée et des différents acteurs."
        },
        {
          time: "T+01",
          status: "DEC",
          title: "Conception des parcours",
          text: "Analyse des parcours avec l'accessibilité comme contrainte centrale."
        },
        {
          time: "T+02",
          status: "DEC",
          title: "Modélisation",
          text: "Modélisation UML, définition des profils et structuration des flux métier."
        },
        {
          time: "T+03",
          status: "RISK",
          title: "Risque identifié",
          text: "La diversité des besoins, l'accessibilité et la coordination multi-acteurs augmentent la complexité du produit."
        },
        {
          time: "T+04",
          status: "DEC",
          title: "Réponse de conception",
          text: "Priorisation de l'accessibilité et séparation claire des parcours selon les profils."
        },
        {
          time: "T+05",
          status: "VAL",
          title: "Validation",
          text: "Cahier des charges, parcours et spécifications finalisés ; projet prêt pour développement."
        }
      ]
    }
  };


  
   /* =========================================================
     BLACK BOX — MOTEUR
     À placer APRÈS const PROJECTS = { ... };
     ========================================================= */


  /* =========================================================
     01. DOM
     ========================================================= */

  const dialog =
    document.getElementById("analysis-dialog");


  if (!dialog) {
    console.warn(
      "[BLACK BOX] #analysis-dialog introuvable."
    );

    return;
  }


  const $ = (
    selector,
    context = document
  ) => context.querySelector(selector);


  const $$ = (
    selector,
    context = document
  ) => Array.from(
    context.querySelectorAll(selector)
  );


  const DOM = {

    /* ---------- Recorders ---------- */

    recorders:
      $$(".flight-recorder"),

    recorderButtons:
      $$("[data-select]"),


    /* ---------- Recovery console ---------- */

    empty:
      $("[data-console-empty]"),

    selected:
      $("[data-console-selected]"),

    consoleTitle:
      $("#recovery-title"),

    consoleStatus:
      $("[data-console-status]"),


    /* ---------- Mission summary ---------- */

    code:
      $("[data-selected-code]"),

    name:
      $("[data-selected-name]"),

    period:
      $("[data-selected-period]"),

    duration:
      $("[data-selected-duration]"),

    sprints:
      $("[data-selected-sprints]"),

    role:
      $("[data-selected-role]"),

    status:
      $("[data-selected-status]"),

    dataState:
      $("[data-selected-data]"),

    context:
      $("[data-selected-context]"),

    stack:
      $("[data-selected-stack]"),


    /* ---------- Recovery ---------- */

    percent:
      $("[data-recovery-percent]"),

    progress:
      $("[data-recovery-progress]"),

    progressBar:
      $("[data-recovery-bar]"),

    start:
      $("[data-start-recovery]"),

    recoveryComplete:
      $("[data-recovery-complete]"),

    openReport:
      $("[data-open-analysis]"),

    live:
      $("[data-recovery-live]"),

    recoverySteps:
      $$("[data-recovery-step]"),


    /* ---------- Analysis ---------- */

    analysisCode:
      $("[data-analysis-code]", dialog),

    analysisName:
      $("[data-analysis-name]", dialog),

    modes:
      $$("[data-mode]", dialog),

    navigation:
      $("[data-analysis-nav]", dialog),

    blockNumber:
      $("[data-block-number]", dialog),

    blockTitle:
      $("[data-block-title]", dialog),

    blockContent:
      $("[data-block-content]", dialog),

    blockCounter:
      $("[data-block-counter]", dialog),

    previous:
      $("[data-prev-block]", dialog),

    next:
      $("[data-next-block]", dialog),


    /* ---------- Analysis progress ---------- */

    completion:
      $(".analysis-completion", dialog),

    analysisProgress:
      $("[data-analysis-progress]", dialog),

    analysisProgressText:
      $(
        "[data-analysis-progress-text]",
        dialog
      ),

    analysisComplete:
      $(
        "[data-analysis-complete]",
        dialog
      ),

    finish:
      $(
        "[data-analysis-finish]",
        dialog
      )

  };


  /* =========================================================
     02. STATE
     ========================================================= */

  const STATE = {
    projectId: null,

    mode: "summary",

    blockIndex: 0,

    recovering: false,

    recoveryFrame: null,

    /*
     * Progression de la consultation courante.
     *
     * Elle n'est volontairement PAS stockée dans
     * sessionStorage.
     *
     * Une reconsultation repart donc à zéro.
     */
    viewedBlocks: new Set()
  };


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  /* =========================================================
     03. STORAGE
     ========================================================= */

  const STORAGE = {

    recoveryKey(id) {
      return `bbx-recovered-${id}`;
    },


    analysisKey(id) {
      return `bbx-analysis-complete-${id}`;
    },


    isRecovered(id) {
      try {
        return (
          sessionStorage.getItem(
            this.recoveryKey(id)
          ) === "true"
        );
      } catch {
        return false;
      }
    },


    setRecovered(id) {
      try {
        sessionStorage.setItem(
          this.recoveryKey(id),
          "true"
        );
      } catch {
        /* Le portfolio reste utilisable. */
      }
    },


    isAnalysed(id) {
      try {
        return (
          sessionStorage.getItem(
            this.analysisKey(id)
          ) === "true"
        );
      } catch {
        return false;
      }
    },


    setAnalysed(id) {
      try {
        sessionStorage.setItem(
          this.analysisKey(id),
          "true"
        );
      } catch {
        /* Le portfolio reste utilisable. */
      }
    }

  };


  /* =========================================================
     04. HELPERS
     ========================================================= */

  function getProject() {

    if (!STATE.projectId) {
      return null;
    }


    return (
      PROJECTS[STATE.projectId]
      ?? null
    );

  }


  function announce(message) {

    if (!DOM.live) {
      return;
    }


    DOM.live.textContent =
      "";


    requestAnimationFrame(
      () => {
        DOM.live.textContent =
          message;
      }
    );

  }


  function renderTags(values) {

    if (!DOM.stack) {
      return;
    }


    const fragment =
      document.createDocumentFragment();


    values.forEach(
      value => {

        const tag =
          document.createElement(
            "span"
          );


        tag.textContent =
          value;


        fragment.appendChild(
          tag
        );

      }
    );


    DOM.stack.replaceChildren(
      fragment
    );

  }


  function getRecorder(id) {

    return DOM.recorders.find(
      recorder =>
        recorder.dataset.recorder === id
    ) ?? null;

  }


  function getRecorderLabel(id) {

    const recorder =
      getRecorder(id);


    if (!recorder) {
      return null;
    }


    return recorder.querySelector(
      "[data-recorder-state]"
    );

  }


  /* =========================================================
     05. RECORDER STATUS
     ========================================================= */

  function getProjectStatus(id) {

    if (
      STORAGE.isAnalysed(id)
    ) {
      return "analysed";
    }


    if (
      STORAGE.isRecovered(id)
    ) {
      return "recovered";
    }


    return "ready";

  }


  function updateRecorderStatus(id) {

    const recorder =
      getRecorder(id);


    const label =
      getRecorderLabel(id);


    if (
      !recorder ||
      !label
    ) {
      return;
    }


    const status =
      getProjectStatus(id);


    recorder.classList.toggle(
      "is-recovered",
      status !== "ready"
    );


    recorder.classList.toggle(
      "is-analysed",
      status === "analysed"
    );


    switch (status) {

      case "analysed":

        label.textContent =
          "ANALYSIS COMPLETE";

        break;


      case "recovered":

        label.textContent =
          "DATA RECOVERED";

        break;


      default:

        label.textContent =
          "READY FOR RECOVERY";

    }

  }


  /* =========================================================
     06. SELECT RECORDER
     ========================================================= */

  function selectRecorder(id) {

    if (
      STATE.recovering ||
      !PROJECTS[id]
    ) {
      return;
    }


    STATE.projectId =
      id;


    const project =
      getProject();


    const status =
      getProjectStatus(id);


    /* ---------- Selection visuelle ---------- */

    DOM.recorders.forEach(
      recorder => {

        recorder.classList.toggle(
          "is-selected",
          recorder.dataset.recorder === id
        );

      }
    );


    DOM.empty.hidden =
      true;


    DOM.selected.hidden =
      false;


    /* ---------- Mission ---------- */

    DOM.code.textContent =
      project.code;


    DOM.name.textContent =
      project.name;


    DOM.period.textContent =
      project.summary.year;


    DOM.duration.textContent =
      project.summary.duration;


    DOM.sprints.textContent =
      project.summary.sprints;


    DOM.role.textContent =
      project.summary.role;


    DOM.status.textContent =
      project.summary.status;


    DOM.context.textContent =
      project.summary.context;


    renderTags(
      project.summary.technologies
    );


    DOM.consoleTitle.textContent =
      `${project.code} · ${project.name}`;


    DOM.consoleStatus.classList.add(
      "is-online"
    );


    /* =====================================================
       État 1 — READY FOR RECOVERY
       ===================================================== */

    if (status === "ready") {

      DOM.consoleStatus.textContent =
        "CONNECTED";


      resetRecoveryInterface();


      announce(
        `${project.name} sélectionné. Initialisez la récupération.`
      );


      return;

    }


    /* =====================================================
       État 2 — DATA RECOVERED
       ===================================================== */

    if (status === "recovered") {

      restoreRecoveredInterface();


      setReportButton(
        "CONSULTER LE RAPPORT"
      );


      announce(
        `${project.name}. Données récupérées. Rapport disponible.`
      );


      return;

    }


    /* =====================================================
       État 3 — ANALYSIS COMPLETE
       ===================================================== */

    restoreRecoveredInterface();


    DOM.consoleStatus.textContent =
      "ANALYSIS COMPLETE";


    setReportButton(
      "RECONSULTER LE RAPPORT"
    );


    announce(
      `${project.name}. Analyse terminée. Le rapport peut être reconsulté.`
    );

  }


  DOM.recorderButtons.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          selectRecorder(
            button.dataset.select
          );

        }
      );

    }
  );


  /* =========================================================
     07. REPORT BUTTON
     ========================================================= */

  function setReportButton(text) {

    if (!DOM.openReport) {
      return;
    }


    DOM.openReport.textContent =
      text;


    DOM.openReport.hidden =
      false;

  }


  /* =========================================================
     08. RESET RECOVERY INTERFACE
     ========================================================= */

  function resetRecoveryInterface() {

    STATE.recovering =
      false;


    if (
      STATE.recoveryFrame !== null
    ) {

      cancelAnimationFrame(
        STATE.recoveryFrame
      );


      STATE.recoveryFrame =
        null;

    }


    DOM.percent.textContent =
      "0 %";


    DOM.progressBar.style.width =
      "0%";


    DOM.progress.setAttribute(
      "aria-valuenow",
      "0"
    );


    DOM.dataState.textContent =
      "VERROUILLÉES";


    DOM.dataState.classList.remove(
      "is-recovered"
    );


    DOM.start.hidden =
      false;


    DOM.start.disabled =
      false;


    DOM.recoveryComplete.hidden =
      true;


    DOM.recoverySteps.forEach(
      step => {

        step.classList.remove(
          "is-running",
          "is-complete"
        );


        const icon =
          step.querySelector(
            "span"
          );


        if (icon) {
          icon.textContent =
            "○";
        }

      }
    );

  }


  /* =========================================================
     09. RESTORE RECOVERED INTERFACE
     ========================================================= */

  function restoreRecoveredInterface() {

    DOM.percent.textContent =
      "100 %";


    DOM.progressBar.style.width =
      "100%";


    DOM.progress.setAttribute(
      "aria-valuenow",
      "100"
    );


    DOM.dataState.textContent =
      "RÉCUPÉRÉES";


    DOM.dataState.classList.add(
      "is-recovered"
    );


    DOM.start.hidden =
      true;


    DOM.start.disabled =
      false;


    DOM.recoveryComplete.hidden =
      false;


    DOM.recoverySteps.forEach(
      step => {

        step.classList.remove(
          "is-running"
        );


        step.classList.add(
          "is-complete"
        );


        const icon =
          step.querySelector(
            "span"
          );


        if (icon) {
          icon.textContent =
            "✓";
        }

      }
    );

  }


  /* =========================================================
     10. START RECOVERY
     ========================================================= */

  function startRecovery() {

    if (
      !STATE.projectId ||
      STATE.recovering
    ) {
      return;
    }


    /*
     * Une récupération déjà réalisée
     * ne doit jamais être relancée.
     */

    if (
      STORAGE.isRecovered(
        STATE.projectId
      )
    ) {
      return;
    }


    STATE.recovering =
      true;


    DOM.start.disabled =
      true;


    DOM.dataState.textContent =
      "LECTURE...";


    DOM.consoleStatus.textContent =
      "RECOVERING";


    announce(
      "Récupération des données en cours."
    );


    const duration =
      reducedMotion.matches
        ? 100
        : 2200;


    const startedAt =
      performance.now();


    const frame =
      now => {

        const ratio =
          Math.min(
            (
              now -
              startedAt
            ) /
            duration,

            1
          );


        const percentage =
          Math.round(
            ratio * 100
          );


        updateRecoveryProgress(
          percentage
        );


        if (
          ratio < 1
        ) {

          STATE.recoveryFrame =
            requestAnimationFrame(
              frame
            );


          return;

        }


        STATE.recoveryFrame =
          null;


        completeRecovery();

      };


    STATE.recoveryFrame =
      requestAnimationFrame(
        frame
      );

  }


  DOM.start?.addEventListener(
    "click",
    startRecovery
  );


  /* =========================================================
     11. RECOVERY PROGRESS
     ========================================================= */

  function updateRecoveryProgress(
    percentage
  ) {

    DOM.percent.textContent =
      `${percentage} %`;


    DOM.progressBar.style.width =
      `${percentage}%`;


    DOM.progress.setAttribute(
      "aria-valuenow",
      String(percentage)
    );


    const segment =
      100 /
      DOM.recoverySteps.length;


    DOM.recoverySteps.forEach(
      (step, index) => {

        const start =
          index * segment;


        const end =
          (index + 1)
          * segment;


        const icon =
          step.querySelector(
            "span"
          );


        const complete =
          percentage >= end;


        const running =
          percentage >= start &&
          percentage < end;


        step.classList.toggle(
          "is-complete",
          complete
        );


        step.classList.toggle(
          "is-running",
          running
        );


        if (!icon) {
          return;
        }


        if (complete) {
          icon.textContent =
            "✓";
        }

        else if (running) {
          icon.textContent =
            "›";
        }

        else {
          icon.textContent =
            "○";
        }

      }
    );

  }


  /* =========================================================
     12. COMPLETE RECOVERY
     ========================================================= */

  function completeRecovery() {

    if (!STATE.projectId) {
      return;
    }


    STATE.recovering =
      false;


    STORAGE.setRecovered(
      STATE.projectId
    );


    restoreRecoveredInterface();


    DOM.consoleStatus.textContent =
      "RECOVERED";


    updateRecorderStatus(
      STATE.projectId
    );


    setReportButton(
      "CONSULTER LE RAPPORT"
    );


    announce(
      "Récupération terminée. Le rapport est disponible."
    );

  }


  /* =========================================================
     13. SUMMARY
     ========================================================= */

  function createSummary(project) {

    return `
      <p>
        Synthèse opérationnelle de la mission sélectionnée.
        Les technologies indiquées correspondent à la
        <strong>stack prévue dans le cahier des charges</strong>.
      </p>

      <dl class="analysis-summary-grid">

        <div>
          <dt>MISSION</dt>
          <dd>${project.name}</dd>
        </div>

        <div>
          <dt>TYPE</dt>
          <dd>${project.summary.type}</dd>
        </div>

        <div>
          <dt>PÉRIODE</dt>
          <dd>${project.summary.year}</dd>
        </div>

        <div>
          <dt>DURÉE</dt>
          <dd>${project.summary.duration}</dd>
        </div>

        <div>
          <dt>SPRINTS</dt>
          <dd>${project.summary.sprints}</dd>
        </div>

        <div>
          <dt>RÔLE</dt>
          <dd>${project.summary.role}</dd>
        </div>

        <div>
          <dt>STATUT</dt>
          <dd>${project.summary.status}</dd>
        </div>

        <div>
          <dt>CONTEXTE</dt>
          <dd>${project.summary.context}</dd>
        </div>

      </dl>

      <div class="analysis-section">

        <span class="analysis-label">
          STACK / ÉQUIPEMENT PRÉVU
        </span>

        <div class="analysis-tags">

          ${project.summary.technologies
            .map(
              technology =>
                `<span>${technology}</span>`
            )
            .join("")}

        </div>

      </div>
    `;

  }


  /* =========================================================
     14. TIMELINE
     ========================================================= */

  function createTimeline(entries) {

    return `
      <div class="mission-timeline">

        ${entries.map(entry => `

          <article
            class="timeline-entry"
            data-status="${entry.status}"
          >

            <header
              class="timeline-entry__head"
            >

              <time>
                ${entry.time}
              </time>

              <span
                class="timeline-status"
              >
                ${entry.status}
              </span>

            </header>

            <h4>
              ${entry.title}
            </h4>

            <p>
              ${entry.text}
            </p>

          </article>

        `).join("")}

      </div>
    `;

  }


  /* =========================================================
     15. GET ANALYSIS BLOCKS
     ========================================================= */

  function getBlocks() {

    const project =
      getProject();


    if (!project) {
      return [];
    }


    if (
      STATE.mode ===
      "summary"
    ) {

      return [{
        title:
          "Synthèse de mission",

        html:
          createSummary(
            project
          )
      }];

    }


    if (
      STATE.mode ===
      "timeline"
    ) {

      return [{
        title:
          "Chronologie de mission",

        html:
          createTimeline(
            project.timeline
          )
      }];

    }


    return (
      project[STATE.mode]
      ?? []
    );

  }


  /* =========================================================
     16. RESET ANALYSIS SESSION

     IMPORTANT :
     chaque ouverture/reconsultation repart à 0 %.
     ========================================================= */

  function resetAnalysisSession() {

    STATE.mode =
      "summary";


    STATE.blockIndex =
      0;


    STATE.viewedBlocks.clear();


    DOM.analysisProgress.value =
      0;


    DOM.analysisProgressText.textContent =
      "0 %";


    DOM.analysisComplete.hidden =
      true;


    DOM.completion?.classList.remove(
      "is-complete"
    );


    DOM.modes.forEach(
      button => {

        button.classList.remove(
          "is-viewed"
        );

      }
    );

  }


  /* =========================================================
     17. OPEN / REOPEN REPORT
     ========================================================= */

  function openAnalysis() {

    if (!STATE.projectId) {
      return;
    }


    /*
     * Aucun rapport sans récupération.
     */

    if (
      !STORAGE.isRecovered(
        STATE.projectId
      )
    ) {

      announce(
        "Initialisez d'abord la récupération."
      );


      return;

    }


    const project =
      getProject();


    /*
     * Toute consultation repart à zéro,
     * y compris ANALYSIS COMPLETE.
     */

    resetAnalysisSession();


    DOM.analysisCode.textContent =
      project.code;


    DOM.analysisName.textContent =
      project.name;


    updateModeButtons();


    renderAnalysis();


    if (!dialog.open) {
      dialog.showModal();
    }

  }


  DOM.openReport?.addEventListener(
    "click",
    openAnalysis
  );


  /* =========================================================
     18. ANALYSIS MODES
     ========================================================= */

  DOM.modes.forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          STATE.mode =
            button.dataset.mode;


          STATE.blockIndex =
            0;


          updateModeButtons();


          renderAnalysis();

        }
      );

    }
  );


  function updateModeButtons() {

    DOM.modes.forEach(
      button => {

        button.classList.toggle(
          "is-active",
          button.dataset.mode ===
            STATE.mode
        );

      }
    );

  }


  /* =========================================================
     19. ANALYSIS PROGRESS
     ========================================================= */

  function getViewKey(
    mode,
    index
  ) {

    return (
      `${mode}:${index}`
    );

  }


  function getModeSize(mode) {

    const project =
      getProject();


    if (!project) {
      return 0;
    }


    if (
      mode === "summary" ||
      mode === "timeline"
    ) {
      return 1;
    }


    return (
      project[mode]?.length
      ?? 0
    );

  }


  function getTotalBlocks() {

    return (
      getModeSize("summary") +
      getModeSize("fdr") +
      getModeSize("cvr") +
      getModeSize("timeline")
    );

  }


  function isModeComplete(mode) {

    const size =
      getModeSize(mode);


    if (!size) {
      return false;
    }


    for (
      let index = 0;
      index < size;
      index++
    ) {

      if (
        !STATE.viewedBlocks.has(
          getViewKey(
            mode,
            index
          )
        )
      ) {
        return false;
      }

    }


    return true;

  }


  function markCurrentBlockViewed() {

    STATE.viewedBlocks.add(
      getViewKey(
        STATE.mode,
        STATE.blockIndex
      )
    );


    updateAnalysisProgress();

  }


  function updateAnalysisProgress() {

    const total =
      getTotalBlocks();


    const viewed =
      STATE.viewedBlocks.size;


    const percentage =
      total > 0
        ? Math.min(
            100,
            Math.round(
              viewed /
              total *
              100
            )
          )
        : 0;


    DOM.analysisProgress.value =
      percentage;


    DOM.analysisProgressText.textContent =
      `${percentage} %`;


    const complete =
      percentage === 100;


    DOM.analysisComplete.hidden =
      !complete;


    DOM.completion?.classList.toggle(
      "is-complete",
      complete
    );


    DOM.modes.forEach(
      button => {

        button.classList.toggle(
          "is-viewed",

          isModeComplete(
            button.dataset.mode
          )
        );

      }
    );

  }


  /* =========================================================
     20. RENDER ANALYSIS
     ========================================================= */

  function renderAnalysis() {

    const blocks =
      getBlocks();


    if (!blocks.length) {
      return;
    }


    STATE.blockIndex =
      Math.max(
        0,

        Math.min(
          STATE.blockIndex,
          blocks.length - 1
        )
      );


    renderBlock(
      blocks
    );


    renderNavigation(
      blocks
    );

  }


  function renderBlock(blocks) {

    const block =
      blocks[
        STATE.blockIndex
      ];


    if (!block) {
      return;
    }


    DOM.blockNumber.textContent =
      `DATA BLOCK ${
        String(
          STATE.blockIndex + 1
        ).padStart(
          2,
          "0"
        )
      }`;


    DOM.blockTitle.textContent =
      block.title;


    /*
     * Les contenus HTML viennent exclusivement
     * de PROJECTS, défini localement.
     */

    DOM.blockContent.innerHTML =
      block.html;


    DOM.blockCounter.textContent =
      `${
        String(
          STATE.blockIndex + 1
        ).padStart(
          2,
          "0"
        )
      } / ${
        String(
          blocks.length
        ).padStart(
          2,
          "0"
        )
      }`;


    DOM.previous.disabled =
      STATE.blockIndex === 0;


    DOM.next.disabled =
      STATE.blockIndex ===
      blocks.length - 1;


    /*
     * Le bloc vient réellement
     * d'être affiché.
     */

    markCurrentBlockViewed();

  }


  function renderNavigation(
    blocks
  ) {

    const fragment =
      document.createDocumentFragment();


    blocks.forEach(
      (block, index) => {

        const item =
          document.createElement(
            "li"
          );


        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.textContent =
          `${
            String(
              index + 1
            ).padStart(
              2,
              "0"
            )
          } / ${block.title}`;


        button.classList.toggle(
          "is-active",
          index ===
            STATE.blockIndex
        );


        button.classList.toggle(
          "is-viewed",

          STATE.viewedBlocks.has(
            getViewKey(
              STATE.mode,
              index
            )
          )
        );


        button.addEventListener(
          "click",
          () => {

            STATE.blockIndex =
              index;


            renderAnalysis();

          }
        );


        item.appendChild(
          button
        );


        fragment.appendChild(
          item
        );

      }
    );


    DOM.navigation.replaceChildren(
      fragment
    );

  }


  /* =========================================================
     21. PREVIOUS / NEXT
     ========================================================= */

  DOM.previous?.addEventListener(
    "click",
    () => {

      if (
        STATE.blockIndex <= 0
      ) {
        return;
      }


      STATE.blockIndex--;


      renderAnalysis();

    }
  );


  DOM.next?.addEventListener(
    "click",
    () => {

      const blocks =
        getBlocks();


      if (
        STATE.blockIndex >=
        blocks.length - 1
      ) {
        return;
      }


      STATE.blockIndex++;


      renderAnalysis();

    }
  );


  /* =========================================================
     22. RESET CONSOLE AFTER ANALYSIS
     ========================================================= */

  function resetConsoleAfterAnalysis() {

    /*
     * Aucune carte sélectionnée.
     */

    DOM.recorders.forEach(
      recorder => {

        recorder.classList.remove(
          "is-selected"
        );

      }
    );


    /*
     * Écran d'attente.
     */

    DOM.empty.hidden =
      false;


    DOM.selected.hidden =
      true;


    DOM.consoleTitle.textContent =
      "En attente d'un enregistreur";


    DOM.consoleStatus.textContent =
      "STANDBY";


    DOM.consoleStatus.classList.remove(
      "is-online"
    );


    /*
     * Nettoyage de l'état courant.
     */

    STATE.projectId =
      null;


    STATE.mode =
      "summary";


    STATE.blockIndex =
      0;


    STATE.viewedBlocks.clear();


    STATE.recovering =
      false;

  }


  /* =========================================================
     23. FINALISE ANALYSIS
     ========================================================= */

  DOM.finish?.addEventListener(
    "click",
    () => {

      const projectId =
        STATE.projectId;


      if (!projectId) {
        return;
      }


      if (
        STATE.viewedBlocks.size <
        getTotalBlocks()
      ) {
        return;
      }


      /*
       * Dossier officiellement analysé.
       */

      STORAGE.setAnalysed(
        projectId
      );


      updateRecorderStatus(
        projectId
      );


      /*
       * Confirmation visuelle.
       */

      DOM.finish.disabled =
        true;


      DOM.finish.textContent =
        "✓ RAPPORT CLÔTURÉ";


      announce(
        "Analyse terminée. Rapport clôturé."
      );


      const delay =
        reducedMotion.matches
          ? 0
          : 650;


      window.setTimeout(
        () => {

          dialog.close();


          /*
           * Retour réel au début.
           */

          resetConsoleAfterAnalysis();


          /*
           * Préparation pour une future
           * reconsultation.
           */

          DOM.finish.disabled =
            false;


          DOM.finish.textContent =
            "✓ CLÔTURER LE RAPPORT";

        },

        delay
      );

    }
  );


  /* =========================================================
     24. INITIAL RESTORE
     ========================================================= */

  Object.keys(
    PROJECTS
  ).forEach(
    id => {

      updateRecorderStatus(
        id
      );

    }
  );

})();
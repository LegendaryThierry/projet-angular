# Pour lancer l'application :

1. Lancer l'API :
  * ```cd api```
  * ```node server```

2. Lancer le site :
  * ```cd assignment-app```
  * ```npm install```
  * ```ng serve```

3. Se connecter :
  * Différents type d'utilisateurs :
    + élève : id : alexis/password:vighi
    + professeur: id:marion/password:quinn
    + admin: id:admin/password:admin

## Sujet du projet : améliorer le TP sur les Assignments


###  Travail attendu

Les améliorations TP sont les suivantes :

-   **Ajout d'une gestion de login/password**
  -   Création d'une collection Utilisateurs dans MongoDB, et en validant que le user/password est correct.
  -   Cas particulier : User admin.

-   **Propriétés du modèle d'Assignement**
  -   Auteur (nom de l'élève)
  -   Matière
    -   Une image est associée à chaque matière et une photo du prof
  -   Note sur 20, on ne peut marquer "rendu" un Assignment qui n'a pas été noté.
  -   Remarques

-   **Amélioration de l'affichage des Assignments**
  -   Nouveaux emplacements pour la visualisation des devoirs à rendre/rendu, sous forme de tableaux.
  -   La vue détaillé montre la note, les remarques le professeur, l'élève, le temps qu'il reste lors de la remise du devoir.
  -   Les formulaires d'ajout et de détails proposeront un choix fixe de matières (et associeront automatiquement le prof et l'image illustrant la matière)

-   **Afficher les Assignments dans deux onglets séparés selon qu'ils ont été rendus ou pas encore rendus**
  -   Lorsqu'on met une note à un Assignment et il devient rendu et apparaitra dans l'onglet "Rendu"

-   **Utilisation d'un Formulaire de type Stepper (formulaire en plusieurs étapes) pour l'ajout d'Assignments**


-   **Le sujet est ouvert, vous pouvez ajouter ce qui vous semble amusant/pertinent:**
  -   Image avec animation CSS
  - Dark Mode
  - Sécurisation des routes
  - Restriction des accès utilisateurs
  - Respect des normes du langage TypeScript
  - Respect des normes de Material Design

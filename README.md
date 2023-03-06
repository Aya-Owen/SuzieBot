
# Suzie Bot
Suzie est l'assistante des rôlistes rouennais. Elle permettra essentiellement à l'association d'enregistrer les tables qui seront jouées chaque semaine.

Elle possède également des commandes de lecture d'inventaire.

## Utilisation de Suzie

### 1 - Téléchargement
- Avec un outil GIT, comme gitKraken par exemple, clonez ce repo
ou
- téléchargez et dézippez le projet https://github.com/Aya-Owen/SuzieBot (bouton "code")

### 2 - Installation
- Vous avez besoin d'installer Node.js : https://nodejs.org/fr/
- Déplacer vous dans le dossier racine de suzie (celui dans lequel vous trouverez package.json)
- Avec un invite de commande windows, lancer la commande suivante:
```
npm install
```

### 3 - Parametrage
Le fichier config.json contient les infos nécessaires au fonctionnement de Suzie
- token : le token associé au bot, permettant à ce programme d'en prendre le contrôle
- clientId : l'id du client du bot
- guildId : l'id du serveur discord utilisant Suzie
- roleSuppressionTableId : l'id du rôle ayant le droit de supprimer n'importe quelle table prévue. Les membres n'ayant pas de rôle ne pourront supprimer que les leurs.


### 4 - Lancement de Suzie
- Déplacer vous dans le dossier racine de suzie (celui dans lequel vous trouverez package.json)
- Avec un invite de commande windows, lancer la commande suivante:
```
npm run
```

## Fonctionnement de Suzie
### Tables
Chaque semaine, jusqu'à 2 fichiers sont créés. Un pour le samedi et un pour le dimanche.
Ces fichiers de base de données sont présentés ainsi :
```
tables_20230218.json (tables_AAAAMMJJ.json)
```

```
{
    "tables": [
        {
            "nom":"Maléfices !", <--- nom du jeu
            "genre":"trop cool", <--- ambiance général du jeu
            "min":"4", <--- nombre min de joueurs
            "max":"5", <--- nombre max de joueurs
            "user":"Pierre", <--- Nom du compte discord
            "userDiscriminator":"7895", <--- Numéro du compte discord
            "userId":"123456789", <--- Id du compte discord
            "sequenceId":1
        },
        {
            "nom":"Donjons & Dragons",
            "genre":"MedFan",
            "min":"2",
            "max":"5",
            "user":"Michelle",
            "userDiscriminator":"0123",
            "userId":"123456789", <--- Id du compte discord
            "sequenceId":2
        }
    ],
    "sequence": 3, <--- nombre max de joueurs
    "idMessage":"789456123456", <--- Id du message (posté par le bot) résumant le fichier
    "idChannel":"456789456123" <--- Id du canal sur lequel le message a été posté
}
```

### Inventaire

TODO
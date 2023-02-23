
# Suzie Bot
Suzie est l'assistante des rôlistes rouennais. Elle permettra essentiellement à l'association d'enregistrer les tables qui seront jouées chaque semaine.

Elle possède également des commandes de lecture d'inventaire.

## Tables
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

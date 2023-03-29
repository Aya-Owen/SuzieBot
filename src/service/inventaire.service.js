import { Utils } from '../utils/utils.js';

const colonnes = { NUMERO: 0, TYPE: 1, GAMME: 2, SOUSTYPE: 3, NOM: 4, DETAIL: 5, LIEU: 6 };
const types = { JDR: "JDR", JDS: "JDS", MAGAZINE: "Magazine", Objet: "Objet" };

function getInventaireTotal() {
    const lignes = Utils.lireTexteDansFichierBdd("inventaire.csv").split("\n");
    var inventaire = [];


    // on supprime la 1ere ligne d'entete
    lignes.reverse();
    lignes.pop();
    lignes.reverse();

    // on divise chaque ligne en infos
    lignes.forEach(element => {
        const item = element.split(";");
        inventaire.push(item);
    });
    return inventaire;
}

function getInventaire(type) {
    const lignes = Utils.lireTexteDansFichierBdd("inventaire.csv").split("\n");
    var inventaire = [];

    // on supprime la 1ere ligne d'entete
    lignes.reverse();
    lignes.pop();
    lignes.reverse();

    // on divise chaque ligne en infos
    lignes.forEach(element => {
        const item = element.split(";");
        if (item[colonnes.TYPE] == type) {
            inventaire.push(item);
        }
    });
    return inventaire;
}

function getListeGamme(listeInventaire) {
    var gammes = [];

    // on divise chaque ligne en infos
    listeInventaire.forEach(element => {
        gammes.push(element[colonnes.GAMME]);
    });
    return [...new Set(gammes)];
}

function getListeColonne(listeInventaire, colonne, filtres) {
    var ret = [];

    // on divise chaque ligne en infos
    listeInventaire.forEach(element => {
        if (element[colonne] && element[colonne] !== "") {
            // on applique le filtre
            var ok = true;
            filtres.forEach(filtre => {
                ok = ok && element[filtre.colonne] == filtre.valeur;
            });
            if (ok) ret.push(element[colonne]);
        }
    });

    return [...new Set(ret)];
}


function inventaireInteraction(interaction, type) {
    const action = "";
    const code = "";
    const inventaire = getInventaire(type);
    const listeGamme = getListeGamme(inventaire);
    listeGamme.sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));

    var intro = "Woaw, on a " + inventaire.length + " trucs dans cette catégorie ! Voilà les différents jeux :\n";
    var liste = listeGamme.join("\n- ");
    var reponse;

    if (intro.length + liste.length >= 1998) {
        reponse = intro + "Désolée, je ne peux pas tout afficher :/ Je suis limitée à 2000 caractères.";
    }
    else {
        reponse = intro + "- " + liste;
    }
    interaction.reply({
        content: reponse,
        ephemeral: true
    });
}

function inventaire(interaction) {
    const categorie = interaction.options.getString('categorie') ? interaction.options.getString('categorie').trim() : null;
    const gamme = interaction.options.getString('gamme') ? interaction.options.getString('gamme').trim() : null;
    var reponse = "";

    // on récupère l'intégralité des lignes
    const lignes = getInventaireTotal();

    if (!categorie && !gamme) {
        const listCategories = getListeColonne(lignes, colonnes.TYPE, []);
        reponse += "Peux tu être plus précis ? Nous avons " + listCategories.length + " catégories. Tu peux renvoyer la commande en précisant laquelle t'intéresse :"
        reponse += "\n - " + listCategories.join("\n - ");
    }

    if (!!categorie && !gamme) {
        const listeObj = getListeColonne(lignes, colonnes.GAMME, [{ colonne: colonnes.TYPE, valeur: categorie }]);
        reponse += "Pour cette catégorie, nous avons " + listeObj.length + " gammes. Tu peux renvoyer la commande en précisant laquelle t'intéresse :"
        reponse += "\n - " + listeObj.join("\n - ");
    }


    interaction.reply({
        content: reponse,
        ephemeral: true
    });
}


// liste des fonctions exportées
const InventaireUtils = {
    Types: types,
    inventaireInteraction: inventaireInteraction,
    inventaire: inventaire
};
export { InventaireUtils as InventaireUtils };
import { Utils } from './utils.js';

const colonnes = { TYPE: 0, GAMME: 1, SOUSTYPE: 2, NOM: 3, DETAIL: 4, LIEU: 5 };
const types = { JDR: "JDR", JDS: "JDS", MAGAZINE: "Magazine", Objet: "Objet" };
const soustypes = { JDR: "JDR", JDS: "JDS", MAGAZINE: "Magazine", Objet: "Objet" };

function getInventaireTotal() {
    const lignes = Utils.lireTexteDansFichierBdd("inventaire.csv").split("\n");
    var inventaire = {
        jdr: [],
        jds: [],
        autre: []
    };

    // on supprime la 1ere ligne d'entete
    lignes.reverse();
    lignes.pop();
    lignes.reverse();

    // on divise chaque ligne en infos
    lignes.forEach(element => {
        const item = element.split(";");
        if (item[colonnes.TYPE] == types.JDR) {
            inventaire.jdr.push(item);
        }
        else if (item[colonnes.TYPE] == types.JDS) {
            inventaire.jds.push(item);
        }
        else {
            inventaire.autre.push(item);
        }
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
    return [...new Set(gammes)];;
}



// liste des fonctions exportées
const InventaireUtils = {
    Types: types,
    getListeGamme: getListeGamme,
    getInventaire: getInventaire,
    getInventaireTotal: getInventaireTotal
};
export { InventaireUtils as InventaireUtils };
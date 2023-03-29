// Requiring fs module in which
// readFile function is defined.
import * as fs from 'fs';

function lireListeDansFichier(nomFichier) {
    var liste = fs.readFileSync("./assets/list/" + nomFichier + ".list.txt").toString().split("\r\n");
    return liste;
}

function ecrireObjetDansFichier(nomFichier, objet) {
    fs.writeFileSync("./bdd/" + nomFichier + ".json", JSON.stringify(objet));
}

function lireObjetDansFichier(nomFichier) {
    try {
        return JSON.parse(fs.readFileSync("./bdd/" + nomFichier + ".json"));
    } catch (e) {
        return null;
    }
}

function lireTexteDansFichier(nomFichier) {
    return fs.readFileSync("./assets/text/" + nomFichier + ".txt").toString();
}

function lireTexteDansFichierBdd(nomFichier) {
    return fs.readFileSync("./bdd/" + nomFichier).toString();
}


// liste des fonctions exportées
const FileUtils = {
    lireListeDansFichier: lireListeDansFichier,
    lireTexteDansFichier: lireTexteDansFichier,
    ecrireObjetDansFichier: ecrireObjetDansFichier,
    lireObjetDansFichier: lireObjetDansFichier,
    lireTexteDansFichierBdd: lireTexteDansFichierBdd
};
export { FileUtils as FileUtils };
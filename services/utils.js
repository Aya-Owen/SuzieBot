// Requiring fs module in which
// readFile function is defined.
import * as fs from 'fs';

// ---------------------------
// --- LECTURE DE FICHIERS ---
// ---------------------------
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

// -------------
// --- UTILS ---
// -------------
function randomInListe(liste) {
    return liste[Math.floor(Math.random() * liste.length)];
}

function formatYMDtoFormatNormal(date) {
    const dateFormat = date.charAt(6) + date.charAt(7) + "/" + date.charAt(4) + date.charAt(5) + "/" + date.charAt(0) + date.charAt(1) + date.charAt(2) + date.charAt(3);
    return dateFormat;
}

function effacerMessage(guild, channedId, messageId) {
    guild.channels.fetch(channedId).then(channel => {
        channel.messages.fetch(messageId).then(msg => {
            msg.delete();
        }, error => { });
    }, error => { })
}

// liste des fonctions exportées
const Utils = {
    randomInListe: randomInListe,
    lireListeDansFichier: lireListeDansFichier,
    lireTexteDansFichier: lireTexteDansFichier,
    ecrireObjetDansFichier: ecrireObjetDansFichier,
    lireObjetDansFichier: lireObjetDansFichier,
    lireTexteDansFichierBdd: lireTexteDansFichierBdd,
    formatYMDtoFormatNormal: formatYMDtoFormatNormal,
    effacerMessage: effacerMessage
};
export { Utils as Utils };
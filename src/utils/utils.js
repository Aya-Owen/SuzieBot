import dateFormat from "dateformat";

// -------------
// --- UTILS ---
// -------------
const regexDate = /^\d\d\/\d\d$/;
const regexDateLongue = /^\d\d\/\d\d\/\d\d\d\d$/;

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

function getNextDateFromString(dateStr) {
    var annee, mois, jour;
    if (dateStr.match(regexDate)) {
        annee = new Date().getFullYear();
        mois = dateStr.charAt(3) + dateStr.charAt(4);
        jour = dateStr.charAt(0) + dateStr.charAt(1);
        // annee suivante si le mois sélectionné est déjà passé.
        if (new Date().getMonth() + 1 > mois) { ++annee; }
    } else if (dateStr.match(regexDateLongue)) {
        annee = dateStr.charAt(6) + dateStr.charAt(7) + dateStr.charAt(8) + dateStr.charAt(9);
        mois = dateStr.charAt(3) + dateStr.charAt(4);
        jour = dateStr.charAt(0) + dateStr.charAt(1);
    } else return;
    var date = new Date(annee + "/" + mois + "/" + jour);
    return date;
}

// liste des fonctions exportées
const Utils = {
    getNextDateFromString: getNextDateFromString,
    randomInListe: randomInListe,
    formatYMDtoFormatNormal: formatYMDtoFormatNormal,
    effacerMessage: effacerMessage
};
export { Utils as Utils };
import { TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import { Utils } from './utils.js';
import { Config } from "./config.js";
import moment from 'moment';

const regexChiffre = /\d/;
const regexDate = /\d\d\/\d\d/;

//------------------------------------
// --- APPEL DE CREATION DE MODALE ---
//------------------------------------

// modale de création de table
function makeModalAddTable() {
    const modal = new ModalBuilder().setCustomId('addTableModal').setTitle('Ajouter une nouvelle table');
    return fillTableModal(modal, null);
}

// modale de modification de table
function makeModalEditTable(valeursModale) {
    const modal = new ModalBuilder().setCustomId('editTableModal').setTitle('Modifier une table');
    return fillTableModal(modal, valeursModale);
}

// modale de suppression de table
function makeModalDeleteTable(valeursModale) {
    const modal = new ModalBuilder().setCustomId('deleteTableModal').setTitle('Modifier une table');
    return fillTableModal(modal, valeursModale);
}

// modale de choix de table -> suppression
function makeModalWhichDeleteTable(valeursModale) {
    const modal = new ModalBuilder().setCustomId('whichDeleteTableModal').setTitle('Supprimer une table');
    return whichTableModal(modal);
}

// modale de choix de table -> modification
function makeModalWhichEditTable(valeursModale) {
    const modal = new ModalBuilder().setCustomId('whichEditTableModal').setTitle('Modifier une table');
    return whichTableModal(modal);
}

//---------------------------
// --- CREATION DE MODALE ---
//---------------------------

// modale de création ou modification de table
function fillTableModal(modal, valeursModale) {
    // jour
    const tableDay = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableDay')
        .setLabel("Tu prévois ça pour quelle date ?")
        .setPlaceholder("Par exemple : \"31/12\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(5)
        .setMaxLength(5);

    // nom de la table
    const tableName = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableName')
        .setLabel("Quel jeu vas tu proposer ?")
        .setPlaceholder("Estoire ? DragonAge ? Ct'hul'hu ?")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(150);

    // ambiance de la table
    const tableGenre = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableGenre')
        .setLabel("Quel est le genre d'ambiance de ce jeu ?")
        .setPlaceholder("Médieval ? Fantastique ? Space Opéra ? Horreur ?")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(150);

    // min 
    const tableMin = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableMin')
        .setLabel("Combien de joueurs min ?")
        .setPlaceholder("Par exemple : \"2\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1);

    // max
    const tableMax = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableMax')
        .setLabel("Combien de joueurs max ?")
        .setPlaceholder("Par exemple : \"5\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1);

    // si on a déjà des infos à mettre dans la modale
    if (!!valeursModale) {
        if (!!valeursModale.tableDay) tableMax.setValue(valeursModale.tableDay);
        if (!!valeursModale.tableName) tableMax.setValue(valeursModale.tableName);
        if (!!valeursModale.tableGenre) tableMax.setValue(valeursModale.tableGenre);
        if (!!valeursModale.tableMin) tableMax.setValue(valeursModale.tableMin);
        if (!!valeursModale.tableMax) tableMax.setValue(valeursModale.tableMax);
    }

    const row1 = new ActionRowBuilder().addComponents(tableDay);
    const row2 = new ActionRowBuilder().addComponents(tableName);
    const row3 = new ActionRowBuilder().addComponents(tableGenre);
    const row4 = new ActionRowBuilder().addComponents(tableMin);
    const row5 = new ActionRowBuilder().addComponents(tableMax);

    modal.addComponents(row1, row2, row3, row4, row5);
    return modal;
}

// modale de sélection de table
function whichTableModal(modal) {
    // jour
    const tableDay = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableDay')
        .setLabel("Sur quelle date est prévue cette table ?")
        .setPlaceholder("Par exemple : \"31/12\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(5)
        .setMaxLength(5);

    // nom de la table
    const tableNumber = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableNumber')
        .setLabel("Le numéro de la table ?")
        .setPlaceholder("Exemple : 3")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(150);

    const row1 = new ActionRowBuilder().addComponents(tableDay);
    const row2 = new ActionRowBuilder().addComponents(tableNumber);

    modal.addComponents(row1, row2);
    return modal;
}


//--------------
// --- AUTRE ---
//--------------

function enregistrerTables(interaction) {
    const fieldDate = interaction.fields.getField("tableDay").value;
    const fieldMin = interaction.fields.getField("tableMin").value;
    const fieldMax = interaction.fields.getField("tableMax").value;

    // ------------------------
    // --- GESTION D'ERREUR ---
    // ------------------------

    // on vérifie le format des valeurs récupérées
    var dateOk = fieldDate.match(regexDate);
    const minOk = fieldMin.match(regexChiffre);
    const maxOk = fieldMax.match(regexChiffre);
    const minMaxOk = (minOk && maxOk) ? parseInt(minOk) <= parseInt(maxOk) : false;
    var annee = new Date().getFullYear();
    var mois = fieldDate.charAt(3) + fieldDate.charAt(4);
    var jour = fieldDate.charAt(0) + fieldDate.charAt(1);

    // annee suivante si le mois sélectionné est déjà passé.
    if (new Date().getMonth() > mois) { ++annee; }

    // on cherche les pb de date
    try {
        var dateString = jour + "/" + mois + "/" + annee;
        var dateMomentObject = moment(dateString, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
        var date = dateMomentObject.toDate(); // convert moment.js object to Date object
        dateOk = !(isNaN(date));
    } catch (e) {
        dateOk = false;
    }

    if (!(dateOk && minOk && maxOk && minMaxOk)) {
        var messageErreur = "Enregistrement de la table impossible. Il y a une erreur dans les infos fournies :";
        if (!dateOk) { messageErreur += "\n - la date " + fieldDate + " ne correspond pas au format JJ/MM." }
        if (!minOk) { messageErreur += "\n - le min " + fieldMin + " ne correspond pas à un chiffre." }
        if (!maxOk) { messageErreur += "\n - le max " + fieldMax + " ne correspond pas à un chiffre." }
        if (!minMaxOk) { messageErreur += "\n - le max " + fieldMax + " est inférieur au min " + fieldMin + "." }
        interaction.reply({ content: messageErreur, ephemeral: true });
        return;
    }

    // ----------------------
    // --- ENREGISTREMENT ---
    // ----------------------

    // on récupère les tables déjà existantes
    const dateFormatee = annee + mois + jour;
    var tablesExistantes = Utils.lireObjetDansFichier("tables_" + dateFormatee);
    if (!tablesExistantes) {
        tablesExistantes = { sequence: 1, idMessage: null, idChannel: null, tables: [] };
    }

    // on ajoute la nouvelle et on enregistre
    tablesExistantes.tables.push({
        nom: interaction.fields.getField("tableName").value,
        genre: interaction.fields.getField("tableGenre").value,
        min: fieldMin,
        max: fieldMax,
        user: interaction.user.username,
        userDiscriminator: interaction.user.discriminator,
        userId: interaction.user.id,
        sequenceId: (tablesExistantes.sequence ? tablesExistantes.sequence : 1)
    });
    // on incrémente l'id
    tablesExistantes.sequence = (tablesExistantes.sequence ? tablesExistantes.sequence + 1 : 2);
    Utils.ecrireObjetDansFichier("tables_" + dateFormatee, tablesExistantes);

    // --------------------------
    // --- RETOUR UTILISATEUR ---
    // --------------------------

    // on confirme à l'utilisateur
    interaction.reply({
        content: "Nouvelle table enregistrée : \n\""
            + interaction.fields.getField("tableName").value
            + "\" ("
            + interaction.fields.getField("tableGenre").value
            + "), le "
            + fieldDate
            + " pour de "
            + fieldMin
            + " à "
            + fieldMax
            + " personnes, menée par"
            + interaction.user.username
            + "#"
            + interaction.user.discriminator
            + " (" + (tablesExistantes.sequence - 1) + ")."
        , ephemeral: true
    });

    // si on a déjà affiché la table, on met à jour le message
    if (tablesExistantes.idChannel && tablesExistantes.idMessage) {
        interaction.guild.channels.fetch(tablesExistantes.idChannel).then(channel => {
            channel.messages.fetch(tablesExistantes.idMessage).then(message => {
                message.edit(messageTables(dateFormatee));
            });
        });
    }
}

function supprimerTable(interaction) {
    const fieldDate = interaction.fields.getField("tableDay").value;
    const fieldNum = interaction.fields.getField("tableNumber").value;


    // ------------------------
    // --- GESTION D'ERREUR ---
    // ------------------------

    // on vérifie le format des valeurs récupérées
    var dateOk = fieldDate.match(regexDate);
    const numOk = fieldNum.match(regexChiffre);

    var annee = new Date().getFullYear();
    var mois = fieldDate.charAt(3) + fieldDate.charAt(4);
    var jour = fieldDate.charAt(0) + fieldDate.charAt(1);

    // annee suivante si le mois sélectionné est déjà passé.
    if (new Date().getMonth() > mois) { ++annee; }

    // on cherche les pb de date
    try {
        var dateString = jour + "/" + mois + "/" + annee;
        var dateMomentObject = moment(dateString, "DD/MM/YYYY"); // 1st argument - string, 2nd argument - format
        var date = dateMomentObject.toDate(); // convert moment.js object to Date object
        dateOk = !(isNaN(date));
    } catch (e) {
        dateOk = false;
    }

    if (!(dateOk && numOk)) {
        var messageErreur = "Suppression de la table impossible. Il y a une erreur dans les infos fournies :";
        if (!dateOk) { messageErreur += "\n - la date " + fieldDate + " ne correspond pas au format JJ/MM." }
        if (!numOk) { messageErreur += "\n - le numéro " + fieldNum + " ne correspond pas à un chiffre." }
        interaction.reply({ content: messageErreur, ephemeral: true });
        return;
    }

    // ----------------------
    // --- ENREGISTREMENT ---
    // ----------------------

    // on récupère les tables déjà existantes
    const dateFormatee = annee + mois + jour;
    var tablesExistantes = Utils.lireObjetDansFichier("tables_" + dateFormatee);
    if (!tablesExistantes || tablesExistantes.tables.length == 0) {
        var messageErreur = "Erreur ! Aucune table trouvée à la date entrée !";
        interaction.reply({ content: messageErreur, ephemeral: true });
        return;
    }


    // on copie les tables existantes, sans celle ayant ce numéro
    var tablesConservees = [];
    var tableSupprimee = null;
    tablesExistantes.tables.forEach(table => {
        if (table.sequenceId != fieldNum) {
            tablesConservees.push(table);
        } else {
            if (!!tableSupprimee) console.log("Mmh, bizarre, deux tables appartenait à la même date et le même ID...");
            tableSupprimee = table;
        }
    });

    if (!tableSupprimee) {
        var messageErreur = "Erreur ! Sur cette date, aucune table trouvée pour ce numéro !";
        interaction.reply({ content: messageErreur, ephemeral: true });
        return;
    }

    if (tableSupprimee.userId !== interaction.user.id && !interaction.member._roles.includes(Config.roleSuppressionTableId)) {
        var messageErreur = "Erreur ! Cette table appartient à quelqu'un d'autre ! Demandez à un membre du CA de la supprimer.";
        interaction.reply({ content: messageErreur, ephemeral: true });
        return;
    }


    tablesExistantes.tables = tablesConservees;
    Utils.ecrireObjetDansFichier("tables_" + dateFormatee, tablesExistantes);

    // --------------------------
    // --- RETOUR UTILISATEUR ---
    // --------------------------

    // on confirme à l'utilisateur
    interaction.reply({
        content: "Table supprimée : \n\""
            + tableSupprimee.nom
            + "\" ("
            + tableSupprimee.genre
            + "), le "
            + fieldDate
            + " pour de "
            + tableSupprimee.min
            + " à "
            + tableSupprimee.max
            + " personnes, menée par"
            + tableSupprimee.user
            + "#"
            + tableSupprimee.userDiscriminator
            + " (" + tableSupprimee.sequenceId + ")."
        , ephemeral: true
    });

    // si on a déjà affiché la table, on met à jour le message
    if (tablesExistantes.idChannel && tablesExistantes.idMessage) {
        interaction.guild.channels.fetch(tablesExistantes.idChannel).then(channel => {
            channel.messages.fetch(tablesExistantes.idMessage).then(message => {
                message.edit(messageTables(dateFormatee));
            });
        });
    }

}

function messageTables(date) {
    var infos = Utils.lireObjetDansFichier("tables_" + date);
    var reponse;

    if (infos && infos.tables && infos.tables.length > 0) {
        reponse = "Les tables prévues pour la date du " + Utils.formatYMDtoFormatNormal(date) + " sont :";

        infos.tables.forEach(element => {
            reponse += "\n - \"" + element.nom + "\"";
            if (element.genre && element.genre.length > 0) { reponse += " (" + element.genre + ")"; }

            reponse += ",  pour de " + element.min + " à " + element.max
                + " personnes, menée par " + element.user + "#" + element.userDiscriminator + " (" + (element.sequenceId) + ")" + "."
        });

    } else {
        reponse = "Aucune table n'est prévue pour la date du " + Utils.formatYMDtoFormatNormal(date);
    }
    return reponse;
}

function enregistrerMessageId(date, message) {
    var infos = Utils.lireObjetDansFichier("tables_" + date);
    if (!infos) {
        infos = {
            tables: []
        }
    } else {
        // on supprime le message précédent
        if (!!infos.idChannel && !!infos.idMessage) {
            Utils.effacerMessage(message.guild, infos.idChannel, infos.idMessage);
        }
        /*message.channel.messages.fetch(infos.idMessage).then(msg => {
            console.log(msg);
        });*/
    }

    // on met à jour avec les infos du nouveau message
    infos.idMessage = message.id;
    infos.idChannel = message.channelId;
    Utils.ecrireObjetDansFichier("tables_" + date, infos);
}

function afficherTables(interaction) {
    var dateJour = new Date();
    // Samedi
    const nextSamedi = new Date();
    nextSamedi.setDate(dateJour.getDate() + (7 + 7 - dateJour.getDay()) % 7)

    const dateSamedi = nextSamedi.getFullYear().toString().padStart(4, "0")
        + (nextSamedi.getMonth() + 1).toString().padStart(2, "0")
        + (nextSamedi.getDate() - 1).toString().padStart(2, "0");
    var reponse = messageTables(dateSamedi);
    interaction.channel.send(reponse).then(message => TableUtils.enregistrerMessageId(dateSamedi, message));

    // Dimanche
    const nextDimanche = new Date();
    nextDimanche.setDate(nextSamedi.getDate() + 1)

    const dateDimanche = nextDimanche.getFullYear().toString().padStart(4, "0")
        + (nextDimanche.getMonth() + 1).toString().padStart(2, "0")
        + (nextDimanche.getDate() - 1).toString().padStart(2, "0");
    reponse = messageTables(dateDimanche);
    interaction.channel.send(reponse).then(message => TableUtils.enregistrerMessageId(dateDimanche, message));

    // confirmation d'affichage
    interaction.reply({ content: "Les tables du week end ont été affichées.", ephemeral: true });
    interaction.deleteReply();
}

// liste des fonctions exportées
const TableUtils = {
    // création de modales
    makeModalAddTable: makeModalAddTable,
    makeModalEditTable: makeModalEditTable,
    makeModalDeleteTable: makeModalDeleteTable,
    makeModalWhichDeleteTable: makeModalWhichDeleteTable,
    makeModalWhichEditTable: makeModalWhichEditTable,

    // execution des actions
    enregistrerTables: enregistrerTables,
    supprimerTable: supprimerTable,
    enregistrerMessageId: enregistrerMessageId,
    afficherTables: afficherTables
};
export { TableUtils as TableUtils };
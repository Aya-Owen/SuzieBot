import { TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';
import { Utils } from '../utils/utils.js';
import { FileUtils } from '../utils/file.utils.js';
import { ModalUtils } from '../utils/modal.utils.js';
import { Config } from "../utils/load/config.js";
import dateFormat from "dateformat";

const regexChiffre = /\d/;


//------------------------------------
// ----------- APPEL SLASH -----------
//------------------------------------
async function modaleCreateTable(interaction) {
    const modal = ModalUtils.makeModalAddTable();
    await interaction.showModal(modal);
}

async function modaleEditTable(interaction) {
    const fieldDate = interaction.options.getString('date') ? interaction.options.getString('date').trim() : null;
    const fieldNum = interaction.options.getString('numerotable') ? interaction.options.getString('numerotable').trim() : null;
    const fichier = verificationTableExistante(fieldDate, fieldNum);

    if (!!fichier) {
        var infos = FileUtils.lireObjetDansFichier(fichier);
        const table = infos.tables.filter(t => t.sequenceId == fieldNum)[0];
        const modal = ModalUtils.makeModalEditTable(table);
        if (!modal) { return; }
        console.log(modal);
        await interaction.showModal(modal);

        // Get the Modal Submit Interaction that is emitted once the User submits the Modal
        const submitted = await interaction.awaitModalSubmit({

            // Timeout after a minute of not receiving any valid Modals
            time: 60000,
            // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
            filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
            // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
            console.error(error)
            return null
        })

        // If we got our Modal, we can do whatever we want with it down here. Remember that the Modal
        // can have multiple Action Rows, but each Action Row can have only one TextInputComponent. You
        // can use the ModalSubmitInteraction.fields helper property to get the value of an input field
        // from it's Custom ID. See https://discord.js.org/#/docs/discord.js/stable/class/ModalSubmitFieldsResolver for more info.
        if (submitted) {
            const data = {
                fichier: fichier,
                fieldDate: fieldDate,
                fieldNum: fieldNum,
                fieldMin: submitted.fields.getField("tableMin").value,
                fieldMax: submitted.fields.getField("tableMax").value,
                fieldName: submitted.fields.getField("tableName").value,
                fieldGenre: submitted.fields.getField("tableGenre").value
            }
            modifierTable(submitted, data);
        }
    } else {
        interaction.reply({ content: 'Cette table n\'existe pas !', ephemeral: true });
        return;
    }
}

async function supprimerTable(interaction) {
    const fieldDate = interaction.options.getString('date') ? interaction.options.getString('date').trim() : null;
    const fieldNum = interaction.options.getString('numerotable') ? interaction.options.getString('numerotable').trim() : null;
    const fichier = verificationTableExistante(fieldDate, fieldNum);

    if (!!fichier) {
        suppressionTable(fichier, fieldNum)
    } else {
        interaction.reply({ content: 'Cette table n\'existe pas !', ephemeral: true });
        return;
    }
}


function verificationTableExistante(fieldDate, fieldNum) {
    const date = Utils.getNextDateFromString(fieldDate);
    var dateOk = !!date && !(isNaN(date));

    if (dateOk) {
        // vérification de l'existence de la table
        const dateFormatee = dateFormat(date, "yyyymmdd");
        var infos = FileUtils.lireObjetDansFichier("tables_" + dateFormatee);
        if (!!infos) {
            const tables = infos.tables.filter(t => t.sequenceId == fieldNum);

            if (tables.length != 0) {
                return "tables_" + dateFormatee;
            }
        }
    }

    return;
}


//--------------
// --- AUTRE ---
//--------------

function enregistrerTables(interaction) {
    const fieldDate = interaction.fields.getField("tableDay").value;
    const fieldMin = interaction.fields.getField("tableMin").value;
    const fieldMax = interaction.fields.getField("tableMax").value;
    const fieldName = interaction.fields.getField("tableName").value;
    const fieldGenre = interaction.fields.getField("tableGenre").value;

    // ------------------------
    // --- GESTION D'ERREUR ---
    // ------------------------

    // on vérifie le format des valeurs récupérées
    const minOk = fieldMin.match(regexChiffre);
    const maxOk = fieldMax.match(regexChiffre);
    const minMaxOk = (minOk && maxOk) ? parseInt(minOk) <= parseInt(maxOk) : false;

    // date
    var date = Utils.getNextDateFromString(fieldDate);
    var dateOk = !!date;
    var dateTiming = true;

    // on cherche les pb de date
    if (dateOk) {

        try {
            dateOk = !(isNaN(date));
            if (dateOk) {
                // date avant la date du jour
                dateTiming = !(new Date(date.toDateString()) < new Date(new Date().toDateString()));
            }
        } catch (e) {
            dateOk = false;
        }
    }

    if (!(dateOk && dateTiming && minOk && maxOk && minMaxOk)) {
        var messageErreur = "Enregistrement de la table impossible. Il y a une erreur dans les infos fournies :";
        if (!dateOk) { messageErreur += "\n - la date " + fieldDate + " ne correspond pas au format JJ/MM ou JJ/MM/AAAA." }
        if (!dateTiming) { messageErreur += "\n - la date " + fieldDate + " est déjà passée." }
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
    const dateFormatee = dateFormat(date, "yyyymmdd");
    var tablesExistantes = FileUtils.lireObjetDansFichier("tables_" + dateFormatee);
    if (!tablesExistantes) {
        tablesExistantes = { sequence: 1, idMessage: null, idChannel: null, tables: [] };
    }

    // on ajoute la nouvelle et on enregistre
    tablesExistantes.tables.push({
        nom: fieldName,
        genre: fieldGenre,
        min: fieldMin,
        max: fieldMax,
        user: interaction.user.username,
        userDiscriminator: interaction.user.discriminator,
        userId: interaction.user.id,
        sequenceId: (tablesExistantes.sequence ? tablesExistantes.sequence : 1)
    });
    // on incrémente l'id
    tablesExistantes.sequence = (tablesExistantes.sequence ? tablesExistantes.sequence + 1 : 2);
    FileUtils.ecrireObjetDansFichier("tables_" + dateFormatee, tablesExistantes);

    // --------------------------
    // --- RETOUR UTILISATEUR ---
    // --------------------------

    // on confirme à l'utilisateur
    interaction.reply({
        content: "Nouvelle table enregistrée : \n\""
            + fieldName
            + "\" ("
            + fieldGenre
            + "), le "
            + fieldDate
            + " pour de "
            + fieldMin
            + " à "
            + fieldMax
            + " personnes, menée par "
            + interaction.user.username
            + " (référence de la table : " + (tablesExistantes.sequence - 1) + ")."
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

function modifierTable(interaction, data) {
    // ----------------------
    // --- ENREGISTREMENT ---
    // ----------------------
    // on récupère les tables déjà existantes
    var tablesExistantes = FileUtils.lireObjetDansFichier(data.fichier);
    // on ajoute la nouvelle et on enregistre
    tablesExistantes.tables.forEach(table => {
        if (table.sequenceId == data.fieldNum) {
            table.nom = data.fieldName;
            table.genre = data.fieldGenre;
            table.min = data.fieldMin;
            table.max = data.fieldMax;
        }
    });
    FileUtils.ecrireObjetDansFichier(data.fichier, tablesExistantes);

    // --------------------------
    // --- RETOUR UTILISATEUR ---
    // --------------------------

    // on confirme à l'utilisateur
    interaction.reply({
        content: "Table modifiée : \n\""
            + data.fieldName
            + "\" ("
            + data.fieldGenre
            + "), le "
            + data.fieldDate
            + " pour de "
            + data.fieldMin
            + " à "
            + data.fieldMax
            + " personnes, menée par "
            + interaction.user.username
            + " (référence de la table : " + data.fieldNum + ")."
        , ephemeral: true
    });

    // si on a déjà affiché la table, on met à jour le message
    if (tablesExistantes.idChannel && tablesExistantes.idMessage) {
        interaction.guild.channels.fetch(tablesExistantes.idChannel).then(channel => {
            channel.messages.fetch(tablesExistantes.idMessage).then(message => {
                var annee = new Date().getFullYear();
                var mois = data.fieldDate.charAt(3) + data.fieldDate.charAt(4);
                var jour = data.fieldDate.charAt(0) + data.fieldDate.charAt(1);
                // annee suivante si le mois sélectionné est déjà passé.
                if (new Date().getMonth() > mois) { ++annee; }
                const dateFormatee = annee + mois + jour;

                message.edit(messageTables(dateFormatee));
            });
        });
    }
}


function suppressionTable(fichier, fieldNum) {
    var tablesExistantes = FileUtils.lireObjetDansFichier(fichier);
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
    FileUtils.ecrireObjetDansFichier(fichier, tablesExistantes);

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
            + " personnes, menée par "
            + tableSupprimee.user
            + " (référence de la table : " + tableSupprimee.sequenceId + ")."
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
    var infos = FileUtils.lireObjetDansFichier("tables_" + date);
    var reponse;

    if (infos && infos.tables && infos.tables.length > 0) {
        reponse = "Les tables prévues pour la date du " + Utils.formatYMDtoFormatNormal(date) + " sont :";

        infos.tables.forEach(element => {
            reponse += "\n - \"" + element.nom + "\"";
            if (element.genre && element.genre.length > 0) { reponse += " (" + element.genre + ")"; }

            reponse += ",  pour de " + element.min + " à " + element.max
                + " personnes, menée par " + element.user + " (référence de la table : " + (element.sequenceId) + ")" + "."
        });

    } else {
        reponse = "Aucune table n'est prévue pour la date du " + Utils.formatYMDtoFormatNormal(date);
    }
    return reponse;
}

function enregistrerMessageId(date, message) {
    var infos = FileUtils.lireObjetDansFichier("tables_" + date);
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
    FileUtils.ecrireObjetDansFichier("tables_" + date, infos);
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
    nextDimanche.setDate(dateJour.getDate() + (8 + 7 - dateJour.getDay()) % 7)

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
    // appel slash
    modaleCreateTable: modaleCreateTable,
    modaleEditTable: modaleEditTable,
    supprimerTable: supprimerTable,

    // execution des actions
    enregistrerTables: enregistrerTables,
    modifierTable: modifierTable,
    enregistrerMessageId: enregistrerMessageId,
    afficherTables: afficherTables
};
export { TableUtils as TableUtils };
import { TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle, StringSelectMenuBuilder } from 'discord.js';
import { StringSelectMenuOptionBuilder } from '@discordjs/builders';
import { Utils } from './utils.js';
import moment from 'moment';

const regexChiffre = /\d/;
const regexDate = /\d\d\/\d\d/;


// modale supplémentaire pour donner des détails
function makeModalAddTable() {
    const modal = new ModalBuilder().setCustomId('addTableModal')
        .setTitle('Ajouter une nouvelle table');

    // jour
    const tableDay = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableDay')
        .setLabel("Tu prévois ça pour quelle date ?")
        .setPlaceholder("Par exemple : \"31/12\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(5)
        .setMaxLength(5);

    // 1. nom de la table
    const tableName = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableName')
        .setLabel("Quel jeu vas tu proposer ?")
        .setPlaceholder("Estoire ? DragonAge ? Ct'hul'hu ?")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(150);

    // 2. ambiance de la table
    const tableGenre = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableGenre')
        .setLabel("Quel est le genre d'ambiance de ce jeu ?")
        .setPlaceholder("Médieval ? Fantastique ? Space Opéra ? Horreur ?")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(150);

    // 1. min 
    const tableMin = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableMin')
        .setLabel("Combien de joueurs min ?")
        .setPlaceholder("Par exemple : \"2\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1);

    // 1. max
    const tableMax = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableMax')
        .setLabel("Combien de joueurs max ?")
        .setPlaceholder("Par exemple : \"5\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1);

    const row1 = new ActionRowBuilder().addComponents(tableDay);
    const row2 = new ActionRowBuilder().addComponents(tableName);
    const row3 = new ActionRowBuilder().addComponents(tableGenre);
    const row4 = new ActionRowBuilder().addComponents(tableMin);
    const row5 = new ActionRowBuilder().addComponents(tableMax);

    modal.addComponents(row1, row2, row3, row4, row5);
    return modal;
}

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
        tablesExistantes = { idMessage: null, idChannel: null, tables: [] };
    }

    // on ajoute la nouvelle et on enregistre
    tablesExistantes.tables.push({
        nom: interaction.fields.getField("tableName").value,
        genre: interaction.fields.getField("tableGenre").value,
        min: fieldMin,
        max: fieldMax,
        user: interaction.user.username,
        userDiscriminator: interaction.user.discriminator
    });
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
            + "."
        , ephemeral: true
    });
    interaction.deleteReply();

    // si on a déjà affiché la table, on met à jour le message
    if (tablesExistantes.idChannel && tablesExistantes.idMessage) {
        console.log(interaction.guild.channels);
        interaction.guild.channels.fetch(tablesExistantes.idChannel).then(channel => {
            channel.messages.fetch(tablesExistantes.idMessage).then(message => {
                message.edit(afficherTables(dateFormatee));
            });
        });
    }
}

function afficherTables(date) {
    var infos = Utils.lireObjetDansFichier("tables_" + date);
    var reponse;

    if (infos && infos.tables && infos.tables.length > 0) {
        reponse = "Les tables prévues pour la date du " + Utils.formatYMDtoFormatNormal(date) + " sont :";

        infos.tables.forEach(element => {
            reponse += "\n - \"" + element.nom + "\"";
            if (element.genre && element.genre.length > 0) { reponse += " (" + element.genre + ")"; }

            reponse += ",  pour de " + element.min + " à " + element.max
                + " personnes, menée par " + element.user + "#" + element.userDiscriminator + "."
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
            console.log("ancien message  : " + infos.idChannel + " " + infos.idMessage);
            effacerMessage(message.guild, infos.idChannel, infos.idMessage);
        }
        /*message.channel.messages.fetch(infos.idMessage).then(msg => {
            console.log(msg);
        });*/
    }

    // on met à jour avec les infos du nouveau message
    infos.idMessage = message.id;
    infos.idChannel = message.channelId;
    console.log("nouveau message : " + infos.idChannel + " " + infos.idMessage);
    console.log(infos);
    Utils.ecrireObjetDansFichier("tables_" + date, infos);
}

function effacerMessage(guild, channedId, messageId) {
    guild.channels.fetch(channedId).then(channel => {
        channel.messages.fetch(messageId).then(msg => {
            msg.delete();
        }, error => { });
    }, error => { })
}

// liste des fonctions exportées
const TableUtils = {
    makeModalAddTable: makeModalAddTable,
    enregistrerTables: enregistrerTables,
    enregistrerMessageId: enregistrerMessageId,
    afficherTables: afficherTables
};
export { TableUtils as TableUtils };
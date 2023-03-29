import { TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } from 'discord.js';

// modale de création de table
function makeModalAddTable() {
    const modal = new ModalBuilder().setCustomId('addTableModal').setTitle('Ajouter une nouvelle table');
    return fillTableModalAdd(modal);
}

// modale de modification de table
function makeModalEditTable(valeursModale) {
    const modal = new ModalBuilder().setCustomId('editTableModal').setTitle('Modifier une table');
    return fillTableModalEdit(modal, valeursModale);
}

//---------------------------
// --- CREATION DE MODALE ---
//---------------------------

// modale de création de table
function fillTableModalAdd(modal) {
    // jour
    const tableDay = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableDay')
        .setLabel("Tu prévois ça pour quelle date ?")
        .setPlaceholder("Par exemple : \"31/12\" ou \"02/03/2023\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(5)
        .setMaxLength(10);

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
        .setMaxLength(150);

    // min 
    const tableMin = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableMin')
        .setLabel("Combien de joueurs min ?")
        .setPlaceholder("Par exemple : \"2\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1);

    // max
    const tableMax = new TextInputBuilder()
        .setRequired(true)
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
// modale de modification de table
function fillTableModalEdit(modal, valeursModale) {
    console.log(valeursModale);

    // nom de la table
    const tableName = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableName')
        .setLabel("Quel jeu vas tu proposer ?")
        .setPlaceholder("Estoire ? DragonAge ? Ct'hul'hu ?")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(150).setValue(valeursModale.nom);

    // ambiance de la table
    const tableGenre = new TextInputBuilder()
        .setRequired(false)
        .setCustomId('tableGenre')
        .setLabel("Quel est le genre d'ambiance de ce jeu ?")
        .setPlaceholder("Médieval ? Fantastique ? Space Opéra ? Horreur ?")
        .setStyle(TextInputStyle.Short)
        .setMaxLength(150);
    if (!!valeursModale.genre) { tableGenre.setValue(valeursModale.genre); }

    // min 
    const tableMin = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableMin')
        .setLabel("Combien de joueurs min ?")
        .setPlaceholder("Par exemple : \"2\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1).setValue(valeursModale.min);

    // max
    const tableMax = new TextInputBuilder()
        .setRequired(true)
        .setCustomId('tableMax')
        .setLabel("Combien de joueurs max ?")
        .setPlaceholder("Par exemple : \"5\"")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1).setValue(valeursModale.max);

    const row2 = new ActionRowBuilder().addComponents(tableName);
    const row3 = new ActionRowBuilder().addComponents(tableGenre);
    const row4 = new ActionRowBuilder().addComponents(tableMin);
    const row5 = new ActionRowBuilder().addComponents(tableMax);
    modal.addComponents(row2, row3, row4, row5);
    return modal;
}


// liste des fonctions exportées
const ModalUtils = {
    makeModalAddTable: makeModalAddTable,
    makeModalEditTable: makeModalEditTable
};
export { ModalUtils as ModalUtils };
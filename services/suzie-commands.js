import { SlashCommandBuilder } from 'discord.js';
import { Utils } from './utils.js';
import { InventaireUtils } from './inventaire.utils.js';
import { TableUtils } from './table.utils.js';
import { SuzieMessage } from "./reponses.js"

// -------------------------------------------------
// --- LISTER LES RECEPTION DE RETOUR DE MODALES ---
// -------------------------------------------------
const retourModaleDefinition = [
  { name: 'addTableModal', fonction: TableUtils.enregistrerTables },
  { name: 'editTableModal', fonction: TableUtils.modifierTable },
  { name: 'whichDeleteTableModal', fonction: TableUtils.supprimerTable },
  { name: 'whichEditTableModal', fonction: TableUtils.preciserMidificationTable },
];

// ----------------------------------
// --- LISTER LES COMMANDES SLASH ---
// ----------------------------------
const slashCommandsDefinition = [
  { name: 'ajoutertable', description: 'Prévoir une table pour un prochain weekend.', fonction: cmdSlashAjouterTable },
  { name: 'supprimertable', description: 'Supprimer une de tes tables existantes.', fonction: cmdSlashSupprimerTable },
  { name: 'modifiertable', description: 'Modifier une table déjà prévue.', fonction: cmdSlashModifiertable },

  { name: 'afficherprochainestables', description: 'Afficher les tables prévues pour bientôt.', fonction: cmdSlashAfficherTable },
  { name: 'affichermestables', description: 'Afficher les tables futures que tu as prévues.', fonction: cmdSlashAfficherTable },
  { name: 'afficherfuturestables', description: 'Afficher toutes les tables futures.', fonction: cmdSlashAfficherTable },

  { name: 'inventairejds', description: 'Lister l\'inventaire des jeux de société de l\'asso', fonction: cmdSlashInventaireJds },
  { name: 'inventairejdr', description: 'Lister l\'inventaire des jeux de rôle de l\'asso', fonction: cmdSlashInventaireJdr },
];


const slashCommands = [];
slashCommandsDefinition.forEach(commande => {
  const newCommande = new SlashCommandBuilder()
    .setName(commande.name)
    .setDescription(commande.description);

  // ajout des options
  if (commande.options) {
    commande.options.forEach(option => {
      newCommande.AddOption(option.name, option.type, option.description, option.required)
    });
  }

  slashCommands.push({
    data: newCommande,
    async execute(interaction) {
      commande.fonction(interaction);
    },
  })
});


// ----------------------------
// --- LISTER LES REACTIONS ---
// ----------------------------
const typesReaction = { MOT_CONTENU: "MOT_CONTENU", MOT_EXACT: "MOT_EXACT", MOT_COMMENCE: "MOT_COMMENCE" };
const reactions = {
  avecAppel: [
    { terme: ["help", "aide"], type: [typesReaction.MOT_EXACT], fonction: cmdHelp },
    { terme: ["merci", "danke", "thank"], type: [typesReaction.MOT_COMMENCE], fonction: cmdMerci },
    { terme: ["dis "], type: [typesReaction.MOT_COMMENCE], fonction: cmdRepete },
    {
      terme: ["bonjour", "hello", "salut", "hi", "salutation", "salutations", "hey", "coucou", "hola"],
      type: [typesReaction.MOT_EXACT], fonction: cmdBonjour
    },
    {
      terme: ["que penses tu d", "que penses-tu d", "tu connais", "qu'est ce que tu penses d"],
      type: [typesReaction.MOT_CONTENU], fonction: cmdOpinion
    }
  ],
  sansAppel: [
    // sans appel
    { terme: [" di", " dy"], type: [typesReaction.MOT_CONTENU], fonction: cmdDi },
    { terme: ["😢", "T_T", ":(", ":'(", "='(", "=(", ":c", "=c", "😦"], type: [typesReaction.MOT_EXACT], fonction: cmdCheh },
    { terme: ["j'ai perdu"], type: [typesReaction.MOT_CONTENU], fonction: cmdPerdu },
    { terme: ["livre", "book", "bouquin", "bibliothèque", "librairie"], type: [typesReaction.MOT_CONTENU], fonction: cmdReactLivre }
  ],
};


// ------------------------------
// --- COMMANDES ENREGISTREES ---
// ------------------------------

// reactions
function cmdHelp(message) { message.channel.send(SuzieMessage.Help); }
function cmdMerci(message) { message.channel.send(Utils.randomInListe(SuzieMessage.DeRien)); }
function cmdRepete(message) { repete(message); }
function cmdDi(message) { findDi(message); }
function cmdBonjour(message) { message.channel.send(Utils.randomInListe(SuzieMessage.Salutations)); }
function cmdOpinion(message) { message.channel.send("Opinion !"); }
function cmdCheh(message) { message.reply("CHEH"); }
function cmdPerdu(message) { message.reply("J'ai perdu !"); }
function cmdReactLivre(message) { message.react(Utils.randomInListe(['📔', '📖', '📚'])); }

// commandes
function cmdSlashAfficherTable(interaction) { cmdVoirTable(interaction); }
function cmdSlashAjouterTable(interaction) { modaleCreateTable(interaction); }
function cmdSlashSupprimerTable(interaction) { modaleWhichDeleteTable(interaction); }
function cmdSlashModifiertable(interaction) { modaleWhichEditTable(interaction); }
function cmdSlashInventaireJds(interaction) { inventaireInteraction(interaction, InventaireUtils.Types.JDS); }
function cmdSlashInventaireJdr(interaction) { inventaireInteraction(interaction, InventaireUtils.Types.JDR); }





// ----------------------------
// --- FONCTIONS A EXECUTER ---
// ----------------------------

async function modaleCreateTable(interaction) {
  const modal = TableUtils.makeModalAddTable();
  await interaction.showModal(modal);
}

async function modaleEditTable(table) {
  const modal = TableUtils.makeModalEditTable(table);
  await interaction.showModal(modal);
}

async function modaleWhichDeleteTable(interaction) {
  const modal = TableUtils.makeModalWhichDeleteTable();
  await interaction.showModal(modal);
}

async function modaleWhichEditTable(interaction) {
  const modal = TableUtils.makeModalWhichEditTable();
  await interaction.showModal(modal);
}

function findDi(message) {
  const mots = message.content.replace(/(,|\.|:|\\|-|'|;|\/|\?)/g, ' ').split(' ');
  const motsReponse = [];
  mots.forEach((mot) => {
    if (mot.toUpperCase().startsWith("DI") || mot.toUpperCase().startsWith("DY")) {
      if (mot.substring(2).length > 3) {
        motsReponse.push(mot.substring(2));
      }
    }
  });

  if (motsReponse.length > 0 && message.content.length < 200) {
    message.reply(Utils.randomInListe(motsReponse));
  }
}

function inventaireInteraction(interaction, type) {
  const action = "";
  const code = "";
  const inventaire = InventaireUtils.getInventaire(type);
  const listeGamme = InventaireUtils.getListeGamme(inventaire);
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

function repete(message) {
  const finDis = message.content.indexOf("dis ") + 4;
  let messageFinal = new String(message.content);
  messageFinal = messageFinal.substring(finDis).trim();
  message.channel.send(messageFinal);
}



function cmdVoirTable(interaction) {
  TableUtils.afficherTables(interaction);
}

function cmdAjouterLivre(message) {
  message.channel.send("TODO");
}

function cmdSupprimerLivre(message) {
  message.channel.send("TODO");
}

export {
  retourModaleDefinition as RetourModaleDefinition,
  slashCommands as SlashCommands,
  reactions as Reactions,
  typesReaction as TYPES
};
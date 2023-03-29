import { Config } from "../utils/load/config.js";
import { Utils } from '../utils/utils.js';
import { InventaireUtils } from '../service/inventaire.service.js';
import { TableUtils } from '../service/table.service.js';
import { SuzieMessage } from "../utils/load/reponses.js"

// -------------------------------------------------
// --- LISTER LES RECEPTION DE RETOUR DE MODALES ---
// -------------------------------------------------
const retourModaleDefinition = [
  { name: 'addTableModal', fonction: TableUtils.enregistrerTables },
  //{ name: 'editTableModal', fonction: TableUtils.enregistrerModificationTable },
  { name: 'whichDeleteTableModal', fonction: TableUtils.supprimerTable },
];


// ----------------------------------
// --- LISTER LES COMMANDES SLASH ---
// ----------------------------------
const slashCommandsDefinition = [
  { name: 'ajoutertable', description: 'Prévoir une table pour un prochain weekend.', fonction: cmdSlashAjouterTable },
  { name: 'supprimertable', description: 'Supprimer une de tes tables existantes.', fonction: cmdSlashSupprimerTable },
  {
    name: 'modifiertable', description: 'Modifier une table déjà prévue.', fonction: cmdSlashModifiertable, options: [
      { name: "date", description: "La date prévue (jj/mm)", required: true },
      { name: "numerotable", description: "Le numéro de la table", required: true }
    ]
  },

  { name: 'afficherprochainestables', description: 'Afficher les tables prévues pour bientôt.', fonction: cmdSlashAfficherTable },
  { name: 'affichermestables', description: 'Afficher les tables futures que tu as prévues.', fonction: cmdSlashAfficherTable },
  { name: 'afficherfuturestables', description: 'Afficher toutes les tables futures.', fonction: cmdSlashAfficherTable },

  {
    name: 'inventaire', description: 'Lister l\'inventaire', fonction: cmdSlashInventaire, options: [
      { name: "categorie", description: "La catégorie à afficher", required: false },
      { name: "gamme", description: "La gamme à afficher", required: false }
    ]
  },
  { name: 'inventairejds', description: 'Lister l\'inventaire des jeux de société de l\'asso', fonction: cmdSlashInventaireJds },
  { name: 'inventairejdr', description: 'Lister l\'inventaire des jeux de rôle de l\'asso', fonction: cmdSlashInventaireJdr },
];


// ----------------------------
// --- LISTER LES REACTIONS ---
// ----------------------------
const typesReaction = { MOT_CONTENU: "MOT_CONTENU", MOT_EXACT: "MOT_EXACT", MOT_COMMENCE: "MOT_COMMENCE" };
const reactionsDefinition = {
  avecAppel: [
    { name: "help", terme: ["help", "aide"], type: [typesReaction.MOT_EXACT], fonction: cmdHelp },
    { name: "merci", terme: ["merci", "danke", "thank"], type: [typesReaction.MOT_COMMENCE], fonction: cmdMerci },
    { name: "dis", terme: ["dis "], type: [typesReaction.MOT_COMMENCE], fonction: cmdRepete },
    {
      name: "bonjour",
      terme: ["bonjour", "hello", "salut", "hi", "salutation", "salutations", "hey", "coucou", "hola"],
      type: [typesReaction.MOT_EXACT], fonction: cmdBonjour
    },
    {
      name: "opinion",
      terme: ["que penses tu d", "que penses-tu d", "tu connais", "qu'est ce que tu penses d"],
      type: [typesReaction.MOT_CONTENU], fonction: cmdOpinion
    }
  ],
  sansAppel: [
    // sans appel
    { name: "di", terme: [" di", " dy"], type: [typesReaction.MOT_CONTENU], fonction: cmdDi },
    { name: "sad", terme: ["😢", "T_T", ":(", ":'(", "='(", "=(", ":c", "=c", "😦"], type: [typesReaction.MOT_EXACT], fonction: cmdCheh },
    { name: "perdu", terme: ["j'ai perdu"], type: [typesReaction.MOT_CONTENU], fonction: cmdPerdu },
    { name: "livre", terme: ["livre", "book", "bouquin", "bibliothèque", "librairie"], type: [typesReaction.MOT_CONTENU], fonction: cmdReactLivre }
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
function cmdSlashAfficherTable(interaction) { TableUtils.afficherTables(interaction); }
function cmdSlashAjouterTable(interaction) { TableUtils.modaleCreateTable(interaction); }
function cmdSlashSupprimerTable(interaction) { TableUtils.supprimerTable(interaction); }
function cmdSlashModifiertable(interaction) { TableUtils.modaleEditTable(interaction); }
function cmdSlashInventaire(interaction) { InventaireUtils.inventaire(interaction); }
function cmdSlashInventaireJds(interaction) { InventaireUtils.inventaireInteraction(interaction, InventaireUtils.Types.JDS); }
function cmdSlashInventaireJdr(interaction) { InventaireUtils.inventaireInteraction(interaction, InventaireUtils.Types.JDR); }





// ----------------------------
// --- FONCTIONS A EXECUTER ---
// ----------------------------

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

function repete(message) {
  const finDis = message.content.indexOf("dis ") + 4;
  let messageFinal = new String(message.content);
  messageFinal = messageFinal.substring(finDis).trim();
  message.channel.send(messageFinal);
}

function cmdAjouterLivre(message) {
  message.channel.send("TODO");
}

function cmdSupprimerLivre(message) {
  message.channel.send("TODO");
}

// filtrer les commandes activées ou non
var retourModaleDefinitionFiltree = retourModaleDefinition.filter(def => (Config.commandes.retourModale[def.name]));
var slashCommandsDefinitionFiltree = slashCommandsDefinition.filter(def => (Config.commandes.slashCommands[def.name]));
var reactionsDefinitionFiltree = {
  avecAppel: reactionsDefinition.avecAppel.filter(def => (Config.commandes.reactions[def.name])),
  sansAppel: reactionsDefinition.sansAppel.filter(def => (Config.commandes.reactions[def.name]))
};

export {
  retourModaleDefinitionFiltree as RetourModaleDefinition,
  slashCommandsDefinitionFiltree as SlashCommandsDefinition,
  reactionsDefinitionFiltree as ReactionsDefinition,
  typesReaction as TYPES
};
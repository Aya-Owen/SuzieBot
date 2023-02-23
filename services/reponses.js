import { Utils } from './utils.js';

const salutations = Utils.lireListeDansFichier("bonjour");
const aurevoir = Utils.lireListeDansFichier("au-revoir");
const derien = Utils.lireListeDansFichier("de-rien");
const opinion = Utils.lireListeDansFichier("commentaire-personne");
const merci = Utils.lireListeDansFichier("merci");
const help = Utils.lireTexteDansFichier("help");
const bienvenue = Utils.lireTexteDansFichier("bienvenue");

// on met tout dans un objet unique
const messages = {
  AuRevoir: aurevoir,
  Opinion: opinion,
  Merci: merci,
  Salutations: salutations,
  DeRien: derien,
  Help: help,
  Bienvenue: bienvenue
}

export { messages as SuzieMessage };
import { FileUtils } from '../file.utils.js';

const salutations = FileUtils.lireListeDansFichier("bonjour");
const aurevoir = FileUtils.lireListeDansFichier("au-revoir");
const derien = FileUtils.lireListeDansFichier("de-rien");
const opinion = FileUtils.lireListeDansFichier("commentaire-personne");
const merci = FileUtils.lireListeDansFichier("merci");
const help = FileUtils.lireTexteDansFichier("help");
const bienvenue = FileUtils.lireTexteDansFichier("bienvenue");

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
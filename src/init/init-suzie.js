import { Config } from "../utils/load/config.js";
import { ReactionsDefinition, SlashCommandsDefinition, TYPES, RetourModaleDefinition } from "./suzie-commands.js";
import { Client, GatewayIntentBits, Partials, Collection, Events, REST, Routes, SlashCommandBuilder } from 'discord.js';
import { SuzieMessage } from "../utils/load/reponses.js"

// construire Suzie
var client;
function buildTheBot() {

    // création du client, allocation des droits
    client = new Client({
        partials: [Partials.Message, Partials.Channel],
        intents: [
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.Guilds,
        ]
    });

    // quand Suzie est prête
    client.on(Events.ClientReady, prete);

    // message de bienvenue
    preparerWelcome();

    // quand Suzie reçoit un message
    preparerReactions();

    // importer les commandes de Suzie
    preparerCommandes();

    // connexion
    client.login(Config.token);
}

//----------------------------------------------------------
//------------------ CONSTRUIRE SUZIE ----------------------
//----------------------------------------------------------

function prete() {
    console.log(`Bot ${client.user.tag} is logged in!`);
}

// -----------------------
// --- SLASH COMMANDES ---
// -----------------------
function preparerCommandes() {
    var slashCommands = [];
    const rest = new REST({ version: '10' }).setToken(Config.token);
    (async () => {
        try {
            console.log(`Started refreshing ${SlashCommandsDefinition.length} application (/) commands.`);
            var commandeBody = [];

            SlashCommandsDefinition.forEach(commande => {
                const newCommande = new SlashCommandBuilder()
                    .setName(commande.name)
                    .setDescription(commande.description);

                // ajout des options
                if (commande.options) {
                    commande.options.forEach(option => {
                        newCommande.addStringOption(opt => opt.setName(option.name).setDescription(option.description).setRequired(option.required));
                    });
                }

                slashCommands.push({
                    data: newCommande,
                    async execute(interaction) {
                        commande.fonction(interaction);
                    },
                })
                commandeBody.push(newCommande);
            });

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands(Config.clientId, Config.guildId),
                { body: commandeBody },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();

    client.commands = new Collection();
    for (const command of slashCommands) {
        client.commands.set(command.data.name, command);
    }

    client.on(Events.InteractionCreate, receptionInteraction);
}

async function receptionInteraction(interaction) {

    // --- réception modale ---
    if (interaction.isModalSubmit()) {
        RetourModaleDefinition.forEach(commande => {
            if (interaction.customId == commande.name) {
                commande.fonction(interaction);
            }
        })
    }

    // --- réception Commandes slash ---
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}

// -------------------------
// --- MESSAGE D'ACCUEIL ---
// -------------------------
function preparerWelcome() {
    client.on(Events.GuildMemberAdd, (member) => {
        member.send(SuzieMessage.Bienvenue);
    });
}

// -------------------------
// --- REACTIONS DE CHAT ---
// -------------------------
function preparerReactions() {
    client.on(Events.MessageCreate, receptionMessage);
}

async function receptionMessage(message) {
    // Suzie n'interagit pas avec les bots (incluant elle même)
    if (!message.author.bot) {
        // Si le message contient "@Suzie" ou qu'il est en mp, on vérifie à quelle commande ça peut correspondre
        if (message.content.includes("<@" + client.user.id + ">") || !message.guildId) {
            const messageContent = message.content.substring(3 + client.user.id.length).trim().toUpperCase();

            // on vérifie chaque keyword de chaque commande
            ReactionsDefinition.avecAppel.forEach(commande => {
                commande.terme.forEach(keyword => {
                    if (commande.type == TYPES.MOT_COMMENCE && messageContent.startsWith(keyword.toUpperCase())
                        || commande.type == TYPES.MOT_EXACT && messageContent == keyword.toUpperCase()
                        || commande.type == TYPES.MOT_CONTENU && messageContent.includes(keyword.toUpperCase())) {
                        commande.fonction(message);
                    }
                });
            });
        }

        else {
            const messageContent = message.content.toUpperCase();
            // on vérifie chaqeu keyword de chaque commande
            ReactionsDefinition.sansAppel.forEach(commande => {
                commande.terme.forEach(keyword => {
                    if ((commande.type == TYPES.MOT_COMMENCE && messageContent.startsWith(keyword.toUpperCase()))
                        || (commande.type == TYPES.MOT_EXACT && messageContent == keyword.toUpperCase())
                        || (commande.type == TYPES.MOT_CONTENU && messageContent.includes(keyword.toUpperCase()))) {
                        commande.fonction(message);
                    }
                });
            });
        }
    }
}

export { buildTheBot as buildTheBot };
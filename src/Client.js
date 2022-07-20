const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const mysql = require('mysql');
const chalk = require('chalk');
const express = require("express");
const figlet = require('figlet');

let useSQL = true; // DO NOT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING
let con;

class HDClient extends Client {
    constructor(options = {}) {
        super(options);

        this.config = require(`../config.js`);
        this.utils = require(`./utils/utils.js`);
        this.discord = require('discord.js');

        this.pages = [
            // user
            "`ping` - Check the bots latency.\n`help` - View the bots commands.\n`invite` - Get the bots invite link.\n`credits` - View the creators of the bot.\n",
            // admin
            "`channel` - Change this guilds channel for the bot to join.",
            // credits
            `**Creators:**\n[@Hyperz](https://discord.com/users/704094587836301392) - *Head project developer.*\n[@Chriis](https://discord.com/users/759247388606070794) - *Emotional support.*`
        ];
    };
};

const client = new HDClient({
    intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'ROLE', "GUILD_MEMBER", "USER", "GUILD_INVITES", "MANAGE_GUILD"],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true }
});

client.refreshButton = new client.discord.MessageActionRow().addComponents(
    new client.discord.MessageButton()
    .setLabel('Refresh')
    .setStyle('SUCCESS')
    .setCustomId('refresh')
);
global.__basedir = __dirname;

setTimeout(function() {
    const version = Number(process.version.split('.')[0].replace('v', ''));
    if (version < 16) return console.log(chalk.blue('\n\nPlease upgrade to Node v16 or higher\nPlease upgrade to Node v16 or higher\nPlease upgrade to Node v16 or higher\n\n'));
}, 8000);

const init = async function() {
    let font = await client.utils.maths(["Graffiti", "Standard", "Varsity", "Stop", "Speed", "Slant", "Pagga", "Larry 3D"])
    figlet.text('Big Ben Bot', { font: font, width: 700 }, function(err, data) {
        if(err) throw err;
        let str = `${data}\n-------------------------------------------`
        console.log(chalk.bold(chalk.yellowBright(str)));
    });
    try {
        client.login(client.config.token).catch(function(e) { console.log(e) });
        if (useSQL) {
            try {
                const stuff = client.config.database
                con = mysql.createConnection(stuff)
                setTimeout(function() {
                    console.log(`${chalk.yellowBright('[SQL Manager]')} MySQL Successfully Connected!`)
                }, 4000);
                con.on('enqueue', function () {
                    if(client.config.debugmode) {
                        console.log(`${chalk.yellowBright('[SQL Manager]')} Waiting for available connection slot`);
                    }
                });
                con.on('release', function (connection) {
                    if(client.config.debugmode) {
                        console.log(`${chalk.yellowBright('[SQL Manager]')} Connection %d released`, connection.threadId);
                    }
                });
            } catch (e) {
                client.utils.error(client, e)
                return process.exit(1);
            }
        }

        const app = express()
        app.listen(client.config.port)

        // Ready File Handling Slash Commands

        // Event handler
        const events = readdirSync(join(__dirname, `./`, `events`));
        events.forEach(function(e) {
            const name = e.split('.')[0];
            const event = require(`./events/${e}`);
            client.on(name, event.bind(null, client, con));
            delete require.cache[require.resolve(`./events/${e}`)];
        });

        setTimeout(function() {
            // Extension Handler
            const extensions = readdirSync(join(__dirname, `./`, `extensions`));
            for(let ext of extensions) {
                const extName = ext.split('.')[0];
                console.log(`${chalk.magentaBright('[Extension Manager]')} ${extName} - Loaded`);
                require(`./extensions/${ext}`)(client, con, app);
            };
        }, 3150)
    } catch(e) {
        console.log(e)
    }
}

process.on('unhandledRejection', function(err) { 
    let ignore = [
        "].type: This field is required",
        "Unknown Message",
        "Cannot find module '../components/"
    ];
    let stillLog = true;
    ignore.forEach(function(e) {
        if(err.toString().includes(e)) {
            stillLog = false;
        }
    })
    if(!stillLog) return;
    console.log(chalk.red(`\nFATAL ERROR: \n\n`, err.stack))
});

exports.init = init;
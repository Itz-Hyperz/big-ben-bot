const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const mysql = require('mysql');
const chalk = require('chalk');
const figlet = require('figlet');
const axios = require('axios');

let useSQL = true; // DO NOT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING
let con;

class HDClient extends Client {
    constructor(options = {}) {
        super(options);

        this.config = require(`../config.json`);
        this.utils = require(`./utils/utils.js`);
        this.discord = require('discord.js');

        this.pages = [
            // user
            "`ping` - Check the bots latency.\n`help` - View the bots commands.\n`invite` - Get the bots invite link.\n`credits` - View the creators of the bot.\n",
            // admin
            "`setchannel` - Change this guilds channel for the bot to join.\n`settimezone` - Set your guilds current timezone.\n`testbell` - Manually trigger the bells (testing).",
            // credits
            `**Creators:**\n[@Hyperz](https://discord.com/users/704094587836301392) - *Head project developer.*\n[@Chriis](https://discord.com/users/759247388606070794) - *Emotional support.*`
        ];
    };
};

const client = new HDClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User,
    ],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true }
});

global.__basedir = __dirname;

setTimeout(function() {
    const version = Number(process.version.split('.')[0].replace('v', ''));
    if (version < 18) return console.log(chalk.blue('\n\nPlease upgrade to Node v18 or higher\nPlease upgrade to Node v18 or higher\nPlease upgrade to Node v18 or higher\n\n'));
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
            } catch (e) {
                client.utils.error(client, e)
                return process.exit(1);
            }
        }

        // Timezone caching
        try {
            let timezones = await axios.get('https://raw.githubusercontent.com/Itz-Hyperz/big-ben-bot/main/timezones.json');
            client.timezones = timezones.data;
        } catch (e) {
            client.timezones = [];
            console.log(chalk.red('[Timezone] Failed to fetch timezones.json – settimezone select menu may be empty'));
        }

        // Event handler
        const events = readdirSync(join(__dirname, `./`, `events`));
        events.forEach(function(e) {
            const name = e.split('.')[0];
            const event = require(`./events/${e}`);
            client.on(name, event.bind(null, client, con));
            delete require.cache[require.resolve(`./events/${e}`)];
        });

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

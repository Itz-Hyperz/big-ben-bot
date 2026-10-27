const { readdirSync } = require('fs');
const { join } = require('path');
const chalk = require('chalk');
const ms = require('ms');
const axios = require('axios');
const { ActivityType, ApplicationCommandOptionType, ChannelType } = require('discord.js');

module.exports = async(client, con, ready) => {
    setInterval(async function() {
        require('../components/bellSetup.js')(client, con)
    }, 60000);

    // Presence Settings
    setInterval(async () => {
        try {
            let presence = client.config.presence;
            const typeMap = {
                'PLAYING': ActivityType.Playing,
                'WATCHING': ActivityType.Watching,
                'LISTENING': ActivityType.Listening,
                'COMPETING': ActivityType.Competing,
                'Playing': ActivityType.Playing,
                'Watching': ActivityType.Watching,
                'Listening': ActivityType.Listening,
                'Competing': ActivityType.Competing,
            };
            await client.user.setPresence({
                activities: [{
                    name: (presence.name || 'the time 👀🔔')
                        .replaceAll(/{users}/g, client.users.cache.size)
                        .replaceAll(/{guilds}/g, `${client.guilds.cache.size}`),
                    type: typeMap[presence.type] || ActivityType.Watching,
                }],
                status: presence.status || 'idle',
            });
        } catch(e) {}
    }, 120000);

    // DB Ping
    setInterval(async () => {
        await con?.ping();
    }, ms('24m'));

    // Check DB for Guilds
    await client.guilds.cache.forEach(async function(guild) {
        await client.utils.guildAdd(client, con, guild.id);
    });

    // Load Slash Commands (updated for v14 option types)
    const commands = readdirSync(join(__dirname, `../`, `commands/slash`));
    for (let command of commands) {
        let cmd = require(`../commands/slash/${command}`);
        if (cmd.info.name) {
            // Convert old string option types to ApplicationCommandOptionType
            if (cmd.info.options) {
                cmd.info.options = cmd.info.options.map(opt => {
                    const typeMap = {
                        'STRING': ApplicationCommandOptionType.String,
                        'INTEGER': ApplicationCommandOptionType.Integer,
                        'BOOLEAN': ApplicationCommandOptionType.Boolean,
                        'USER': ApplicationCommandOptionType.User,
                        'CHANNEL': ApplicationCommandOptionType.Channel,
                        'ROLE': ApplicationCommandOptionType.Role,
                        'MENTIONABLE': ApplicationCommandOptionType.Mentionable,
                        'NUMBER': ApplicationCommandOptionType.Number,
                        'ATTACHMENT': ApplicationCommandOptionType.Attachment,
                    };
                    if (typeof opt.type === 'string') {
                        opt.type = typeMap[opt.type] || ApplicationCommandOptionType.String;
                    }
                    // Restrict channel option to voice channels when possible
                    if (opt.name === 'channel' && opt.type === ApplicationCommandOptionType.Channel) {
                        opt.channel_types = [ChannelType.GuildVoice, ChannelType.GuildStageVoice];
                    }
                    return opt;
                });
            }
            client.application?.commands.create(cmd.info).catch(e => {
                console.log(e)
            })
        } else {
            console.log(`No help name or additional info found for slash command: ${command}`);
        }
    };

    setInterval(async () => {
        try {
            let timezones = await axios.get('https://raw.githubusercontent.com/Itz-Hyperz/big-ben-bot/main/timezones.json');
            client.timezones = timezones.data;
        } catch(e) {}
    }, ms('1h'));

    console.log(`${chalk.green('[Invite Link]')} ${chalk.white(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)}`)
};

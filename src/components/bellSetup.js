const moment = require('moment-timezone');
const { ChannelType } = require('discord.js');

const timestart = "00"; // Minute marker for joining

module.exports = async function(client, con) {
    let timeMinutes = await moment().format(client.config.date_format).split(':');
    let minutes = timeMinutes[1];
    if(minutes != timestart) return;
    await con.query(`SELECT * FROM guilds`, async function(err, guilds) {
        if(err) throw err;
        await guilds.forEach(async function(guild) {
            let format = await moment().tz(guild.timezone || client.config.defaultTimezone).format(client.config.date_format).split(':')[0]
            let hours = Number(format);
            // Convert 24h to 12h style rings (0 becomes 12)
            if (hours === 0) hours = 12;
            else if (hours > 12) hours = hours - 12;

            if(guild.channel != "none") {
                let channel = await client.channels.cache.get(guild.channel);
                if(!channel) {
                    await con.query(`UPDATE guilds SET channel="none" WHERE guildid="${guild.guildid}"`, async (err, row) => { if(err) throw err; });
                } else {
                    if(channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice) {
                        await con.query(`UPDATE guilds SET channel="none" WHERE guildid="${guild.guildid}"`, async (err, row) => { if(err) throw err; });
                    } else {
                        // joinable check + at least one non-bot member
                        const humanMembers = channel.members.filter(m => !m.user.bot).size;
                        if(channel.joinable && humanMembers > 0) {
                            require('./bellPlay.js')(channel, hours, client.config.debugmode);
                        };
                    };
                };
            };
        });
    });
};

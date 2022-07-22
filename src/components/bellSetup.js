const moment = require('moment-timezone');

const timestart = "30"; // Minute marker for joining

module.exports = async function(client, con) {
    let timeMinutes = await moment().format(client.config.date_format).split(':');
    let minutes = timeMinutes[1];
    if(minutes != timestart) return;
    await con.query(`SELECT * FROM guilds`, async function(err, guilds) {
        if(err) throw err;
        await guilds.forEach(async function(guild) {
            let format = await moment().tz(guild.timezone || client.config.defaultTimezone).format(client.config.date_format).split(':')[0]
            let hours = Number(format);
            if(guild.channel != "none") {
                let channel = await client.channels.cache.get(guild.channel);
                if(!channel) {
                    await con.query(`UPDATE guilds SET channel="none" WHERE guildid="${guild.guildid}"`, async (err, row) => { if(err) throw err; });
                } else {
                    if(channel.type != "GUILD_VOICE") {
                        await con.query(`UPDATE guilds SET channel="none" WHERE guildid="${guild.guildid}"`, async (err, row) => { if(err) throw err; });
                    } else {
                        if(channel.joinable && channel.members.size > 0) {
                            require('./bellPlay.js')(channel, hours);
                        };
                    };
                };
            };
        });
    });
};
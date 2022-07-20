const chalk = require('chalk');
const moment = require('moment');

async function colorize(color, content) {
    switch (color, content) {
        case "red":
            return chalk.red(content)
        case "green":
            return chalk.green(content)
        case "yellow":
            return chalk.yellow(content)
        case "blue":
            return chalk.blue(content)
        case "cyan":
            return chalk.cyan(content)
        case "white":
            return chalk.white(content)
        case "black":
            return chalk.black(content)
        default:
            return chalk.white(content);
    };
};

async function guildAdd(client, con, id) {
    await con.query(`SELECT * FROM guilds WHERE guildid='${id}'`, async (err, row) => {
        if(err) throw err;
        if(row[0]) return;
        await con.query(`INSERT INTO guilds (guildid, channel) VALUES ("${id}", "none")`, async (err, row) => {
            if(err) throw err;
        });
    });
    return 0;
};

async function guildRemove(client, con, id) {
    await con.query(`SELECT * FROM guilds WHERE guildid='${id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        await con.query(`DELETE FROM guilds WHERE guildid='${id}'`, async (err, row) => {
            if(err) throw err;
        });
    });
};

async function error(client, content) {
    if(client.config.debugmode) {
        console.log(chalk.red('DEBUG MODE ERROR: ', content, `\n ${content.stack}`))
    }
};

async function sendError(string, channel) {
    await channel.send({ content: string }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};

async function userFetch(client, content) {
    let deUser;
    deUser = await client.users.fetch(content)
    if(deUser !== undefined) {
        return deUser;
    } else {
        if(client.config.debugmode) {
            console.log(chalk.red('DEBUG MODE ERROR: Unable to fetch user with provided ID in utils.js line 35.'))
        }
    }
};

async function memberFetch(client, guild, content) {
    let deUser;
    deUser = await guild.members.cache.get(content)
    if(deUser !== undefined) {
        return deUser;
    } else {
        if(client.config.debugmode) {
            console.log(chalk.red('DEBUG MODE ERROR: Unable to fetch user with provided ID in utils.js line 35.'))
        }
    }
};

async function getSettingsMenu(client, con, guildid, data) {
    guildid = guildid.replaceAll(`'`, ``).replaceAll('"', '').replaceAll("'", "");
    let bans;
    let unbans;
    let channel;
    if(data.autobans) {
        bans = "SUCCESS";
    } else {
        bans = "DANGER";
    };
    if(data.autounbans) {
        unbans = "SUCCESS";
    } else {
        unbans = "DANGER";
    };
    if(data.logging != "none") {
        channel = await client.channels.cache.get(data.logging);
    } else {
        channel = "None"
    };
    const menu = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
            .setCustomId('toggleDisabled')
            .setLabel('Toggle:')
            .setStyle('SECONDARY')
            .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
            .setCustomId('bantoggle')
            .setLabel('Auto Bans')
            .setStyle(bans)
    )
    .addComponents(
        new client.discord.MessageButton()
            .setCustomId('unbantoggle')
            .setLabel('Auto Unbans')
            .setStyle(unbans)
    )
    .addComponents(
        new client.discord.MessageButton()
            .setCustomId('loggingDisabled')
            .setLabel('Logging:')
            .setStyle('SECONDARY')
            .setDisabled(true)
    )
    .addComponents(
        new client.discord.MessageButton()
            .setCustomId('logchange')
            .setLabel(`${channel?.name}`)
            .setStyle('PRIMARY')
    )
    return menu;
};

async function addBan(client, con, userid, reason, proof, staffid) {
    // Escape
    let user = await client.users.fetch(userid)
    let staff = await client.users.fetch(staffid)
    let datetime = moment().format(client.config.date_format);
    let insertId;
    userid = await userid.replaceAll(`'`, ``).replaceAll('"', '').replaceAll("'", "");
    reason = await reason.replaceAll(`'`, ``).replaceAll('"', '').replaceAll("'", "");
    proof = await proof.replaceAll(`'`, ``).replaceAll('"', '').replaceAll("'", "");
    staffid = await staffid.replaceAll(`'`, ``).replaceAll('"', '').replaceAll("'", "");
    // Insert
    await con.query(`SELECT * FROM bannedusers WHERE active=true AND userid="${userid}"`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) {
            await con.query(`INSERT INTO bannedusers (active, userid, reason, proof, bannedby, bannedat) VALUES (true, "${userid}", "${reason}", "${proof}", "${staffid}", "${datetime}")`, async (err, row) => {
                if(err) throw err;
                insertId = row.insertId;
                // Push
                let embed = new client.discord.MessageEmbed()
                .setColor(client.config.themeColor)
                .setTitle("New Ban Alert")
                .setURL(proof)
                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                .addFields(
                    { name: "__Banned User__", value: `**ID:** ${user.id}\n**Tag:** [||\`${user.tag}\`||](https://discord.com/users/${user.id})`, inline: true },
                    { name: "__Staff Member__", value: `**ID:** ${staff.id}\n**Tag:** [${staff.tag}](https://discord.com/users/${staff.id})`, inline: true },
                    { name: "Reason", value: `${reason}`, inline: false },
                )
                .setFooter({ text: `Ban ID: ${insertId}`, iconURL: client.user.avatarURL({ dynamic: true }) });
                let alertEmbed = new client.discord.MessageEmbed()
                .setColor(client.config.themeColor)
                .setTitle("You were banned!")
                .setURL(proof)
                .setThumbnail(client.user.avatarURL({ dynamic: true }))
                .addFields(
                    { name: "__Banned User__", value: `**ID:** ${user.id}\n**Tag:** [||\`${user.tag}\`||](https://discord.com/users/${user.id})`, inline: true },
                    { name: "__Staff Member__", value: `**ID:** ${staff.id}\n**Tag:** [${staff.tag}](https://discord.com/users/${staff.id})`, inline: true },
                    { name: "Reason", value: `${reason}`, inline: false },
                )
                .setFooter({ text: `Ban ID: ${insertId}`, iconURL: client.user.avatarURL({ dynamic: true }) });
                try {
                    await user.send({ embeds: [alertEmbed] }).catch(e => {});
                } catch(e) {}
                await con.query(`SELECT * FROM guilds`, async (err, row) => {
                    if(err) throw err;
                    await row.forEach(async (data) => {
                        let guild = await client.guilds.cache.get(data.guildid)
                        let optionsLabel;
                        let optionsCustomId;
                        let optionsLabelEnforce;
                        if(data.autobans) {
                            optionsLabel = "Yes";
                            optionsCustomId = "unbanEmbed";
                            optionsLabelEnforce = `Unban ${user.tag}`;
                        } else {
                            optionsLabel = "No";
                            optionsCustomId = "banEmbed";
                            optionsLabelEnforce = `Ban ${user.tag}`;
                        };
                        let options = new client.discord.MessageActionRow()
                        .addComponents(
                            new client.discord.MessageButton()
                                .setCustomId('banDisabled')
                                .setLabel(`Banned here: ${optionsLabel}`)
                                .setStyle('SECONDARY')
                                .setDisabled(true)
                        )
                        .addComponents(
                            new client.discord.MessageButton()
                                .setCustomId(optionsCustomId)
                                .setLabel(`${optionsLabelEnforce}`)
                                .setStyle('DANGER')
                        )
                        try {
                            if(guild != undefined) {
                                if(data.autobans) {
                                    await guild.members.ban(userid, {
                                        reason: `${reason} | ${proof} | ${client.user.tag}`
                                    }).catch(e => {
                                        if(client.config.debugmode) {
                                            console.log(`Guild Id: ${guild.id} failed to ban ${userid}.\n`, e.stack);
                                        }
                                    });
                                };
                                if(data.logging != 'none') {
                                    let channel = await client.channels.cache.get(data.logging)
                                    if(channel != undefined) {
                                        await channel.send({ embeds: [embed], components: [options] }).catch(e => {});
                                    }
                                }
                            }
                        } catch(e) {}
                    });
                });
            });
        };
    });
    // Finished
    return true;
};

async function removeBan(client, con, userid, staffid) {
    // Escape
    let user = await client.users.fetch(userid)
    let staff = await client.users.fetch(staffid)
    userid = await userid.replaceAll(`'`, ``).replaceAll('"', '').replaceAll("'", "");
    let refreason;
    let refbanid;
    let proof;
    // Update
    await con.query(`SELECT * FROM bannedusers WHERE active=true AND userid="${userid}"`, async (err, row) => {
        if(err) throw err;
        if(row[0]) {
            refreason = row[0].reason;
            refbanid = row[0].banid;
            proof = row[0].proof;
            await con.query(`UPDATE bannedusers SET active=false WHERE userid="${userid}"`, async (err, row) => {
                if(err) throw err;
            });
            // Push
            let embed = new client.discord.MessageEmbed()
            .setColor(client.config.themeColor)
            .setTitle("Unban Alert")
            .setURL(proof)
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .addFields(
                { name: "__Unbanned User__", value: `**ID:** ${user.id}\n**Tag:** [||\`${user.tag}\`||](https://discord.com/users/${user.id})`, inline: true },
                { name: "__Staff Member__", value: `**ID:** ${staff.id}\n**Tag:** [${staff.tag}](https://discord.com/users/${staff.id})`, inline: true },
                { name: "Reference Reason", value: `${refreason}`, inline: false },
            )
            .setFooter({ text: `Ban ID: ${refbanid}`, iconURL: client.user.avatarURL({ dynamic: true }) });
            await con.query(`SELECT * FROM guilds`, async (err, row) => {
                if(err) throw err;
                await row.forEach(async (data) => {
                    let guild = await client.guilds.cache.get(data.guildid);
                    let optionsLabel;
                    let optionsCustomId;
                    let optionsLabelEnforce;
                    if(data.autounbans) {
                        optionsLabel = "Yes";
                        optionsCustomId = `bypassUnban`;
                        optionsLabelEnforce = `Bypass Unban`;
                    } else {
                        optionsLabel = "No";
                        optionsCustomId = "enforceUnban";
                        optionsLabelEnforce = `Unban ${user.tag}`;
                    };
                    let options = new client.discord.MessageActionRow()
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId('banDisabled')
                            .setLabel(`Unbanned here: ${optionsLabel}`)
                            .setStyle('SECONDARY')
                            .setDisabled(true)
                    )
                    .addComponents(
                        new client.discord.MessageButton()
                            .setCustomId(optionsCustomId)
                            .setLabel(`${optionsLabelEnforce}`)
                            .setStyle('DANGER')
                    )
                    if(data.autounbans) {
                        if(guild != undefined) {
                            await guild.members.unban(userid).catch(e => {
                                if(client.config.debugmode) {
                                    console.log(`Guild Id: ${interaction.guild.id} failed to unban ${userid}.\n`, e.stack);
                                }
                            });
                        };
                    };
                    if(data.logging != 'none') {
                        let channel = await client.channels.cache.get(data.logging)
                        if(channel != undefined) {
                            await channel.send({ embeds: [embed], components: [options] }).catch(e => {});
                        }
                    };
                });
            });
        };
    });
    // Finished
    return true;
};

async function getBanId(message) {
    let banid = Number(message.embeds[0].footer.text.replaceAll('Ban ID: ', ''))
    return banid;
};

async function maths(array) {
    let bruh = array[Math.floor(array.length * Math.random())];
    return bruh;
};

async function random(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

exports.userFetch = userFetch;
exports.memberFetch = memberFetch;
exports.error = error;
exports.colorize = colorize;
exports.sendError = sendError;
exports.maths = maths;
exports.guildAdd = guildAdd;
exports.guildCreate = guildAdd;
exports.guildRemove = guildRemove;
exports.guildDelete = guildRemove;
exports.random = random;
exports.makeid = random;
exports.getSettingsMenu = getSettingsMenu;
exports.addBan = addBan;
exports.removeBan = removeBan;
exports.getBanId = getBanId;
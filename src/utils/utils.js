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
        await con.query(`INSERT INTO guilds (guildid, channel, timezone) VALUES ("${id}", "none", "${client.config.defaultTimezone}")`, async (err, row) => {
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
const chalk = require("chalk");
const figlet = require(`figlet`);
const carden = require(`carden`);
const fs = require("fs");
const config = require('../config.json');
const harddata = require('./dadata.json')
const { join } = require('path');


module.exports = {
    async startupScreen(client) {

        try {

        var secret_mode = false;


        if (fs.existsSync(join(__dirname, "../", "../", "logs/", "data-holder.txt"))) {
            secret_mode = true;
        } else {
                secret_mode = false;
        }


        var evns;

        fs.readdir(join(__dirname, "../", "../", "events/"), (err, files) => {
            if (err) return evns = `Failed`;
            evns = files.length;
        })

        var operating;
        var djsVer = require(`discord.js`).version;

        if (process.platform == "aix") operating = "IBM AIX";
        if (process.platform == "darwin") operating = "Apple Darwin";
        if (process.platform == "freebsd") operating = "FreeBSD";
        if (process.platform == "linux") operating = "Linux/Linux Distro";
        if (process.platform == "openbsd") operating = "OpenBSD";
        if (process.platform == "sunos") operating = "SunOS";
        if (process.platform == "win32") operating = "Windows";
        else platform = "Unknown";
        figlet.text(`${harddata.main.name}`, { width: '500 '}, async function(err, head) {
            if (err) return;

            var nodeVer = process.version;

            if (Number(process.version.slice(1).split(".")[0] < 13)) nodeVer = process.version + chalk.red(` (Consider Updating)`);

            var consoleArt = carden(chalk.blue(head), chalk.white(`\nLogged in as ${client.user.tag} (${chalk.green(client.user.id)})\nOnline for ${chalk.green(client.guilds.cache.size)} guilds and ${chalk.green(client.users.cache.size)} users.\n\nPrefix: ${chalk.blue(config["main_config"].prefix)} (Default)\nCommands: ${harddata.main.commands}\nEvents: ${harddata.main.events}\nCreated By: ${chalk.blue(`Hyperz#0001`)}\n\nOperating System: ${operating}\nProcess PID: ${process.pid}\nDiscord.js Version: ${djsVer}\nNode Version: ${nodeVer}\nDebug Mode: ${chalk.yellow(config["main_config"].debugmode)}\n\n Support available at ${chalk.blue(`${harddata.main.support}`)}`), { margin: 1, content: { borderStyle: 'single', backgroundColor: "black", borderColor: "blue", padding: 1}, header: { borderStyle: 'classic', backgroundColor: "black", padding: 1}});

            console.log(consoleArt);

            console.log(` \n `)
            console.log(`------ CONSOLE LOGGING BEGINS BELOW ------`)
            console.log(` \n `)

        })
    } catch(e) {
        if(config["main_config"].debugmode) return console.log(e);
    }
    }
}

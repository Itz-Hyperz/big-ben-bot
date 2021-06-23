const Hyperz = require('discord.js');
const config = require('./config.json');
const client = new Hyperz.Client();
const { createConnection } = require('mysql')
const con = createConnection(config["mysql"]);
const colors = require(`chalk`)

client.commands = new Hyperz.Collection();
client.events = new Hyperz.Collection();

con.connect(err => {
    // Console log if there is an error
    if (err) return console.log(err);

    // No error found?
    console.log(`MySQL has been connected to ${config["mysql"].database}`);
});

['Command', 'Event'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Hyperz, config, con)
})


//setTimeout(() => {
  client.login(config["main_config"].token).then(() => console.log(colors.green.bold(`Hyperz I am logging in, depending on how many shards you have this will take a bit!`))).catch((error) => colors.red.bold(`[ERROR] An error was caught: ${error.message}`))
//}, 150000)


const Hyperz = require('discord.js');
const config = require('./config.json');
const client = new Hyperz.Client({ shardCount: 'auto' });
const { createConnection } = require('mysql')
const con = createConnection(config["mysql"]);

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

client.login(config["main_config"].token)

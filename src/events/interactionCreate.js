module.exports = async function(client, con, interaction) {
    try {
        if(!interaction.guild) return interaction.reply({ content: "Commands can not be run VIA DMs." }).catch(e => {});
        let c = interaction.customId || interaction.commandName;
        await con.query(`SELECT * FROM guilds WHERE guildid='${interaction?.guild?.id}'`, async (err, row) => {
            if(err) throw err;
            if(!row[0]) await client.utils.guildAdd(client, con, interaction.guild.id);
            if (interaction.isCommand()) {
                require(`../commands/slash/${c}.js`).run(client, con, interaction, row[0]);
            } else {
                require(`../components/${c}.js`)(client, con, interaction, row[0]);
            };
        });
    } catch(e) {
        if(!e.toString().toLowerCase().includes('unknown interaction')) {
            if(client.config.debugmode) console.log(e)
        };
    };
};
exports.run = async function(client, con, interaction, data) {
    let channel = await interaction.options.getChannel('channel');

    if(channel.type != "GUILD_VOICE") return interaction.reply({ content: "This is not a voice channel.", ephemeral: true });
    if(!channel.joinable) return interaction.reply({ content: "I can not join this channel.", ephemeral: true });

    await con.query(`UPDATE guilds SET channel="${channel.id}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
    });
    
    await interaction.reply({ content: "**Channel Updated!**", ephemeral: true }).catch(e => {});
};

exports.info = {
    name: 'channel',
    description: 'Change this guilds channel for the bot to join!',
    options: [
        {
            name: 'channel',
            description: 'The channel to change to!',
            required: true,
            type: 'CHANNEL'
        }
    ]
}
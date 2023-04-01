module.exports = async function(client, con, interaction, data) {
    let select = interaction.values[0];
    await con.query(`UPDATE guilds SET timezone="${select}" WHERE guildid="${interaction.guild.id}"`, async (err, row) => {
        if(err) throw err;
    });
    await interaction.reply({ content: "**Timezone Updated!**", ephemeral: true }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};
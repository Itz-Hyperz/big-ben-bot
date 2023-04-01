module.exports = async function(client, con, interaction, data) {
    let pages = client.pages;
    let select = Number(interaction.values[0]);
    let embed = new client.discord.MessageEmbed()
    .setColor(client.config.themeColor || '#FFFFFF')
    .setTitle(`${client.user.username} Help Menu`)
    .setFooter({ text: `Made with ❤️ by Hyperz#0001` })
    .setDescription(pages[select])
    await interaction.update({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};
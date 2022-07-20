module.exports = async function(client, con, interaction, data) {
    let str = interaction.message.embeds[0].description
    let mod = str.split('**○ Guild Id:** ')[1].split('\n*')[0]
    let guild = await client.guilds.cache.get(mod)
    let guildListButtons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Back`)
        .setCustomId('backGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Next`)
        .setCustomId('nextGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`DANGER`)
        .setLabel(`Left Guild`)
        .setCustomId('forceLeaveGuildDisabled')
        .setDisabled(true)
    )
    await guild.leave()
    interaction.update({ components: [guildListButtons] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};
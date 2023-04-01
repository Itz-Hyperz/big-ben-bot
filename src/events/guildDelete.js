module.exports = async function(client, con, guild) {
    await client.utils.guildRemove(client, con, guild.id);
    if(client.config.guildLogs == "") return;
    let embed = new client.discord.MessageEmbed()
    .setColor('#041014')
    .setTitle('📤 Guild Left!')
    .setDescription(`**○ Name:** ${guild.name}\n**○ Id:** \`${guild.id}\``)
    .setTimestamp()
    .setFooter({ text: '🔔 Big Ben Bot - Hyperz#0001' })
    let channel = await client.channels.cache.get(client.config.guildLogs)
    if(channel != undefined) {
        await channel.send({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
};
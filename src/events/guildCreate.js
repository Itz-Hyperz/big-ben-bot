const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = async function(client, con, guild) {
    await client.utils.guildAdd(client, con, guild.id);

    let randomChannel = guild.systemChannel || guild.channels.cache.filter((x) => x.type === ChannelType.GuildText).random(1)[0];
    if(randomChannel) {
        let welcomeEmbed = new EmbedBuilder()
        .setColor(client.config.themeColor || '#FFFFFF')
        .setTitle('❤️🔔  Thanks for the Invitation!  🔔❤️')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Hello there, I'm **${client.user.username}**, a bot that will notify you after every hour has passed and a new one begins! I'm here to help you keep track of the time!`)
        await randomChannel.send({ embeds: [welcomeEmbed] }).catch(e => {});
    };

    if(client.config.guildLogs == "") return;
    let embed = new EmbedBuilder()
    .setColor('#041014')
    .setTitle('📥 Guild Joined!')
    .setDescription(`**○ Name:** ${guild.name}\n**○ Id:** \`${guild.id}\``)
    .setTimestamp()
    .setFooter({ text: '🔔 Big Ben Bot - Hyperz#0001' })
    let channel = await client.channels.cache.get(client.config.guildLogs)
    if(channel != undefined) {
        await channel.send({ embeds: [embed] }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    };
}

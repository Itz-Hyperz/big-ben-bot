const { Permissions } = require('discord.js');
exports.run = async function(client, con, interaction, data) {
    if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
    
    let select = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageSelectMenu()
            .setCustomId('timezoneSelect')
            .setPlaceholder('Select a timezone...')
            .addOptions(client.timezones),
    );

    let embed = new client.discord.MessageEmbed()
    .setColor(client.config.themeColor || '#FFFFFF')
    .setTitle(`Select A Timezone!`)
    .setThumbnail(client.user.avatarURL({ dynamic: true }))
    .setFooter({ text: `Made with ❤️ by Hyperz#0001` })
    .setDescription(`Select a timezone below for the guild to use to reference hours of the day here!`)

    await interaction.reply({ embeds: [embed], components: [select], ephemeral: true }).catch(e => {});
};

exports.info = {
    name: 'settimezone',
    description: 'Change this guilds channel for the bot to join!'
}
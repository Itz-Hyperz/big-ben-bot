const { EmbedBuilder } = require('discord.js');

exports.run = async function(client, con, interaction, data) {
    let embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.themeColor || '#FFFFFF')
    .setDescription(`🏓 Latency is: **${Date.now() - interaction.createdTimestamp}ms.**`)
    await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral });
};

exports.info = {
    name: 'ping',
    description: 'View the latency of this bot!'
}

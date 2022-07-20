exports.run = async function(client, con, interaction, data) {
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.themeColor || '#FFFFFF')
    .setDescription(client.pages[client.pages.length - 1])
    await interaction.reply({ embeds: [embed], ephemeral: client.config.commands.ephemeral });
};

exports.info = {
    name: 'credits',
    description: 'View the credits for this bot!'
}
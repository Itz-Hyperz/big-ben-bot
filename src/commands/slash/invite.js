exports.run = async function(client, con, interaction, data) {
    let embed = new client.discord.MessageEmbed()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.themeColor || '#FFFFFF')
    .setDescription(`You can invite me [here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands).`)
    let buttons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
            .setLabel('Invite me!')
            .setStyle('LINK')
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    )
    await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: client.config.commands.ephemeral });
};

exports.info = {
    name: 'invite',
    description: 'Get an invite link for the bot!'
}
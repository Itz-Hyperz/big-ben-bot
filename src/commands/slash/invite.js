const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.run = async function(client, con, interaction, data) {
    let embed = new EmbedBuilder()
    .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
    .setColor(client.config.themeColor || '#FFFFFF')
    .setDescription(`You can invite me [here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands).`)
    let buttons = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setLabel('Invite me!')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`)
    )
    await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: client.config.commands.ephemeral });
};

exports.info = {
    name: 'invite',
    description: 'Get an invite link for the bot!'
}

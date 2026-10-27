const { PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

exports.run = async function(client, con, interaction, data) {
    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
    }

    let select = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('timezoneSelect')
            .setPlaceholder('Select a timezone...')
            .addOptions(client.timezones || []),
    );

    let embed = new EmbedBuilder()
    .setColor(client.config.themeColor || '#FFFFFF')
    .setTitle(`Select A Timezone!`)
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Made with ❤️ by Hyperz#0001` })
    .setDescription(`Select a timezone below for the guild to use to reference hours of the day here!`)

    await interaction.reply({ embeds: [embed], components: [select], ephemeral: true }).catch(e => {});
};

exports.info = {
    name: 'settimezone',
    description: 'Change this guilds timezone for the hourly chimes!'
}

const { PermissionFlagsBits, ChannelType } = require('discord.js');
const moment = require('moment-timezone');

exports.run = async function(client, con, interaction, data) {
    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: 'You do not have permission to manage channels.', ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    if (!data || data.channel === 'none') {
        return interaction.editReply('No voice channel is configured. Use `/setchannel` first.');
    }

    const channel = await client.channels.fetch(data.channel).catch(() => null);
    if (!channel || (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)) {
        return interaction.editReply('The configured channel is no longer valid. Please run `/setchannel` again.');
    }

    if (!channel.joinable) {
        return interaction.editReply('I cannot join that channel (missing Connect permission or channel is full).');
    }

    const tz = data.timezone || client.config.defaultTimezone;
    let hours = Number(moment().tz(tz).format(client.config.date_format).split(':')[0]);
    if (hours === 0) hours = 12;
    else if (hours > 12) hours = hours - 12;

    await interaction.editReply(`🔔 Joining **${channel.name}** and playing **${hours}** ring(s)…`);

    try {
        require('../../components/bellPlay.js')(channel, hours, client.config.debugmode);
        // Give it a moment then confirm
        setTimeout(() => {
            interaction.followUp({ content: '✅ Playback started (check the voice channel).', ephemeral: true }).catch(() => {});
        }, 2000);
    } catch (err) {
        console.error(err);
        await interaction.followUp({ content: `❌ Failed: ${err.message}`, ephemeral: true }).catch(() => {});
    }
};

exports.info = {
    name: 'testbell',
    description: 'Manually trigger the Big Ben chimes (for testing audio)'
}

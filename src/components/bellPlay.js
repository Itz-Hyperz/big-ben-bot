const { join } = require('node:path');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource } = require('@discordjs/voice');
module.exports = async function(channel) {
    const player = await createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    const resource = await createAudioResource(join(__dirname, 'sound.mp3'), { inlineVolume: true });
    await resource.volume.setVolume(1);
    let connection = await joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    if(connection) {
        await connection.subscribe(player);
        await player.play(resource);
    };
    player.on('error', error => {
        console.error(`Error: ${error.message}`);
    });
};
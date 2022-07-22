const { join } = require('node:path');
const { joinVoiceChannel, createAudioPlayer, NoSubscriberBehavior, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const filename = "bell.mp3";
module.exports = async function(channel, hours) {
    let count = 0;
    const player = await createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    const resource = await createAudioResource(join(__dirname, filename), { inlineVolume: true });
    await resource.volume.setVolume(1);
    let connection = await joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    if(connection) {
        await connection.subscribe(player);
        await player.play(resource);
        count++;
        player.on(AudioPlayerStatus.Idle, async () => {
            if(count >= hours) {
                await connection.destroy();
            } else {
                const resourceTwo = await createAudioResource(join(__dirname, filename), { inlineVolume: true });
                await resourceTwo.volume.setVolume(1);
                if(count < hours && hours < 13) { // Only play a maximum of 12 times
                    await player.play(resourceTwo);
                    count++;
                };
            };
        });
    };
    player.on('error', error => {
        console.error(`Error:\n${error.message}`);
    });
};
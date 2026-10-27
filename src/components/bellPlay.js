const { join } = require('node:path');
const {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
} = require('@discordjs/voice');

const filename = "bell.mp3";
const debug = false;

module.exports = async function(channel, hours) {
    let count = 0;

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
        },
    });

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false,
    });

    if (debug) {
        connection.on('stateChange', (oldState, newState) => {
            console.log(`[Voice] ${channel.guild.name}: ${oldState.status} → ${newState.status}`);
        });
        player.on('stateChange', (oldState, newState) => {
            console.log(`[Player] ${channel.guild.name}: ${oldState.status} → ${newState.status}`);
        });
        player.on(AudioPlayerStatus.Playing, () => {
            console.log('[Player] ★ NOW PLAYING');
        });

        player.on(AudioPlayerStatus.Idle, () => {
            console.log('[Player] Idle');
        });

        player.on('error', error => {
            console.error('[Player ERROR]', error);
        });
        player.on('stateChange', (oldState, newState) => {
            console.log(`[Player] ${oldState.status} → ${newState.status}`);
        });
    }

    connection.on('error', error => {
        console.error(`[Voice Error] ${channel.guild.name}: ${error.message}`);
    });

    player.on('error', error => {
        console.error(`[Player Error] ${channel.guild.name}: ${error.message}`);
    });

    try {
        // Wait for the connection to fully establish (this was missing before)
        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
    } catch (error) {
        console.error(`[Voice] Failed to establish voice connection in ${channel.guild.name}:`, error.message);
        try { connection.destroy(); } catch (_) {}
        return;
    }

    connection.subscribe(player);

    const playOne = () => {
        const resource = createAudioResource(join(__dirname, filename), {
            inlineVolume: true,
        });
        resource.volume.setVolume(1);
        player.play(resource);
    };

    // Start first ring
    playOne();
    count++;

    player.on(AudioPlayerStatus.Idle, async () => {
        if (count >= hours || hours >= 13) {
            try { connection.destroy(); } catch (_) {}
        } else {
            playOne();
            count++;
        }
    });
};

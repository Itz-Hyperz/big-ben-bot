const { readdirSync } = require('fs');
const { ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

exports.run = async function(client, con, interaction, data) {
    let cmd = interaction.options.getString('command');
    if(!cmd) {
        let select = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('helpPageSelect')
                .setPlaceholder('Select a module...')
                .addOptions([
                    {
                        label: '🙂 User Commands',
                        description: 'View the user commands for this bot!',
                        value: '0',
                    },
                    {
                        label: '📚 Admin Commands',
                        description: 'View the admin commands for this bot!',
                        value: '1',
                    },
                    {
                        label: '📜 Credits',
                        description: 'View the credits for this bot!',
                        value: '2',
                    }
                ]),
        );
        let embed = new EmbedBuilder()
        .setColor(client.config.themeColor || '#FFFFFF')
        .setTitle(`${client.user.username} Help Menu`)
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: `Made with ❤️ by Hyperz#0001` })
        .setDescription(client.config.aboutServer || 'I\'m just here to remind you of the time :]')
        await interaction.reply({ embeds: [embed], components: [select], ephemeral: true });
    } else {
        const commands = readdirSync(__dirname).filter(f => f.endsWith('.js'));
        for (let file of commands) {
            let cinfo = require(`./${file}`);
            if (cmd.toLowerCase() !== cinfo.info.name) continue;
            let embed = new EmbedBuilder()
            .setColor(client.config.themeColor || '#FFFFFF')
            .setTitle('Command Info')
            .setDescription(`**Name:** \`${cinfo.info.name}\`\n**Description:** \`${cinfo.info.description}\`\n**Type:** \`slash\``)
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            await interaction.reply({ embeds: [embed], ephemeral: true }).catch(e => {});
        }
    }
};

exports.info = {
    name: 'help',
    description: 'View the help menu for this bot!',
    options: [
        {
            name: 'command',
            description: 'View the help menu for a specific command!',
            required: false,
            type: 'STRING',
        }
    ]
}

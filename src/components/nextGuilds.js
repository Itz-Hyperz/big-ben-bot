module.exports = async function(client, con, interaction, data) {
    let guildListButtons = new client.discord.MessageActionRow()
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Back`)
        .setCustomId('backGuilds')
    )
    .addComponents(
        new client.discord.MessageButton()
        .setStyle(`SECONDARY`)
        .setLabel(`Next`)
        .setCustomId('nextGuilds')
    )
    if(client.config.botOwners.includes(interaction.user.id)) {
        guildListButtons.addComponents(
            new client.discord.MessageButton()
            .setStyle(`DANGER`)
            .setLabel(`Leave Guild`)
            .setCustomId('forceLeaveGuild')
        )
    }
    await con.query(`SELECT * FROM guilds`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) return;
        let curr = Number(interaction.message.embeds[0].footer.text) + 1;
        if(!row[curr]) curr = 0;
        let guild = await client.guilds.cache.get(row[curr].guildid);
        let owner = await client.users.fetch(guild?.ownerId);
        let guildList = new client.discord.MessageEmbed()
        .setColor(client.config.themeColor || '#FFFFFF')
        .setTitle(`Guilds List`)
        .setDescription(`**○ Guild Name:** ${guild?.name}\n**○ Guild Id:** ${guild?.id}\n**○ Guild Members:** ${guild?.members?.cache?.size}\n\n**○ Guild Owner Tag:** ${owner?.tag}\n**○ Guild Owner Id:** ${owner?.id}`)
        .setTimestamp()
        .setFooter({ text: `${curr}` })
        try { guildList.setThumbnail(guild.iconURL({ dynamic: true })) } catch(e) {}
        interaction.update({ embeds: [guildList], components: [guildListButtons], ephemeral: client.config.commands.ephemeral }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
    });
};
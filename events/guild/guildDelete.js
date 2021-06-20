const fs = require('fs');

module.exports = async (client, Hyperz, config, con, guild) =>{
    
    await con.query(`DELETE FROM guilds WHERE id='${guild.id}'`, async (err, row) => {
        if(err) throw err;
    });

    var logger = await client.channels.cache.get('856221390549155850');
	
	const logemb = new Hyperz.MessageEmbed()
	.setColor(`${config.main_config.colorhex}`)
	.setTitle(`I have left a guild!`)
	.setDescription(`**Name:** ${guild.name}\n**ID:** ${guild.id}`)
	.setTimestamp()
	.setFooter(`${config.main_config.copyright}`)
	
	try {
		logger.send(logemb)
	} catch(e) {
		console.log(e)
	}

    console.log(`I have left: ${guild.name}`)

	changeStatus(client);
        async function changeStatus(client) {
            await client.user.setPresence({
                activity: {
                    name: `b!help | ${client.guilds.cache.size} servers`,
                    type: `WATCHING`
                },
                status: `idle`
            });
    
        };


}

const fs = require('fs');

module.exports = async (client, Hyperz, config, con, guild) =>{
    
    await con.query(`SELECT * FROM guilds WHERE id='${guild.id}'`, async (err, row) => {
        if(err) throw err;
        if(!row[0]) {
            await con.query(`INSERT INTO guilds (id, chan) VALUES ('${guild.id}', 'none')`, async (err, row) => {
                if(err) throw err;
            });
        } else if(row[0]) {
            if(row[0].chan != 'none') {
                await con.query(`UPDATE guilds SET chan='none' WHERE id='${guild.id}'`, async (err, row) => {
                    if(err) throw err;
                });
            }
        }
    });


	var logger = await client.channels.cache.get('856221390549155850');
	
	const logemb = new Hyperz.MessageEmbed()
	.setColor(`${config.main_config.colorhex}`)
	.setTitle(`I have joined a guild!`)
	.setDescription(`**Name:** ${guild.name}\n**ID:** ${guild.id}\n**Members:** ${guild.members.cache.size}`)
	.setTimestamp()
	.setFooter(`${config.main_config.copyright}`)
	try { logemb.setThumbnail(`${guild.iconURL({dynamic: true})}`) } catch(e) {}
	
	try {
		logger.send(logemb)
	} catch(e) {
		console.log(e)
	}
	
    console.log(`I have joined: ${guild.name}`)

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


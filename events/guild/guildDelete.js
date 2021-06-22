const fs = require('fs');

module.exports = async (client, Hyperz, config, con, guild) =>{
    
    await con.query(`DELETE FROM guilds WHERE id='${guild.id}'`, async (err, row) => {
        if(err) throw err;
    });

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

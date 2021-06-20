const fs = require('fs');
const config = require('../../config.json');

module.exports = async (client, Hyperz, config, con, channel) => {

    try {
    
        if(channel.type != 'voice') return;

        await con.query(`SELECT * FROM guilds WHERE chan='${channel.id}'`, async (err, row) => {
            if(err) throw err;
            if(row[0]) {
                await con.query(`UPDATE guilds SET chan='none' WHERE chan='${channel.id}'`, async (err, row) => {
                    if(err) throw err;
                    console.log(`A voice channel was deleted, event mirrored for the guilds database.`)
                });
            }
        });

    } catch(e) {
        if(config.main_config.debugmode) return console.log(e);
    }

}

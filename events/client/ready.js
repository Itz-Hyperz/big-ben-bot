const fs = require('fs');
const ms = require('ms');
const wait = require('util').promisify(setTimeout);
const moment = require('moment')
const { startupScreen } = require('../../util/boot.js');
const disbotapi = require("disbotapi")
let i = 0;

module.exports = (client, Hyperz, config, con) =>{

	process.on('unhandledRejection', (err) => {console.log(err)});
	
    var bigdogstatus;
    let daPort = config["main_config"].port

	const disbot = new disbotapi(client.user.id, "token-here", false) // BOOLEAN IS FOR DEBUG MODE
    	setInterval(() => {
        	disbot.updateStats(client.guilds.cache.size)
    	}, 302000)

        client.guilds.cache.forEach(async g => {
            await con.query(`SELECT * FROM guilds WHERE id='${g.id}'`, async (err, row) => {
                if(err) throw err;
                if(!row[0]) {
                    await con.query(`INSERT INTO guilds (id, chan, logs) VALUES ('${g.id}', 'none', 'none')`, async (err, row) => {
                        if(err) throw err;
                    });
                }
            });
        });

        const express = require("express");
        const app = express()
        app.listen(daPort)

        setInterval(() => {

            bigFuckingBen(client, moment, fs, ms, con, bigdogstatus)

        }, 10000)

        startupScreen(client);
        changeStatus(client);
    
        async function bigFuckingBen(client, moment, fs, ms, con, bigdogstatus) {
            
            let datetime = moment().format('HH:mm A');

            if(datetime.includes(`:00`)) {
                getDicked(client, moment, fs, ms, con, bigdogstatus)
            }
    
        };

        async function getDicked(client, moment, fs, ms, con, bigdogstatus) {
            
            await con.query(`SELECT * FROM guilds`, async (err, rows) => {
                if(err) throw err;

                let newdatetime = moment().format('HH:mm A');

                for(let data of rows) {
                    if(data.chan != 'none') {
                        bigdogstatus = await client.channels.cache.get(data.chan)

                        bigdogstatus.join().then(connection => {
                            const dispatcher = connection.play(require("path").join(__dirname, '../../util/bigfuckingben.mp3'));
                            dispatcher.on("finish", finish => {
				 connection.disconnect();
                                 bigdogstatus.leave();
                            });
                        }).catch(err => console.log(err));
                    }
                }

            });

            await client.user.setPresence({
                activity: {
                    name: `THE BIG BELL`,
                    type: `PLAYING`
                },
                status: `available`
            });

            setTimeout(() => {
                changeStatus(client)
            }, 60000)
    
        };
    
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

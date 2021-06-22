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
            try {
            await con.query(`SELECT * FROM guilds`, async (err, rows) => {
                if(err) throw err;

                for(let data of rows) {
                    if(data.chan != 'none') {
                        try {

                            bigdogstatus = await client.channels.cache.get(data.chan)

                            if(bigdogstatus != undefined) {
                                try {

                                    if(bigdogstatus.type === 'dm') {
                                        await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                            if(err) throw err;
                                        });
                                    }

                                    await bigdogstatus.join().then(async connection => {
                                        const dispatcher = await connection.play(require("path").join(__dirname, '../../util/output.ogg'));
                                        dispatcher.on("finish", async finish => {
                                            try {
                                                await connection.disconnect();
                                                await bigdogstatus.leave();
                                            } catch(e) {
                                                if(config.main_config.debugmode) return console.log(e);
                                            }
                                        });
                                    }).catch(err => console.log(err));
                                } catch(e) {
                                    if(config.main_config.debugmode) return console.log(e);
                                }
                            } else {
                                await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                    if(err) throw err;
                                });
                                console.log(`\n\n-----------------------\n${data.chan} from ${data.guild} was marked as undefined.\n-----------------------\n\n`)
                            }

                        } catch(e) {
                            if(config.main_config.debugmode) return console.log(e);
                        }
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

        } catch(e) {
            if(config.main_config.debugmode) return console.log(e);
        }
    
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

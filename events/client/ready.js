const fs = require('fs');
const ms = require('ms');
const wait = require('util').promisify(setTimeout);
const moment = require('moment')
const { startupScreen } = require('../../util/boot.js');
const disbotapi = require("disbotapi")
let i = 0;

module.exports = (client, Hyperz, config, con) =>{

    // Set max listeners for Node Process and grab unhandled rejections
    process.setMaxListeners(20);
	process.on('unhandledRejection', (err) => {console.log(err)});
	
    // Set dependent variables up here
    var looper;
    var bigdogstatus;

    // Grab the port from the config
    let daPort = config["main_config"].port

    // Link up Disbot.TOP API here
	const disbot = new disbotapi(client.user.id, "token-here", false) // BOOLEAN IS FOR DEBUG MODE
    	setInterval(() => {
        	disbot.updateStats(client.guilds.cache.size)
    	}, 302000)


        // Make sure all guilds the bot is in, are in the database
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

        // Listen on the port, used for status pages
        const express = require("express");
        const app = express()
        app.listen(daPort)

        // Run the time check function every minute
        setInterval(() => {

            bigFuckingBen(client, config, moment, fs, ms, con, bigdogstatus, looper)

        }, 60000)

        // Advanced console logger lol
        startupScreen(client);

        // Set the bots default status
        changeStatus(client);
    
        async function bigFuckingBen(client, config, moment, fs, ms, con, bigdogstatus, looper) {
            
            // Grab the current time
            let datetime = moment().format('HH:mm A');

            // Check it if it is on the :00 mark for minutes
            if(datetime.includes(`:00`)) {
                getDicked(client, config, moment, fs, ms, con, bigdogstatus, looper)
            }
    
        };

        async function getDicked(client, config, moment, fs, ms, con, bigdogstatus, looper) {
            try {
                // Grab all guilds that have setup the bot
            await con.query(`SELECT * FROM guilds WHERE chan!='none'`, async (err, rows) => {
                if(err) throw err;

                // For loop for each of the guilds that have the bot setup
                for(let data of rows) {
                        try {

                            // Find the channel specific to the current data's guild
                            bigdogstatus = await client.channels.cache.get(data.chan)

                            // If not undefined, continue
                            if(bigdogstatus != undefined) {
                                try {

                                    // If data's channel is a DM message, update it to none
                                    if(bigdogstatus.type === 'dm') {
                                        await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                            if(err) throw err;
                                        });
                                    }       

                                    // If the voice channel has at-least 1 member in it, continue
                                    if(bigdogstatus.members.size >= 1) {

                                        // Run the connector to begin play process
                                        connector(client, config, bigdogstatus, fs, ms, con, data);
                                    
                                    }


                                } catch(e) {
                                    if(config.main_config.debugmode) return console.log(e);
                                }
                            } else {
                                // If the channel is undefined, reset it
                                await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                    if(err) throw err;
                                });
                                console.log(`\n\n-----------------------\n${data.chan} from ${data.guild} was marked as undefined.\n-----------------------\n\n`)
                            }

                        } catch(e) {
                            if(config.main_config.debugmode) return console.log(e);
                        }
                }

            });

            // Set presence for the bell playing
            await client.user.setPresence({
                activity: {
                    name: `THE BIG BELL`,
                    type: `PLAYING`
                },
                status: `available`
            });

            // Wait 60 seconds, then revert back to normal status
            setTimeout(() => {
                changeStatus(client)
            }, 60000)

        } catch(e) {
            if(config.main_config.debugmode) return console.log(e);
        }
    
        };

        async function connector(client, config, bigdogstatus, fs, ms, con, data) {

            let list = ['../../util/audio/output1.ogg', '../../util/audio/output2.ogg', '../../util/audio/output3.ogg', '../../util/audio/output4.ogg', '../../util/audio/output5.ogg', '../../util/audio/output6.ogg', '../../util/audio/output7.ogg', '../../util/audio/output8.ogg', '../../util/audio/output9.ogg'];
            let audioFinder = list[Math.floor(list.length * Math.random())];
            
            // Join the voice channel
            await bigdogstatus.join().then(async connection => {
                // Start playing the file
                const dispatcher = await connection.play(require("path").join(__dirname, `${audioFinder}`));

                // Wait for the file to finish
                dispatcher.on("finish", async finish => {
                    try {
                        // Leave the channel
                        await connection.disconnect();
                        await bigdogstatus.leave();
                    } catch(e) {
                        if(config.main_config.debugmode) return console.log(e);
                    }
                });
            }).catch(async e => {
                if(e) {

                    console.log(e)

                   
                    // If error on this event, set the channel to none
                    await con.query(`SELECT * FROM guilds WHERE id='${data.id}'`, async (err, row) => {
                        if(err) throw err;
                        if(row[0]) {
                            try {
                                await con.query(`UPDATE guilds SET chan='none' WHERE id='${data.id}'`, async (err, row) => {
                                    if(err) throw err;
                                });
                            } catch(err) {
                                if(config.main_config.debugmode) return console.log(err);
                            }
                        }
                    });
                    
                }
            
            });
    
        };
    
        async function changeStatus(client) {
            // Change back to default presence from bot-start
            await client.user.setPresence({
                activity: {
                    name: `b!help | ${client.guilds.cache.size} servers`,
                    type: `WATCHING`
                },
                status: `idle`
            });
    
        };

}

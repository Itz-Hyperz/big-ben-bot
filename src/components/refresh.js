module.exports = async function(client, con, interaction, data) {
    let lol = interaction.message.components;
    interaction.update({ components: lol }).catch(function(e) { if(client?.config?.debugmode) console.log(e) });
};
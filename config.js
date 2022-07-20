const _config = {
  // Client Settings (REQUIRED)
  token: 'YOUR_BOT_TOKEN', // The token from your Discord Dev Portal
  themeColor: '#ebbd34', // The color of the theme for the bot (hex code)
  aboutServer: "🔔 Hello there, I'm **Big Benjamin**, a bot that will notify you after every hour has passed and a new one begins! I'm here to help you keep track of the time!", // A brief description of your community (Not Required)
  date_format: 'HH:mm', // The date format for the bot

  // Application Settings (REQUIRED)
  port: '3000', // The port for the bot to listen on
  debugmode: true, // Toggles the logging of errors and excess information

  // MySQL Settings (REQUIRED)
  database: {
    host: 'localhost', // The IP of your SQL Server
    user: 'root', // The username for your SQL Server
    password: '', // The password for of the user for your SQL Server
    database: 'bigbenbot', // The database designated for the bot
  },

  // Slash Commands Settings
  commands: {
    ephemeral: false, // Will make most slash commands ephemeral (Recommended: false)
  },

  guildLogs: "YOUR_CHANNEL_ID", // Guild join logs

  // Presence Settings (REQUIRED)
  presence: {
    name: 'the time 👀🔔',
    type: 'WATCHING',
    status: 'idle',
  }
};

module.exports = _config;

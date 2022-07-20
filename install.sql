CREATE DATABASE IF NOT EXISTS bigbenbot;
USE bigbenbot;

CREATE TABLE guilds (
guildid varchar(255),
channel varchar(255)
);

-- Conversions
ALTER DATABASE bigbenbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
ALTER TABLE guilds CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci;
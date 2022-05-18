import { REST } from "@discordjs/rest";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Routes } from "discord-api-types/v9";
import fs from "fs";

const commands = [];
const commandFiles = fs
  .readdirSync("src/commands")
  .filter((file) => file.endsWith(".ts"));

// Place your client and guild ids here
const clientId = process.env.CLIENTID as string;
const guildId = process.env.GUILDID as string;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN as string);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

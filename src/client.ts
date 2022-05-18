import { config as dotEnvConfig } from "dotenv";
import { Client, Collection, Intents } from "discord.js";
import path from "path";
import fs from "fs";
dotEnvConfig();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
});

// @ts-ignore
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // @ts-ignore
  client.commands.set(command.default.data.name, command.default);
}

client.once("ready", () => {
  require("./deploy");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  // @ts-ignore
  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);

import { config as dotEnvConfig } from "dotenv";
import { Client, ClientOptions, Collection, Intents } from "discord.js";
import path from "path";
import fs from "fs";
dotEnvConfig();

class SK8Client extends Client {
  public commands: Collection<string, any>;

  constructor(options: ClientOptions) {
    super(options);

    this.commands = new Collection();
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      this.commands.set(command.default.data.name, command.default);
    }
  }
}

const client = new SK8Client({
  intents: [Intents.FLAGS.GUILDS],
});

client.once("ready", () => {
  client.user?.setActivity("S K A T E", {
    type: "PLAYING",
    url: "https://sk8block.com",
  });
  client.user?.setStatus("dnd");
  require("./deploy");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands?.get(interaction.commandName);

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
  }
  if (interaction.isModalSubmit()) {
    const command = client.commands?.get(interaction.customId);

    if (!command) return;

    try {
      await command.additionalInteractions.modal(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);

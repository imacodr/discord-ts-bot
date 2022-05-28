import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

async function execute(interaction: CommandInteraction) {
  return interaction.reply({
    content: interaction.options.data[0].value as string,
  });
}

export default {
  data: new SlashCommandBuilder()
    .setName("idea")
    .setDescription("Suggest ideas for the project.")
    .addStringOption((option) =>
      option
        .setName("code")
        .setDescription("The verification code you received from the game.")
        .setRequired(true)
    ),

  execute: (interaction: CommandInteraction) => execute(interaction),
};

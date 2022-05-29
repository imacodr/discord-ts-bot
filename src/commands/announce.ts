import { SlashCommandBuilder } from "@discordjs/builders";
import {
  AnyChannel,
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from "discord.js";

let toSend: AnyChannel | undefined;

async function execute(interaction: CommandInteraction) {
  try {
    const modal = new Modal()
      .setCustomId(interaction.commandName)
      .setTitle("Announcement");

    const title = new TextInputComponent()
      .setCustomId("title")
      .setLabel("What is the title of the announcement?")
      .setStyle("SHORT")
      .setPlaceholder("e.g Buy SK8 today!")
      .setRequired(true);

    const content = new TextInputComponent()
      .setCustomId("content")
      .setLabel("What is the content of the announcement?")
      .setStyle("PARAGRAPH")
      .setPlaceholder("e.g SK8 is now available for purchase!")
      .setRequired(true);

    const image = new TextInputComponent()
      .setCustomId("image")
      .setLabel("What is the URL of the image?")
      .setStyle("SHORT")
      .setPlaceholder("e.g https://i.imgur.com/...")
      .setRequired(false);

    const first = new MessageActionRow<ModalActionRowComponent>().addComponents(
      title
    );
    const second =
      new MessageActionRow<ModalActionRowComponent>().addComponents(content);
    const third = new MessageActionRow<ModalActionRowComponent>().addComponents(
      image
    );

    modal.addComponents(first, second, third);

    toSend = await interaction.client.channels.cache.get(
      interaction.options.data[0].value
        ?.toString()
        .replaceAll("<", "")
        .replaceAll("#", "")
        .replaceAll(">", "") as string
    );

    await interaction.showModal(modal);
  } catch (e: any) {
    return interaction.reply({
      content: "Something went wrong! Here is the error: " + e,
      ephemeral: true,
    });
  }
}

async function modal(interaction: ModalSubmitInteraction) {
  try {
    let announceEmbed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(interaction.fields.getTextInputValue("title"))
      .setDescription(interaction.fields.getTextInputValue("content"))
      .setFooter({
        text: "SK8Blocks",
        iconURL:
          "https://cdn.discordapp.com/attachments/972276613049909299/978828628664147989/unknown.png",
      });

    if (interaction.fields.getTextInputValue("image") !== undefined) {
      announceEmbed.setImage(interaction.fields.getTextInputValue("image"));
    }

    // @ts-ignore
    toSend?.send({ embeds: [announceEmbed] });

    return interaction.reply({
      content: "Successfully sent!",
      ephemeral: true,
    });
  } catch (e) {}
}

export default {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("🛹 Team Only | Announce embeds to the server")
    .addStringOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel for the embed")
        .setRequired(true)
    ),

  execute: (interaction: CommandInteraction) => execute(interaction),

  additionalInteractions: {
    modal: (interaction: ModalSubmitInteraction) => modal(interaction),
  },
};

import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";

export const selectCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("select")
    .setDescription("두가지중 한가지 골라용")
    .addStringOption((option) =>
      option.setName("choice1").setDescription("첫번쨰").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("choice2").setDescription("두번쨰").setRequired(true)
    ),
  async execute(interaction) {
    const choice1 = interaction.options.getString("choice1");
    const choice2 = interaction.options.getString("choice2");
    const choices = [choice1, choice2];
    const selected = choices[Math.floor(Math.random() * choices.length)];
    await interaction.reply(`당연히 ${selected}지`);
  },
};
export default selectCommand;
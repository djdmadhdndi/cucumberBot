import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { wordleGames } from "../wordleStore.js";
import type { Command } from "../types.js";

const wordleSetCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("워들설정")
    .setDescription("관리자가 워들 정답을 설정합니다")
    // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option.setName("단어").setDescription("5글자 영어 단어").setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const word = interaction.options.getString("단어", true).toUpperCase();

    if (word.length !== 5) {
      await interaction.reply({
        content: "단어는 5글자여야 합니다!",
        ephemeral: true,
      });
      return;
    }

    wordleGames.set(interaction.guildId!, {
      targetWord: word,
      attempts: [],
      maxAttempts: 6,
    });

    await interaction.reply({
      content: `✅ 정답이 **${word}**로 설정되었습니다!`,
      ephemeral: true,
    });
  },
};

export default wordleSetCommand; // 이 줄이 있는지 꼭 확인!
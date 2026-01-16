import {
  SlashCommandBuilder,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import { wordleGames, checkGuess } from "../wordleStore.js";
import type { Command } from "../types.js";

const wordleGuessCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("워들입력")
    .setDescription("설명적기귀찮노ㅋㅋ")
    .addStringOption((option) =>
      option
        .setName("단어")
        .setDescription("5글자 영어 단어를 입력하세요")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const guildId = interaction.guildId;

    if (!guildId) {
      await interaction.reply({ content: "서버에서만 사용 가능", ephemeral: true });
      return;
    }

    const game = wordleGames.get(guildId);

    if (!game) {
      await interaction.reply({ content: "게임이 없다요. 관리자에게 게임열어달라하라요", ephemeral: true });
      return;
    }

    const guess = interaction.options.getString("단어", true).toUpperCase();

    if (guess.length !== 5) {
      await interaction.reply({ content: "단어는 반드시 5글자", ephemeral: true });
      return;
    }

    const resultEmoji = checkGuess(guess, game.targetWord);

    game.attempts.push(`${resultEmoji} | \`${guess}\``);

    const resultEmbed = new EmbedBuilder()
      .setTitle("🧩 워들 게임 진행 현황")
      .setDescription(game.attempts.join("\n"))
      .setColor("#2b2d31")
      .setFooter({
        text: `시도 횟수: ${game.attempts.length} / ${game.maxAttempts}`,
      })
      .setTimestamp();

    if (guess === game.targetWord) {
      wordleGames.delete(guildId);
      await interaction.reply({
        content: `🎉 **${interaction.user.username}**님이 정답을 맞히셨습니다! 정답은 **${game.targetWord}**였습니다!`,
        ephemeral: true,
      });
      return;
    }

    if (game.attempts.length >= game.maxAttempts) {
      const finalTarget = game.targetWord;
      wordleGames.delete(guildId);
      await interaction.reply({ content: "모든 기회 소진", ephemeral: true });
      return;
    }

    await interaction.reply({
      content: `**${interaction.user.username}**님의 추측 결과입니다.`,
      embeds: [resultEmbed],
    });
  },
};
export default wordleGuessCommand;
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다
//샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다샤인머스켓먹고싶다

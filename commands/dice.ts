import {
  SlashCommandBuilder,
  EmbedBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import type { Command } from "../types.js";
const diceCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("주사위대결")
    .setDescription(
      "상대방과 주사위를 굴려 높은 숫자가 나오는 사람이 이깁니다."
    )
    .addUserOption((option) =>
      option
        .setName("상대")
        .setDescription("대결할 상대를 지목하세요")
        .setRequired(true)
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const challenger = interaction.user;
    const opponent = interaction.options.getUser("상대", true);
    if (opponent.bot)
      await interaction.reply({
        content: "봇과는 대결할 수 없습니다!",
        ephemeral: true,
      });
    if (opponent.id === challenger.id)
      await interaction.reply({
        content: "자기 자신과는 대결할 수 없습니다!",
        ephemeral: true,
      });
    const challengerRoll = Math.floor(Math.random() * 100) + 1;
    const opponentRoll = Math.floor(Math.random() * 100) + 1;

    let result = "";
    let color = "#ffffff";
    if (challengerRoll > opponentRoll) {
      result = `🏆 ${challenger.username}님의 승리!`;
      color = "#00ff00";
    } else if (challengerRoll < opponentRoll) {
      result = `🏆 ${opponent.username}님의 승리!`;
      color = "#ff0000";
    } else {
      result = "🤝 무승부입니다!";
      color = "#ffff00";
    }
    const diceEmbed = new EmbedBuilder()
      .setTitle("주사위 대결 결과")
      .setColor(color as any)
      .addFields(
        {
          name: `${challenger.username}`,
          value: `🎲 **${challengerRoll}**`,
          inline: true,
        },
        { name: "VS", value: "⚡", inline: true },
        {
          name: `${opponent.username}`,
          value: `🎲 **${opponentRoll}**`,
          inline: true,
        }
      )
      .setFooter({ text: result })
      .setColor(color as any)
      .setTimestamp();
    await interaction.reply({ embeds: [diceEmbed] });
  },
};
export default diceCommand;

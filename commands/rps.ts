import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  ComponentType,
} from "discord.js";
import type { Command } from "../types.js";
const rpsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("가위바위보")
    .setDescription("다른 사용자와 가위바위보 대결을 합니다")
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
        content: "봇은 대결할수 없어용",
        ephemeral: true,
      });
    if (opponent.id === challenger.id)
      await interaction.reply({
        content: "본인이랑은 대결할수 없어용",
        ephemeral: true,
      });
    const embed = new EmbedBuilder()
      .setTitle("가위바위보 막고라")
      .setDescription(
        `${challenger}님이 ${opponent} 님에게 대결을 신청했습니다`
      )
      .setColor("#362f30")
      .setTimestamp();
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("scissors")
        .setLabel("가위 ✌️")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("rock")
        .setLabel("바위 ✊")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("paper")
        .setLabel("보 ✋")
        .setStyle(ButtonStyle.Primary)
    );
    const response = await interaction.reply({
      content: `대결에 응하시겠습니까?`,
      embeds: [embed],
      components: [row],
    });
    const choices: { [key: string]: string } = {};
    const rpsLabels: { [key: string]: string } = {
      rock: "주먹 ✊",
      paper: "보 ✋",
      scissors: "가위 ✌️",
    };
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });
    collector.on("collect", async (i) => {
      if (i.user.id !== challenger.id && i.user.id !== opponent.id) {
        return await i.reply({
          content: "이 대결의 당사자가 아닙니다!",
          ephemeral: true,
        });
      }
      if (choices[i.user.id]) {
        return await i.reply({
          content: "이미 선택하셨습니다!",
          ephemeral: true,
        });
      }
      choices[i.user.id] = i.customId;
      await i.reply({
        content: `${rpsLabels[i.customId]}를 선택하셨습니다!`,
        ephemeral: true,
      });
      if (Object.keys(choices).length === 2) {
        collector.stop("finished");
      }
    });
    collector.on("end", async (_, reason) => {
      if (reason === "finished") {
        const challengerChoice = choices[challenger.id]!;
        const opponentChoice = choices[opponent.id]!;
        let result = "";
        if (challengerChoice === opponentChoice) {
          result = "무승부입니다!";
        } else if (
          (challengerChoice === "rock" && opponentChoice === "scissors") ||
          (challengerChoice === "scissors" && opponentChoice === "paper") ||
          (challengerChoice === "paper" && opponentChoice === "rock")
        ) {
          result = `${challenger}님이 이겼습니다!`;
        } else {
          result = `${opponent}님이 이겼습니다!`;
        }
        const resultEmbed = new EmbedBuilder()
          .setTitle("가위바위보 결과")
          .addFields(
            {
              name: challenger.username,
              value: rpsLabels[challengerChoice]!,
              inline: true,
            },
            { name: "VS", value: "⚡", inline: true },
            {
              name: opponent.username,
              value: rpsLabels[opponentChoice]!,
              inline: true,
            }
          )
          .setDescription(`**${result}**`)
          .setColor("#f1c40f");

        await interaction.editReply({
          content: "대결이 종료되었습니다!",
          embeds: [resultEmbed],
          components: [],
        });
      } else {
        await interaction.editReply({
          content: "시간이 초과되어 대결이 취소되었습니다.",
          embeds: [],
          components: [],
        });
      }
    });
  },
};
export default rpsCommand;
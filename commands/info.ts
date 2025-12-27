import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { Command } from "../types.js";

const infoCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("정보")
    .setDescription("메이플스토리 캐릭터 정보를 조회합니다.")
    .addStringOption((option) =>
      option.setName("닉네임").setDescription("조회할 캐릭터 이름").setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const characterName = interaction.options.getString("닉네임", true);
    const NEXON_API_KEY = process.env.NEXON_API_KEY;

    await interaction.deferReply();

    try {
      const idRes = await fetch(
        `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(characterName)}`,
        { headers: { "x-nxopen-api-key": NEXON_API_KEY! } }
      );
      const idData = (await idRes.json()) as { ocid?: string };

      if (!idData.ocid) {
        await interaction.editReply(`'${characterName}' 캐릭터를 찾을 수 없습니다.`);
        return;
      }

      const ocid = idData.ocid;

      const [infoRes, statRes] = await Promise.all([
        fetch(`https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`, {
          headers: { "x-nxopen-api-key": NEXON_API_KEY! },
        }),
        fetch(`https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${ocid}`, {
          headers: { "x-nxopen-api-key": NEXON_API_KEY! },
        }),
      ]);

      const info = await infoRes.json();
      const statData = await statRes.json();

      const combatPower = statData.final_stat.find(
        (s: any) => s.stat_name === "전투력"
      )?.stat_value;

      const formattedCombatPower = combatPower 
        ? Number(combatPower).toLocaleString() 
        : "정보 없음";

      const infoEmbed = new EmbedBuilder()
        .setColor("#ff9900")
        .setTitle(`${info.character_name} 캐릭터 정보`)
        .setThumbnail(info.character_image)
        .addFields(
          { name: "서버", value: info.world_name, inline: true },
          { name: "직업", value: info.character_class, inline: true },
          { name: "레벨", value: info.character_level.toString(), inline: true },
          { name: "🔥 전투력", value: `**${formattedCombatPower}**`, inline: false },
          { name: "길드", value: info.character_guild_name || "없음", inline: true }
        )
        .setFooter({ text: "Nexon Open API" })
        .setTimestamp();

      await interaction.editReply({ embeds: [infoEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply("정보를 가져오는 중 오류가 발생했습니다.");
    }
  },
};

export default infoCommand;
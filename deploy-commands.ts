import dotenv from "dotenv";
dotenv.config({ path: "./data.env" });

import { REST, Routes } from "discord.js";
import { loadCommands } from "./loader.js";

const commandList = await loadCommands();
const body = commandList.map((command) => command.data.toJSON());

if (
  !process.env.DISCORD_TOKEN ||
  !process.env.CLIENT_ID ||
  !process.env.GUILD_ID ||
  !process.env.NEXON_API_KEY
) {
  console.error("에러: data.env 파일에 필요한 설정 정보가 부족합니다.");
  process.exit(1);
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);
(async () => {
  try {
    console.log(`${body.length}개의 명령어를 서버에 등록하는 중...`);
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!,
        process.env.GUILD_ID!
      ),
      { body }
    );
    console.log("등록 완료!");
  } catch (error) {
    console.error(error);
  }
})();

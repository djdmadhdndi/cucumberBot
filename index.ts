import dotenv from "dotenv";

dotenv.config({ path: "./data.env" });

import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import type { Command } from "./types.js";
import { loadCommands } from "./loader.js";

console.log(
  "Token Loaded:",
  process.env.DISCORD_TOKEN
    ? "Yes (starts with " + process.env.DISCORD_TOKEN.substring(0, 5) + ")"
    : "No"
);

if (!process.env.DISCORD_TOKEN) {
  console.error(
    "에러: DISCORD_TOKEN이 설정되지 않았습니다. data.env 파일을 확인하세요."
  );
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = new Collection<string, Command>();

const commandList = await loadCommands();
for (const command of commandList) {
  commands.set(command.data.name, command);
}
console.log(`Loaded ${commands.size} commands.`);

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "오류가 발생했습니다!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

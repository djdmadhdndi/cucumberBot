import dotenv from "dotenv";

dotenv.config({ path: "./data.env" });

import { Client, GatewayIntentBits, Events, Collection, AttachmentBuilder } from "discord.js";
import type { Command } from "./types.js";
import { loadCommands } from "./loader.js";
import db from "./database.js";
import path from "path";
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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
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
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith("!")) return;
  const keyword = message.content.slice(1).trim();
  const row = db.prepare("SELECT file_name FROM image_memes WHERE keyword = ?").get(keyword) as { file_name: string } | undefined;
  if (row) {
    const filePath = path.join(process.cwd(), "images", row.file_name);
    const attachment = new AttachmentBuilder(filePath);
    await message.reply({ files: [attachment] });
  }
});
client.login(process.env.DISCORD_TOKEN);

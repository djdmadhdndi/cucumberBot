import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Command } from "./types.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadCommands(): Promise<Command[]> {
  const commands: Command[] = [];
  const commandsPath = path.join(__dirname, "commands");
  if (!fs.existsSync(commandsPath)) return [];
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(
      (file) =>
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.endsWith(".d.ts")
    );

  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const fileUrl = pathToFileURL(filePath).href;
      const module = await import(fileUrl);
      const command = module.default || module.command;
      if (command && "data" in command && "execute" in command) {
        commands.push(command as Command);
      } else {
        console.warn(`[경고] ${file} 파일에 유효한 export가 없습니다.`);
      }
    } catch (error) {
      console.error(`[오류] ${file} 파일을 로드하는 중 에러 발생:`, error);
    }
  }

  return commands;
}

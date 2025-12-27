import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";

const pingCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('check bot statics'),
    async execute(interaction) {
        await interaction.reply(' Pong!');
    },
};
export default pingCommand;
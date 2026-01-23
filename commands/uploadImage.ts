import {
    SlashCommandBuilder,
    type ChatInputCommandInteraction,
    PermissionFlagsBits
} from 'discord.js';
import db from "../database.js";
import path from "path";
import fs from "fs";
import axios from 'axios';
import type { Command } from "../types.js"

const uploadImageCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("이미지등록")
        .setDescription("(관리자 전용) 새 이미지를 등록합니다")
        // .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName("키워드")
                .setDescription("호출할 키워드")
                .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName("이미지")
                .setDescription("등록할 이미지(최대 10MB)")
                .setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const keyword = interaction.options.getString("키워드", true);
        const attachment = interaction.options.getAttachment("이미지", true);
        const MAX_SIZE = 10 * 1024 * 1024;
        if (attachment.size > MAX_SIZE) {
            await interaction.reply({
                content: "❌ 파일 용량이 너무 큽니다! 10MB 이하의 이미지만 가능합니다.",
                ephemeral: true,
            });
            return;
        }
        if (!attachment.contentType?.startsWith("image/")) {
            await interaction.reply({
                content: "❌ 이미지 파일만 등록할 수 있습니다.",
                ephemeral: true,
            });
            return;
        }
        await interaction.deferReply({ ephemeral: true });

        try {
            const extension = path.extname(attachment.name);
            const fileName = `${Date.now()}_${keyword}${extension}`;
            const savePath = path.join(process.cwd(), "images", fileName);

            const response = await axios.get(attachment.url, { responseType: "arraybuffer" });
            fs.writeFileSync(savePath, Buffer.from(response.data));
            const insert = db.prepare(`
        INSERT OR REPLACE INTO image_memes (keyword, file_name, original_name, creator_id)
        VALUES (?, ?, ?, ?)
      `);
            //아니 이게 왜 빠져있지;;;;;;;;;
            insert.run(keyword, fileName, attachment.name, interaction.user.id);
            await interaction.editReply({
                content: ` 등록 완료. 이제 \`!${keyword}\`라고 입력하면 이 이미지가 전송됩니다.`,
            });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: " 파일 저장 중 오류가 발생했습니다.",
            });
        }
    },
};
export default uploadImageCommand;
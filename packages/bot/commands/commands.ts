import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import Test from "./test"

const Commands = [Test]

export interface ICommand {
    data: SlashCommandBuilder,
    config: {
        registered: boolean,
        moderator: boolean
    },
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}

export default Commands
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js"
import Test from "./test"

const Commands = [Test]

export interface ICommand {
    data: any, //slash command builder magic that i dont fully get
    config: {
        registered: boolean,
        captain: boolean
    },
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}

export default Commands
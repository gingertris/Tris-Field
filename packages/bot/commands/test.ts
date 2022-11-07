import { ChatInputCommandInteraction, SlashCommandBuilder, REST, Routes } from "discord.js";
import { ICommand } from "./commands";

const Test: ICommand = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction: ChatInputCommandInteraction){

        interaction.reply("testing")
        
    },
    config:{
        registered:false,
        captain:false
    }
}

export default Test
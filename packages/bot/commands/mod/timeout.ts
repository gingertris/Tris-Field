import { ChatInputCommandInteraction, SlashCommandBuilder, REST, Routes } from "discord.js";
import { ICommand } from "../commands";

const Timeout: ICommand = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Test command"),
    async execute(interaction: ChatInputCommandInteraction){


    },
    config:{
        registered:false,
        captain:false
    }
}

export default Timeout
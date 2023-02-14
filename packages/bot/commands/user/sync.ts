import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder} from "discord.js";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const Sync: ICommand = {
    data: new SlashCommandBuilder()
        .setName("sync")
        .setDescription("Sync your roles"),
    async execute(interaction: ChatInputCommandInteraction){

        await syncRoles(interaction.member as GuildMember);

        interaction.reply("Roles synced.");
        
    },
    config:{
        registered:false,
        captain:false
    }
}

export default Sync
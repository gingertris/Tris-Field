import { GuildMemberRoleManager, SlashCommandBuilder } from "discord.js";
import { ICommand } from "../commands";

const Pings: ICommand = {
    data: new SlashCommandBuilder()
        .setName("pings")
        .setDescription("Turn pings on or off")
        .addStringOption(option => 
            option
                .setName("pings")
                .setDescription("Set ping option")
                .addChoices(
                    {name:"On", value:"on"},
                    {name:"Off", value:"off"}
                )
                .setRequired(true)

        ),
        
    async execute(interaction){

        const pings = interaction.options.getString("pings");
        const roleId = process.env.ROLE_PINGS;
        if(!roleId) throw new Error("ROLE_PIPNGS not defined in env");
        if(!interaction.guild) return;
        if(!interaction.member) return;
        switch(pings){
            case "on":
                (interaction.member.roles as GuildMemberRoleManager).add(roleId);
                interaction.reply({content:`You have been given the pings role.`, ephemeral:true});
                break;
            case "off":
                (interaction.member.roles as GuildMemberRoleManager).remove(roleId);
                interaction.reply({content:`You will no longer recieve pings.`, ephemeral:true});
                break;
        }

    },
    config:{
        registered:true,
        captain:false
    }
}

export default Pings;
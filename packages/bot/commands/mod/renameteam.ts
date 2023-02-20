import { fetchTeamByName, updateTeam } from "@tris-field/services/TeamService";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { ICommand } from "../commands";

const RenameTeam: ICommand = {
    data: new SlashCommandBuilder()
        .setName("renameteam")
        .setDescription("Rename a team")
        .addStringOption(option => 
            option
                .setName("target")
                .setDescription("Team to rename")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("teamname")
                .setDescription("New team name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(1)
        ),
    async execute(interaction: ChatInputCommandInteraction){
        const teamname = interaction.options.getString("target");
        const newName = interaction.options.getString("teamname");

        const team = await fetchTeamByName(teamname);

        if(!team){
            interaction.reply({content:"Can't find team. Make sure you typed it correctly.", ephemeral:true});
            return
        }

        if(!newName) {
            interaction.reply({content:"New team name cannot be empty.", ephemeral:true})
            return
        }

        await updateTeam(team.id, {
            name:newName,
            nameCaps:newName.toUpperCase()
        });

        interaction.reply({content:"Team updated.", ephemeral:true});

    },
    config:{
        registered:false,
        captain:false
    }
}

export default RenameTeam
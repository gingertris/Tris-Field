import { SlashCommandBuilder } from "discord.js";
import { fetchPlayer } from "../../../services/PlayerService";
import { updateTeam } from "../../../services/TeamService";
import { ICommand } from "../commands";

const Rename: ICommand = {
    data: new SlashCommandBuilder()
        .setName("rename")
        .setDescription("Rename a team")
        .addStringOption(option => 
            option
                .setName("name")
                .setDescription("Team name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(3)
        ),
    async execute(interaction){
        
        const captain = await fetchPlayer(interaction.user.id);
        if(!captain) return;
        if(!captain.team) return;

        const teamname = interaction.options.getString("name");
        if(!teamname) return;
        try{
            await updateTeam(captain.team.id, {
                name:teamname
            })
        } catch (err:any){
            interaction.reply({content:`A team called ${teamname} already exists. Please choose a different name.`, ephemeral:true});
            return
        }
        
        interaction.reply({content:`Team has been renamed to "${teamname}".`, ephemeral:true});

    },
    config:{
        registered:true,
        captain:true
    }
}

export default Rename;
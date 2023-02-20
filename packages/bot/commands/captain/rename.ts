import { SlashCommandBuilder } from "discord.js";
import { fetchPlayer } from "@tris-field/services/PlayerService";
import { updateTeam } from "@tris-field/services/TeamService";
import { ICommand } from "../commands";
import Filter from 'bad-words';

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

        const filter = new Filter;
        if(filter.isProfane(teamname)){
            interaction.reply({content:"Chosen team name contains profanity. Please try a different team name.", ephemeral:true});
            return
        }

        try{
            await updateTeam(captain.team.id, {
                name:teamname,
                nameCaps:teamname.toUpperCase()
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
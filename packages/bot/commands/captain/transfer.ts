import { SlashCommandBuilder } from "discord.js";
import { fetchPlayer } from "@tris-field//services/PlayerService";
import { updateTeam } from "@tris-field//services/TeamService";
import { ICommand } from "../commands";

const Transfer: ICommand = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Transfer ownership of team.")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Transfer ownership to this player.")
                .setRequired(true)
        ),
    async execute(interaction){
        const user = interaction.options.getUser('target');
        if(!user) return;
        
        const captain = await fetchPlayer(interaction.user.id);
        if(!captain) return;


        const newOwner = await fetchPlayer(user.id);
        if(!newOwner) {
            interaction.reply({content:"Can't find player. Are they registered?", ephemeral:true});
            return;
        }

        if(!captain.team) return;
        
        if(!newOwner.team){
            interaction.reply({content:"The person you are transferring ownership to needs to already be on the team.", ephemeral:true});
            return;
        } else if(newOwner.team.id != captain.team.id){
            interaction.reply({content:"The person you are transferring ownership to needs to already be on the team.", ephemeral:true});
            return;
        }

        try{ 
            await updateTeam(captain.team.id, {
                captainId:newOwner.id
            })
        } catch (err){
            interaction.reply({content:"Something went wrong.", ephemeral:true});
            return
        }
        
        interaction.reply({content:`Team ownership has been transferred to ${user.username}.`, ephemeral:true});

    },
    config:{
        registered:true,
        captain:true
    }
}

export default Transfer;
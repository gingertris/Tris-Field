import { SlashCommandBuilder } from "discord.js";
import { createInvite } from "../../../services/InviteService";
import { fetchPlayer } from "../../../services/PlayerService";
import { fetchTeam } from "../../../services/TeamService";
import { ICommand } from "../commands";

const Invite: ICommand ={
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite a player to your team")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Player to invite to your team.")
                .setRequired(true)
        ),
    async execute(interaction){
        const captain = await fetchPlayer(interaction.user.id);
        if(!captain) return;

        if(!captain.team){
            interaction.reply({content:`You need to \`/create\` a team before inviting people to your team.`, ephemeral:true})
            return
        }
    
        const team = await fetchTeam(captain.team.id)

        const playerUser = interaction.options.getUser("target");
        if(!playerUser) return;

   
        const player = await fetchPlayer(playerUser.id);
        if(!player){
            interaction.reply({content:`Couldn't find player. Are they registered?`, ephemeral:true});
            return
        }

        if(player.region != captain.region) {
            interaction.reply({content:"You can only invite people who are in the same region as you.", ephemeral:true});
            return;
        }

        await createInvite(player.id, captain.team.id);
        interaction.reply({content:`Invite sent. ${playerUser.username} can join ${captain.team.name} by using the \`/join\` command.`, ephemeral:true});
        return
        
    },
    config:{
        registered:true,
        captain:true
    }
}

export default Invite;
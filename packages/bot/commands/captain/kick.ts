import { SlashCommandBuilder } from "discord.js";
import { fetchPlayer, leaveTeam } from "@tris-field/services/PlayerService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const Kick: ICommand = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a player from your team")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Player to kick from your team.")
                .setRequired(true)
        ),
    async execute(interaction){

        const captain = await fetchPlayer(interaction.user.id);
        if(!captain) return;
        const playerUser = interaction.options.getUser("target");

        if(!playerUser) return;

        const guild = await interaction.guild;
        if(!guild) return;

        
        const player = await fetchPlayer(playerUser.id);
        if(!player){
            interaction.reply({content:`Can't find player. Are they registered?`, ephemeral:true});
            return;
        }

        if(!player.team){
            interaction.reply({content:`This player isn't on a team.`, ephemeral:true});
            return;
        }

        if(!captain.team){
            interaction.reply({content:`You need to be on a team to kick a player.`, ephemeral:true});
            return;
        }

        if(player.team.id != captain.team.id) {
            interaction.reply({content:"The player you're kicking needs to be on your team to begin with.", ephemeral:true});
            return;
        }

        const member = await guild.members.fetch(playerUser.id);


        await leaveTeam(player.id);
        await syncRoles(member);
        interaction.reply({content:`${playerUser.username} has been kicked from the team.`, ephemeral:true});
        return



        
    },
    config:{
        registered:true,
        captain:true
    }
}

export default Kick;
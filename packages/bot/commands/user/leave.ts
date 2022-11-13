import { GuildMember, SlashCommandBuilder } from "discord.js";
import { fetchPlayer, isCaptain, leaveTeam } from "@tris-field/services/PlayerService";
import { deleteTeam, fetchTeam } from "@tris-field/services/TeamService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const Leave: ICommand = {
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leave team"),
    async execute(interaction){
        
        const player = await fetchPlayer(interaction.user.id);
        if(!player) return;

        if(!player.team){
            interaction.reply({content:`You already aren't in a team.`, ephemeral:true});
            return
        }
        

        const team = await fetchTeam(player.team.id);
        if(!team) return;
        const members = team.players.length;

        if(await isCaptain(player.id) && (members > 1)){
            interaction.reply({content:`You cannot leave a team you are the captain of, unless you are the only team member.\nPlease \`/transfer\` ownership of the team to someone else before leaving.`, ephemeral:true});
            return
        }

        await leaveTeam(player.id);
        let message = `You have left your team.`;

        if(members==1){
            await deleteTeam(team.id);
            message += `\nYou were the last member of your team, therefore the team has been deleted.`;
            
        }

        await syncRoles(interaction.member as GuildMember)
        interaction.reply({content:message, ephemeral:true});


    },
    config:{
        registered:true,
        captain:false
    }
}

export default Leave
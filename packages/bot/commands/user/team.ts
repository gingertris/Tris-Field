import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { fetchPlayer } from "../../../services/PlayerService";
import { fetchTeam, fetchTeamByName } from "../../../services/TeamService";
import { ICommand } from "../commands";


const Team: ICommand = {
    data: new SlashCommandBuilder()
        .setName("team")
        .setDescription("Show team information.")
        .addStringOption(option => 
            option
                .setName('team')
                .setDescription("Show information of a certain team.")
        ),
    async execute(interaction){
        
        let teamname = interaction.options.getString("team");
        let team;
        if(teamname){
            team = await fetchTeamByName(teamname)
        } else{
            const player = await fetchPlayer(interaction.user.id);
            if(!player) return;

            if(!player.team){
                interaction.reply({content:"You aren't currently in a team.", ephemeral:true});
                return;
            }
            team = await fetchTeam(player.team.id)
        }

        if(!team){
            interaction.reply({content:"Couldn't find team. Are you sure you spelled the team name right?", ephemeral:true});
            return;
        }
        
        let usernames = team.players.map(p => p.name);
        let captain = await fetchPlayer(team.captainId);

        const embed = new EmbedBuilder()
        .setColor("Fuchsia")
        .setTitle(`Info for ${team.name}`)
        .addFields(
            {name: "Captain", value: `${captain?.name ?? "Couldn't find captain."}`},
            {name: "Members", value: `${usernames.join("\n")}`},
            {name: "Region", value: `${team.region}`},
            {name: "Division", value: `${team.division}`},
            {name: "Rating", value:`${team.rating}`},
            {name: "Monthly roster additions remaining", value:`${team.changesRemaining}`}
        )

        interaction.reply({embeds:[embed], ephemeral:true})
    },
    config:{
        registered:true,
        captain:false
    }
}

export default Team;
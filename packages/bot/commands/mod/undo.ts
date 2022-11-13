import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchMatch, updateMatch } from "@tris-field/services/MatchService";
import { updateTeam } from "@tris-field/services/TeamService";
import { ICommand } from "../commands";


const Undo: ICommand = {
    data: new SlashCommandBuilder()
        .setName("undo")
        .setDescription("Undo match")
        .addIntegerOption(option => 
            option
                .setName("id")
                .setDescription("Match ID to undo")
                .setRequired(true)
        ),
    async execute(interaction){
        const matchId = interaction.options.getInteger('id')
        if(!matchId) return;
        let match = await fetchMatch(matchId);

        if(!match){
            interaction.reply({content:`Couldn't find match.`, ephemeral:true});
            return
        }

        if(match.winnerId == null) {
            interaction.reply({content:`This match hasn't been played yet. To cancel the match, use \`/cancel.\``, ephemeral:true});
            return
        }

        await updateTeam(match.team1.id, {
            rating: match.team1.rating - match.team1Difference,
            gamesPlayed: match.team1.gamesPlayed - 1
        });

        await updateTeam(match.team2.id, {
            rating: match.team2.rating - match.team2Difference,
            gamesPlayed: match.team2.gamesPlayed - 1
        });

        await updateMatch(match.id, {
            winnerId: null,
            team1Difference: 0,
            team2Difference: 0
        })

        interaction.reply({content:`Match undone. You can now report correctly.`, ephemeral:true});
        return

    },
    config:{
        registered:true,
        captain:false
    }
}

export default Undo;
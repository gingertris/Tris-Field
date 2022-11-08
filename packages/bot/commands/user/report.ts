import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchMatch } from "../../../services/MatchService";
import { fetchPlayer } from "../../../services/PlayerService";
import { messageCaptains, reportMatch } from "../../utils/report";
import { ICommand } from "../commands";


const Report: ICommand = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report Score")
        .addIntegerOption(option => 
            option
                .setName("id")
                .setDescription("Match ID to report")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("result")
                .setDescription("Match Result")
                .setRequired(true)
                .addChoices(
                    {name:"Win", value:"win"},
                    {name:"Loss", value:"loss"}
                )
        ),
    async execute(interaction){
        const matchId = interaction.options.getInteger('id');
        if(!matchId) return;
        const result = interaction.options.getString('result');
        if(!result) result;

        const player = await fetchPlayer(interaction.user.id);
        if(!player) return;

        if(!player.team){
            interaction.reply({content:`You aren't in a team, so you can't report scores.`, ephemeral:true});
            return
        }

        let match = await fetchMatch(matchId);
        if(!match){
            interaction.reply({content:`Couldn't find match. Check you are using the correct Match ID.`, ephemeral:true});
            return
        }

        if(match.winnerId != null) {
            interaction.reply({content:`This match has already been reported. If you think this match was reported incorrectly, please contact a moderator.`, ephemeral:true});
            return
        }

        let winner = 0;

        if(match.team1.id == player.team.id){
            if(result == "win"){
                winner = 1;
            } else if(result == "loss"){
                winner = 2;
            } else{
                interaction.reply({content:`Result needs to be either 'Win' or Loss.`, ephemeral:true});
                return
            }
        } else if(match.team2.id == player.team.id){
            if(result == "win"){
                winner = 2;
            } else if(result == "loss"){
                winner = 1;
            } else{
                interaction.reply({content:`Result needs to be either 'Win' or Loss.`, ephemeral:true});
                return
            }
        } else{
            interaction.reply({content:`Your team wasn't in this lobby, so you can't report the score.`, ephemeral:true});
            return
        }

        if(winner !=1 && winner != 2){
            interaction.reply({content:`Something went wrong, score wasn't reported.`, ephemeral:true});
            return
        }

        match = await reportMatch(match.id, winner);

        await messageCaptains(interaction.client, match.id)

        interaction.reply({content:`Scores have been reported, and Team Captains have been messaged details.`, ephemeral:true});
        return

    },
    config:{
        registered:true,
        captain:false
    }
}

export default Report;
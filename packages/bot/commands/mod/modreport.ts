import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { fetchMatch } from "@tris-field/services/MatchService";
import { fetchPlayer } from "@tris-field/services/PlayerService";
import { messageCaptains, reportMatch } from "../../utils/report";
import { ICommand } from "../commands";


const ModReport: ICommand = {
    data: new SlashCommandBuilder()
        .setName("modreport")
        .setDescription("Report Score (Mods)")
        .addIntegerOption(option => 
            option
                .setName("id")
                .setDescription("Match ID to report")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("result")
                .setDescription("Match Winner")
                .setRequired(true)
                .addChoices(
                    {name:"Team 1", value:"1"},
                    {name:"Team 2", value:"2"}
                )
        ),
    async execute(interaction){
        const matchId = interaction.options.getInteger('id');
        if(!matchId) return;
        const result = interaction.options.getString('result');
        if(!result) result;


        let match = await fetchMatch(matchId);
        if(!match){
            interaction.reply({content:`Couldn't find match. Check you are using the correct Match ID.`, ephemeral:true});
            return
        }

        if(match.winnerId != null) {
            interaction.reply({content:`This match has already been reported. To first undo this match, do \`/undo ${matchId}\`.`, ephemeral:true});
            return
        }

        const winner = parseInt(result);

        if(winner !=1 && winner != 2){
            interaction.reply({content:`Something went wrong, score wasn't reported.`, ephemeral:true});
            return
        }

        match = await reportMatch(match.id, winner);

        await messageCaptains(interaction.client, match.id);

        interaction.reply({content:`Scores have been reported, and Team Captains have been messaged details.`, ephemeral:true});
        
        return

    },
    config:{
        registered:true,
        captain:false
    }
}

export default ModReport;
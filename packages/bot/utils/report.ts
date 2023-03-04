import { Client, EmbedBuilder } from 'discord.js';
import EloRank from 'elo-rank';
import { fetchMatch, updateMatch } from '@tris-field/services/MatchService';
import { updateTeam } from '@tris-field/services/TeamService';

type winnerType = 1 | 2

export const reportMatch = async (matchId:number, winnerVal:winnerType) => {

    const match = await fetchMatch(matchId);
    if(!match) throw new Error("Couldn't find match.")

    const winner = winnerVal == 1 ? match.team1 : match.team2;
    const loser = winnerVal == 2 ? match.team1 : match.team2;

    const oldWinnerRating = winner.rating;
    const oldLoserRating = loser.rating;

    // eslint-disable-next-line prefer-const
    let {winner: newWinnerRating, loser: newLoserRating} = calcuateRating(oldWinnerRating, oldLoserRating)

    if(match.powerHour) {
        //1.5x multiplier
        let difference = newWinnerRating - oldWinnerRating;
        difference = difference * 1.5
        newWinnerRating = oldWinnerRating + difference;
    }

    const team1Difference = winnerVal == 1 ? newWinnerRating - oldWinnerRating : newLoserRating - oldLoserRating;
    const team2Difference = winnerVal == 2 ? newWinnerRating - oldWinnerRating : newLoserRating - oldLoserRating;

    await updateTeam(winner.id, {
        rating:newWinnerRating,
        gamesPlayed: winner.gamesPlayed + 1,
        changesRemaining: winner.changesRemaining < 0 ? 1 : winner.changesRemaining //if first match after team creation, set to 1 change remaining
    })

    await updateTeam(loser.id, {
        rating:newLoserRating,
        gamesPlayed: loser.gamesPlayed + 1,
        changesRemaining: loser.changesRemaining  > 0 ? 1 : loser.changesRemaining //if first match after team creation, set to 1 change remaining
    })

    return await updateMatch(matchId, {
        winnerId: winner.id,
        team1Difference: team1Difference,
        team2Difference: team2Difference
    });

}

const calcuateRating = (winner:number, loser:number) => {
    const elo = new EloRank(32);
    const expectedScoreWinner = elo.getExpected(winner, loser);
    const expectedScoreLoser = elo.getExpected(loser, winner);

    return {winner:elo.updateRating(expectedScoreWinner, 1, winner), loser: elo.updateRating(expectedScoreLoser, 0, loser)}

}

export const messageCaptains = async (client:Client, matchId:number) => {

    const match = await fetchMatch(matchId);
    if(!match) throw new Error("Couldn't find match.")

    const winners = match.team1.id == match.winnerId ? match.team1 : match.team2;
    const losers = match.team1.id == match.winnerId ? match.team2 : match.team1;

    const winnersDiff = match.team1.id == match.winnerId ? match.team1Difference : match.team2Difference;
    const losersDiff = match.team1.id == match.winnerId ? match.team2Difference : match.team1Difference;

    const embed = new EmbedBuilder()
        .setTitle("Score Reported")
        .setColor("Fuchsia")
        .setDescription(`Match #${match.id} was reported.`)
        .setTimestamp()
        .setFooter({text:`Match ID: ${match.id}`});
  
    embed.addFields({name:"Winner", "value":`${winners.name} (${winners.rating} +${winnersDiff})`, inline:true});
    embed.addFields({name:"Loser", "value":`${losers.name} (${losers.rating} ${losersDiff})`, inline:true});

    embed.addFields({name:"Is this wrong?", value:"If you believe this score was reported incorrectly, please contact a moderator."});


    (await client.users.fetch(match.team1.captainId)).send({embeds:[embed]});
    (await client.users.fetch(match.team2.captainId)).send({embeds:[embed]});
}
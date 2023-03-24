import { deletePlayer, fetchPlayer, leaveTeam } from "@tris-field/services/PlayerService";
import { fetchTeam, updateTeam, deleteTeam } from "@tris-field/services/TeamService";
import { GuildMember } from "discord.js";

export default async function (member: GuildMember) {
    const player = await fetchPlayer(member.id);
    if(!player) return;
    if(player.team){
        const team = await fetchTeam(player.team.id);
        if(team.captainId == member.id){
            if(team.players.length == 1){
                await deleteTeam(team.id);
            } else{
                const newCaptain = team.players[Math.floor(Math.random() * team.players.length)];
                await updateTeam(team.id, {
                    captainId:newCaptain.id
                });
                (await member.client.users.fetch(newCaptain.id)).send("Since the captain of your team left the server, you have randomly been made the new captain of your team.")
            }
        }
        await leaveTeam(member.id);
    }
    await deletePlayer(member.id);
}
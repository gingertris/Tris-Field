import { error } from '@sveltejs/kit';
import { fetchPlayer } from '@tris-field/services/PlayerService';
import { fetchTeam } from '@tris-field/services/TeamService';

export async function load({ params }) {
    
    let id = params.id;
    let idInt = parseInt(id);

    let team = await fetchTeam(idInt);
    if(!team) throw error(404, `Team with id ${idInt} not found`);

    const captain_name = (await fetchPlayer(team.captainId)).name;

    return {
        team,
        captain_name
    }

}
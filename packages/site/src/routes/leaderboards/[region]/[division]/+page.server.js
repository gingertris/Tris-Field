import { error } from '@sveltejs/kit';
import { fetchTeams } from '@tris-field/services/TeamService';

export async function load({ params }) {
    
    let region = params.region.toUpperCase();
    let division = params.division.toUpperCase();

    
    if (region != "EU" && region != "NA"){
        throw error(404, "Region must be 'eu' or 'na'");
    }
    if (division != "OPEN" && division != "CLOSED"){
        throw error(404, "Division must be 'open' or 'closed'");
    }


    let teams = await fetchTeams();
    teams = teams.filter(team => team.division == division && team.region == region && team.gamesPlayed > 0).sort((a,b) => {return b.rating - a.rating});

    return {
        title:`${region} - ${division} Division`,
        teams: teams
    }

}
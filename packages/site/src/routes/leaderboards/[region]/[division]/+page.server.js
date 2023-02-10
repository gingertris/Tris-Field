import { error } from '@sveltejs/kit';
import { BASE_API_URL } from "$env/static/private";

export async function load({ params }) {
    
    let region = params.region.toUpperCase();
    let division = params.division.toUpperCase();

    const response = await fetch(`${BASE_API_URL}/teams?region=${region}&division=${division}`);

    if(!response.ok) throw error(response.status,  (await response.json()).message)

    let teams = await response.json();
    teams = teams.sort((a,b) => {return b.rating - a.rating});

    return {
        title:`${region} - ${division} Division`,
        teams: teams
    }

}
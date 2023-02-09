import { error } from '@sveltejs/kit';
import { BASE_API_URL } from "$env/static/private";

export async function load({ params }) {
    
    let id = params.id;
    const response = await fetch(`${BASE_API_URL}/teams/${id}`)

    if(!response.ok) throw error(response.status, (await response.json()).message);

    const team = await response.json();

    return {
        team
    }

}
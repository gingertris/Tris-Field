import { error } from '@sveltejs/kit';
import { BASE_API_URL } from "$env/static/private";


export async function load({ params }) {

    const id = params.id;

    const response = await fetch(`${BASE_API_URL}/players/${id}`)


    if(!response.ok) throw error(response.status,  (await response.json()).message);


    const player = await response.json();

    return {
        player
    }

}
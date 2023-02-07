import { error } from '@sveltejs/kit';
import { fetchPlayer } from '@tris-field/services/PlayerService';


export async function load({ params }) {

    const id = params.id;

    const player = await fetchPlayer(id);
    if(!player) throw error(404, `Player with id ${id} not found`);

    return {
        player
    }

}
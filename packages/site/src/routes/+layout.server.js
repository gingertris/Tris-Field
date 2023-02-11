import { SITE_TITLE } from "$env/static/private";

export async function load() {
    
    return {
        title: SITE_TITLE
    }

}
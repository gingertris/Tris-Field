import {SvelteKitAuth} from "@auth/sveltekit"
import Discord from '@auth/core/providers/discord';
import { DISCORD_ID, DISCORD_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
  trustHost:true,
  providers: [
    Discord({ clientId: DISCORD_ID, clientSecret: DISCORD_SECRET }),
  ],

  callbacks: {
      async session({session, token}){
        session.user.id = token.sub
        return session
      }
  },

});
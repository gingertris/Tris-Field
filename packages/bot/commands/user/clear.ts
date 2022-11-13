import { SlashCommandBuilder } from "discord.js";
import { updateInvite } from "@tris-field/services/InviteService";
import { fetchPlayer } from "@tris-field/services/PlayerService";
import { ICommand } from "../commands";

const Clear: ICommand = {
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clear all  your invites."),
    async execute(interaction){
        const player = await fetchPlayer(interaction.user.id);
        if(!player) return;
        player.invites.forEach(async invite => {
            updateInvite(invite.playerId, invite.teamId, true)
        })
        interaction.reply({content:`Invites cleared.`, ephemeral:true})
    },
    config:{
        registered:true,
        captain:false
    }
}

export default Clear;
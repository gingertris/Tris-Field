import { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder , ComponentType, ChatInputCommandInteraction, Guild, GuildMember, SelectMenuOptionBuilder } from "discord.js";
import { fetchInvite, updateInvite } from "@tris-field/services/InviteService";
import { fetchPlayer, setTeam } from "@tris-field/services/PlayerService";
import { fetchTeam, updateTeam } from "@tris-field/services/TeamService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const Join: ICommand = {
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("Join a team by accepting an invite."),
    async execute(interaction){
        const player = await fetchPlayer(interaction.user.id);
        if(!player) return;

        if(player.team){
            interaction.reply({content:"You are already in a team. Please `/leave` your current team to join a new one.", ephemeral:true});
            return;
        }

        const invites = player.invites.filter(i => (!i.answered) && (i.teamId));

        if(invites.length == 0){
            interaction.reply({content:"You have no invites.", ephemeral:true})
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("Fuchsia")
            .setTitle("Join team")
            .setDescription("Accept an invite to join a team.\nThis will time out in 60 seconds.");

        const selectMenu = new SelectMenuBuilder()
            .setCustomId('join')
            .setPlaceholder("Select a team");

        let options:SelectMenuOptionBuilder[] = [];
        invites.forEach(i =>{
            selectMenu.addOptions({
                label: i.team.name,
                value: `${i.id}`
            })
        })



        console.log(options)
        

        const row1 = new ActionRowBuilder<SelectMenuBuilder>()
            .addComponents([selectMenu])
        
        const message = await interaction.reply({embeds:[embed], components: [row1], ephemeral:true, fetchReply:true})

        const filter = (i: any ) => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        try{
            const response = await message.awaitMessageComponent({ filter, componentType: ComponentType.StringSelect, time: 60000});
        
            const inviteId = parseInt(response.values[0]);
            const invite = await fetchInvite(inviteId);
            if(!invite){
                interaction.followUp({content:`Something went wrong. Couldn't find invite.`,ephemeral:true});
                return
            }
            const team = await fetchTeam(invite.teamId);
            if(!team) {
                interaction.followUp({content:`Something went wrong, couldn't find team.`,ephemeral:true});
                return;
            }
            await setTeam(player.id, invite.teamId);
            await updateTeam(invite.teamId, {
                changesRemaining: team.changesRemaining - 1 
            })
            await updateInvite(invite.id, true);            

            await syncRoles(interaction.member as GuildMember);            

            interaction.followUp({content:`You have joined "${team.name}"!`,ephemeral:true});
        }catch(err){
            interaction.followUp({content:`Command timed out.`,ephemeral:true});
        }

    },
    config:{
        registered:true,
        captain:false
    }
}

export default Join;
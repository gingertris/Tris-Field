import { SlashCommandBuilder,  ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, GuildMember } from "discord.js";
import { fetchPlayer } from "@tris-field/services/PlayerService";
import { deleteTeam, fetchTeam } from "@tris-field/services/TeamService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const Delete: ICommand =  {
    data: new SlashCommandBuilder()
        .setName("delete")
        .setDescription("Delete team"),
    async execute(interaction){
        
        const captain = await fetchPlayer(interaction.user.id);
        if(!captain?.team){
            await interaction.reply({content:"You aren't in a team.",ephemeral:true})
            return;
        }
        const deleteButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel("Delete Team")
            .setCustomId('delete')

        const dontDeleteButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("Keep Team")
            .setCustomId('keep')

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(dontDeleteButton)
            .addComponents(deleteButton)

        const message = await interaction.reply({content:"Are you sure you want to delete your team? This cannot be undone.", components: [row], ephemeral:true, fetchReply:true})

        const filter = (i:any) => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        try{
            const response = await message.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 60000});
        
            const answer = response.customId;

            if(answer=="delete"){
                const team = await fetchTeam(captain.team.id);
                const players = team.players;
                await deleteTeam(captain.team.id);
                for(const player of players){
                    const member = await interaction.guild.members.fetch(player.id);
                    await syncRoles(member);
                }
                interaction.followUp({content:`Team has been deleted.`,ephemeral:true});
            } else{
                interaction.followUp({content:`Team has not been deleted.`,ephemeral:true});
            }

        }catch(err){
            console.log(err);
            interaction.followUp({content:`Command timed out.`,ephemeral:true});
        }

    },
    config:{
        captain:true,
        registered:true
    }
}

export default Delete;
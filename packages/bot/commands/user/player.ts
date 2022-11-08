import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { fetchPlayer } from "../../../services/PlayerService";
import { ICommand } from "../commands";

const Player: ICommand =  {
    data: new SlashCommandBuilder()
        .setName("player")
        .setDescription("Show player information.")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Show information of a certain player.")
        ),
    async execute(interaction){

        const user = interaction.options.getUser('target') ?? interaction.user;
            
        const player = await fetchPlayer(user.id);
        if(!player){
            interaction.reply({content:"Can't find player. Are they registered?", ephemeral:true});
            return
        }
    
        const embed = new EmbedBuilder()
        .setColor("Fuchsia")
        .setTitle(`Info for ${user.username}`)
        .addFields(
            {name: "Region", value: `${player.region}`}
        )
        if(player.team){
            embed.addFields({name: "Team", value:`${player.team.name}`})
        }

        interaction.reply({embeds:[embed], ephemeral:true})
    },
    config:{
        registered:true,
        captain:false
    }
}

export default Player
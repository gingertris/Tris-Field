import { fetchPlayer, updatePlayer } from "@tris-field/services/PlayerService";
import { ChatInputCommandInteraction, SlashCommandBuilder, REST, Routes } from "discord.js";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const RenamePlayer: ICommand = {
    data: new SlashCommandBuilder()
        .setName("renameplayer")
        .setDescription("Rename a player")
        .addUserOption(option => 
            option
                .setName('target')
                .setDescription("Player to rename.")
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName("username")
                .setDescription("New username")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(1)
        ),
    async execute(interaction: ChatInputCommandInteraction){
        const user = interaction.options.getUser('target');
        const newName = interaction.options.getString("username");

        const player = await fetchPlayer(user.id);
        if(!player){
            interaction.reply({content:"Can't find player. Are they registered?", ephemeral:true});
            return
        }

        if(!newName) {
            interaction.reply({content:"Username cannot be empty.", ephemeral:true})
            return
        }

        await updatePlayer(user.id, {
            name:newName
        });

        const member = await interaction.guild.members.fetch(user.id);

        try{
            await syncRoles(member);
            await member.setNickname(newName);
        } catch(err:any){
            console.log("unable to change nickname of user " + member.user.username)
        }


        interaction.reply({content:"Player updated.", ephemeral:true});

    },
    config:{
        registered:false,
        captain:false
    }
}

export default RenamePlayer
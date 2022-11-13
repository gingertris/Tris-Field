import { GuildMember, SlashCommandBuilder } from "discord.js";
import { fetchPlayer, setTeam } from "@tris-field/services/PlayerService";
import { createTeam } from "@tris-field/services/TeamService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";


const Create: ICommand = {
    data: new SlashCommandBuilder()
        .setName("create")
        .setDescription("Create a new team")
        .addStringOption(option => 
            option
                .setName("name")
                .setDescription("Team name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(3)
        ),
    async execute(interaction){

        
        const player = await fetchPlayer(interaction.user.id);
        if(!player) return;

        if(player.team) {
            interaction.reply({content:"You are already in a team. Please leave your current team if you want to make a new team.", ephemeral:true})
            return
        }

        const teamname = interaction.options.getString("name");
        if(!teamname) return;

        let team;
        try{
            team = await createTeam(teamname, player.id, player.region);
        } catch (err:any){
            interaction.reply({content:`A team called ${teamname} already exists. Please choose a different name.`, ephemeral:true});
            return
        }
        await setTeam(player.id, team.id);
        await syncRoles(interaction.member as GuildMember);
        interaction.reply({content:`Team "${teamname}" has been created.`, ephemeral:true});

    },
    config:{
        registered:true,
        captain:false
    }
}

export default Create;
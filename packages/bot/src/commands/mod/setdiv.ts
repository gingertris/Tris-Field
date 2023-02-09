import { SlashCommandBuilder } from "discord.js";
import { fetchTeamByName, updateTeam } from "@tris-field/services/TeamService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";


const SetDiv: ICommand = {
    data: new SlashCommandBuilder()
        .setName("setdiv")
        .setDescription("Set division of a team")
        .addStringOption(option => 
            option
                .setName("name")
                .setDescription("Team Name")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(3)
        )
        .addStringOption(option => 
            option
                .setName("division")
                .setDescription("Division")
                .setRequired(true)
                .addChoices(
                    {name:"Open", value:"OPEN"},
                    {name:"Closed", value:"CLOSED"}
                )
        ),
    async execute(interaction){

        const teamname = interaction.options.getString("name");
        if(!teamname) return;
        const division = interaction.options.getString("division");
        if(division != "OPEN" && division != "CLOSED") return;

        const team = await fetchTeamByName(teamname);
        if(!team){
            interaction.reply({content:"Team not found.", ephemeral:true})
            return
        }

        await updateTeam(team.id, {
            division:division
        })

        const guildId = process.env.GUILD_ID;
        if(!guildId) throw new Error("GUILD_ID not defined in env")

        team.players.forEach(async (player) => {
            try{
                await syncRoles(await (await interaction.client.guilds.fetch(guildId)).members.fetch(player.id));
            } catch(e){
                console.log(e);
            }
            
        })

        interaction.reply({content:"Team updated.", ephemeral:true})
        return
    },
    config:{
        registered:true,
        captain:false
    }
}

export default SetDiv;
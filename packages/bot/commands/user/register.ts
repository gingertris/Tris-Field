import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { createPlayer, fetchPlayer } from "../../../services/PlayerService";
import syncRoles from "../../utils/syncRoles";
import { ICommand } from "../commands";

const Register: ICommand = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register for Tris' Field")
                .addStringOption(option => 
            option
                .setName("username")
                .setDescription("Set your username")
                .setRequired(true)
                .setMaxLength(32)
                .setMinLength(1)

        )
        .addStringOption(option => 
            option
                .setName("region")
                .setDescription("Region")
                .setRequired(true)
                .addChoices(
                    {name:"Europe", value:"EU"},
                    {name:"North America", value:"NA"}
                )
        ),

    async execute (interaction: ChatInputCommandInteraction){
        const id = interaction.user.id;
        const region = interaction.options.getString("region");
        const username = interaction.options.getString("username");

        if(!interaction.member) return;

        let player = await fetchPlayer(id);
        if(player){
            interaction.reply({content:"You are already registered. If you want to change region, please contact an administrator.", ephemeral:true})
            return
        }

        if(!username) {
            interaction.reply({content:"Username cannot be empty.", ephemeral:true})
            return
        }

        if(region != "EU" && region != "NA") {
            interaction.reply({content:"Region must be either `EU` or `NA`.", ephemeral:true})
            return
        }

        player = await createPlayer(id, username, region);
                
        try{
            const member = interaction.member as GuildMember;
            await syncRoles(member);
            await member.setNickname(username);
        } catch(err:any){
            console.log("unable to change nickname of user " + username)
        }
        
        interaction.reply({content:"You have successfully registered. Enjoy!", ephemeral:true});


    },
    config:{
        registered:false,
        captain:false
    }
}

export default Register;
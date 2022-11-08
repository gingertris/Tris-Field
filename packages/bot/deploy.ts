import { REST, Routes } from "discord.js";
import Commands from "./commands/commands";
import * as dotenv from 'dotenv';
dotenv.config();
(async ()=> {
    try{

		const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN ?? "token not found");
		let commandsJSON = [];
		// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
		for (let command of Commands) {
			commandsJSON.push(command.data.toJSON());
		}

		console.log("Putting commands to endpoint")
		if(process.env.BOT_CLIENT_ID && process.env.GUILD_ID){
			await rest.put(Routes.applicationGuildCommands(process.env.BOT_CLIENT_ID, process.env.GUILD_ID), {
				body:commandsJSON
			});
		}
		
		console.log("Commands deployed.")
	} catch(e:any){
		console.log(e.message)
	}
})()

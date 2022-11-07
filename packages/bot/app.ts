import {Client, GatewayIntentBits, Events, Collection, REST, Routes} from 'discord.js';
import * as dotenv from 'dotenv';
import { fetchPlayer, isCaptain } from '../services/PlayerService';
import Commands, { ICommand } from './commands/commands'
dotenv.config();

const client = new Client({intents:[GatewayIntentBits.Guilds]})
const loadedCommands: Collection<string, ICommand> = new Collection();

for (const command of Commands) {
	loadedCommands.set(command.data.name, command);
}

//on ready
client.once(Events.ClientReady, async () => {
    if(!client.user) return; 
	console.log(`Logged in as ${client.user.tag}!`);

	//deploy commands
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

});

//command handler
client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	const command = loadedCommands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	const player = await fetchPlayer(interaction.user.id);
	if(command.config.registered){
		if(!player) {
			await interaction.reply({ content: 'You need to be registered to use this command.', ephemeral: true });
			return
		};
	}

	if(command.config.captain){
		if(!(await isCaptain(interaction.user.id))) {
			await interaction.reply({ content: 'You need to be the captain of your team to use this command.', ephemeral: true });
			return
		};
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(process.env.BOT_TOKEN);
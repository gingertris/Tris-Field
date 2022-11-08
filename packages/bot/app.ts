import {Client, GatewayIntentBits, Events, Collection, REST, Routes} from 'discord.js';
import * as dotenv from 'dotenv';
import { fetchPlayer, isCaptain } from '../services/PlayerService';
import Commands, { ICommand } from './commands/commands'
import { handleJoinQueue, handleLeaveQueue } from './utils/queue';
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
});

//command handler
client.on(Events.InteractionCreate, async interaction => {

	//handle queue buttons
	if (interaction.isButton()) {
		try{
			if (interaction.customId == 'joinqueue') return await handleJoinQueue(interaction);
			if (interaction.customId == 'leavequeue') return await handleLeaveQueue(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			return
		}
	}


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
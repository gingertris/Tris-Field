import { ButtonInteraction, ChannelType, Client } from "discord.js";
import { fetchPlayer } from "@tris-field/services/PlayerService";
import { clearQueue, isQueued, joinQueue, leaveQueue } from "@tris-field/services/QueueService";
import { fetchTeam } from "@tris-field/services/TeamService";

export const handleJoinQueue = async (interaction: ButtonInteraction) => {

    const player = await fetchPlayer(interaction.user.id);

    if(!player?.team){
        interaction.reply({content:"You aren't in a team.", ephemeral:true});
        return
    }

    const team = await fetchTeam(player.team.id)
    
    if(!team) return;

    if(team.players.length < 3){
        interaction.reply({content:"Your team needs to have at least 3 members to be able to queue.", ephemeral:true});
        return
    }

    if((await isQueued(player.team.id))){
        interaction.reply({content:`You are already in the queue!`, ephemeral:true})
        return
    }

    await joinQueue(team.id, team.region, team.division);

    interaction.reply({content:"You have joined the queue.", ephemeral:true})
}

export const handleLeaveQueue =  async (interaction: ButtonInteraction) => {
    
    const player = await fetchPlayer(interaction.user.id);

    if(!player?.team){
        interaction.reply({content:"You aren't in a team.", ephemeral:true});
        return
    }

    const team = await fetchTeam(player.team.id)
    
    if(!team) return;

    if(!(await isQueued(player.team.id))){
        interaction.reply({content:`You already aren't in the queue.`, ephemeral:true})
        return
    }

    await leaveQueue(team.id);
    
    interaction.reply({content:"You have left the queue.", ephemeral:true})
}

export const openQueue = async (client:Client, region:"EU"|"NA") => {
    

    await clearQueue(region)

    const queueChannelId = process.env.CHANNEL_QUEUE;
    if(!queueChannelId) throw new Error("CHANNEL_QUEUE not in env");

    const euId = process.env.ROLE_EU;
    if(!euId) throw new Error("ROLE_EU not in env");

    const naId = process.env.ROLE_NA;
    if(!naId) throw new Error("ROLE_NA not in env");

    const queueChannel = await client.channels.fetch(queueChannelId);
    if(!queueChannel) throw new Error(`Channel with ID ${queueChannelId} not found`);

    if(queueChannel.type != ChannelType.GuildText) throw new Error(`Channel with ID ${queueChannelId} is not of type GuildText`);

    let roleId;
    if(region == "EU") roleId = euId;
    if(region == "NA") roleId = naId;
    if(!roleId) throw new Error("region scuffed LOL (this shouldnt happen but if it does something went bad)")
    
    await queueChannel.permissionOverwrites.edit(roleId, {ViewChannel:true})
    
}

export const closeQueue = async (client:Client, region:"EU" | "NA") => {
    const queueChannelId = process.env.CHANNEL_QUEUE;
    if(!queueChannelId) throw new Error("CHANNEL_QUEUE not in env");

    const euId = process.env.ROLE_EU;
    if(!euId) throw new Error("ROLE_EU not in env");

    const naId = process.env.ROLE_NA;
    if(!naId) throw new Error("ROLE_NA not in env");

    const queueChannel = await client.channels.fetch(queueChannelId);
    if(!queueChannel) throw new Error(`Channel with ID ${queueChannelId} not found`);

    if(queueChannel.type != ChannelType.GuildText) throw new Error(`Channel with ID ${queueChannelId} is not of type GuildText`);

    let roleId;
    if(region == "EU") roleId = euId;
    if(region == "NA") roleId = naId;
    if(!roleId) throw new Error("region scuffed LOL (this shouldnt happen but if it does something went bad)")
    
    await queueChannel.permissionOverwrites.edit(roleId, {ViewChannel:false})
    
}

export const syncQueue = async (client:Client) => { //only do this on load.
    const now = new Date();

    //eu
    const euTime = structuredClone(now);
    euTime.setHours(euTime.getHours() + 1)
    if(euTime.getDay() < 6){ //weekday
        if(euTime.getUTCHours() < 18 || euTime.getUTCHours() > 22){
            await closeQueue(client, "EU");
        } else{
            await openQueue(client, "EU");
        }
    } else{ //weekend
        if(euTime.getUTCHours() < 16 || euTime.getUTCHours() > 22){
            await closeQueue(client, "EU");
        } else{
            await openQueue(client, "EU");
        }
    }

    //na
    const naTime = structuredClone(now);
    naTime.setHours(euTime.getHours() - 5)
    if(naTime.getDay() < 6){ //weekday
        if(naTime.getUTCHours() < 18 || naTime.getUTCHours() > 22){
            await closeQueue(client, "NA");
        } else{
            await openQueue(client, "NA");
        }
    } else{ //weekend
        if(naTime.getUTCHours() < 16 || naTime.getUTCHours() > 22){
            await closeQueue(client, "NA");
        } else{
            await openQueue(client, "NA");
        }
    }

}
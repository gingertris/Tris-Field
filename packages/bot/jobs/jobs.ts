import { ChannelType, Client } from "discord.js";
import { RecurrenceRule, scheduleJob } from "node-schedule";
import { clearQueue } from "../../services/QueueService";
import { closeQueue, openQueue } from "../utils/queue";
import { createMatches, promoteAndRelegate } from "../utils/scheduled";
//set 

//queue pop times
const weekdayRule = new RecurrenceRule();
weekdayRule.dayOfWeek = [1,2,3,4,5];
weekdayRule.hour = [19, 20, 21, 22];
weekdayRule.minute = 0;


const weekendRule = new RecurrenceRule();
weekendRule.dayOfWeek = [0,6];
weekendRule.hour = [17, 18, 22];
weekendRule.minute = 0;

const powerHourRule = new RecurrenceRule();
powerHourRule.dayOfWeek = [0,6];
powerHourRule.hour = [19,20,21];
powerHourRule.minute = 0;

//queue open times
const weekdayOpenRule = new RecurrenceRule();
weekdayOpenRule.dayOfWeek = [1,2,3,4,5];
weekdayOpenRule.hour = 18;
weekdayOpenRule.minute = 0;

const weekendOpenRule = new RecurrenceRule();
weekendOpenRule.dayOfWeek = [0,6];
weekendOpenRule.hour = 16;
weekendOpenRule.minute = 0;

const closeRule = new RecurrenceRule();
closeRule.dayOfWeek = [0,1,2,3,4,5,6];
closeRule.hour = 22;
closeRule.minute = 0;


//set timezones

//match creation
const euWeekdayRule = structuredClone(weekdayRule);
euWeekdayRule.tz = 'Europe/Berlin';

const euWeekendRule = structuredClone(weekendRule);
euWeekendRule.tz = 'Europe/Berlin';

const euPowerHourRule = structuredClone(powerHourRule);
euPowerHourRule.tz = 'Europe/Berlin';

const naWeekdayRule = structuredClone(weekdayRule);
naWeekdayRule.tz = 'America/Cancun';

const naWeekendRule = structuredClone(weekendRule);
naWeekendRule.tz = 'America/Cancun';

const naPowerHourRule = structuredClone(powerHourRule);
naPowerHourRule.tz = 'America/Cancun';


//open and close queue
const naWeekdayOpenRule = structuredClone(weekdayOpenRule);
naWeekdayOpenRule.tz = 'America/Cancun';

const naWeekendOpenRule = structuredClone(weekendOpenRule);
naWeekendOpenRule.tz = 'America/Cancun';

const naCloseRule = structuredClone(closeRule);
naCloseRule.tz = 'America/Cancun';

const euWeekdayOpenRule = structuredClone(weekdayOpenRule);
euWeekdayOpenRule.tz = 'Europe/Berlin';

const euWeekendOpenRule = structuredClone(weekendOpenRule);
euWeekendOpenRule.tz = 'Europe/Berlin';

const euCloseRule = structuredClone(closeRule);
euCloseRule.tz = 'Europe/Berlin';



//promotion/relegation job
const promotionRelegationRule = new RecurrenceRule();
promotionRelegationRule.date = 1; 
promotionRelegationRule.hour = 10;//do it at 10am eu time. no queues are open at this hour, and both days have finished
promotionRelegationRule.minute = 0;

promotionRelegationRule.tz = 'Europe/Berlin'


//empty queue overnight
const emptyQueueRule = new RecurrenceRule(); //do it at 10am eu time. no queues are open at this hour, and both days have finished
emptyQueueRule.hour = 10;
emptyQueueRule.minute = 0;
emptyQueueRule.tz = 'Europe/Berlin'

//method

export const loadJobs = (client: Client) => {
    //promotion and relegation
    scheduleJob(promotionRelegationRule, async () =>{
        await promoteAndRelegate(client);
    })

    scheduleJob(emptyQueueRule, async ()=>{
        await clearQueue("EU");
        await clearQueue("NA");
        const now = new Date();
        console.log("Queues cleared.")
        console.log(now.toUTCString())
    })

    //create matches
    //eu
    scheduleJob(euWeekdayRule, async ()=>{
        await createMatches(client, false, "EU")
    })

    scheduleJob(euWeekendRule, async ()=>{
        await createMatches(client, false, "EU")
    })

    scheduleJob(euPowerHourRule, async ()=>{
        await createMatches(client, true, "EU")
    })

    //na
    scheduleJob(naWeekdayRule, async ()=>{
        await createMatches(client, false, "NA")
    })

    scheduleJob(naWeekendRule, async ()=>{
        await createMatches(client, false, "NA")
    })

    scheduleJob(naPowerHourRule, async ()=>{
        await createMatches(client, true, "NA")
    })

    //open and close queue
    //eu
    scheduleJob(euWeekdayOpenRule, async ()=>{
        await openQueue(client, "EU");
        await ping(client, "EU", "open");
    })

    scheduleJob(euWeekendOpenRule, async ()=>{
        await openQueue(client,"EU");
        await ping(client, "EU", "open");
    })

    scheduleJob(euCloseRule, async ()=>{
        await closeQueue(client, "EU");
        await ping(client, "EU", "closed");
    })
    

    //na
    scheduleJob(naWeekdayOpenRule, async ()=>{
        await openQueue(client, "NA");
        await ping(client, "NA", "open");
    })

    scheduleJob(naWeekendOpenRule, async ()=>{
        await openQueue(client, "NA");
        await ping(client, "NA", "open");
    })

    scheduleJob(naCloseRule, async ()=>{
        await closeQueue(client, "NA");
        await ping(client, "NA", "closed");
    })

    console.log("Jobs loaded.")

}

const ping = async (client:Client, region:"EU"|"NA", openorclosed:string) => {
    const naPings = process.env.CHANNEL_NA_PINGS;
    if(!naPings) throw new Error("CHANNEL_NA_PINGS not in env")

    const euPings = process.env.CHANNEL_EU_PINGS;
    if(!euPings) throw new Error("CHANNEL_EU_PINGS not in env")

    const pingsRoleId = process.env.ROLE_PINGS;
    if(!pingsRoleId) throw new Error("ROLE_PINGS not in env")

    if(region == "EU") {
        const pingChannel = await client.channels.fetch(euPings);
        if(pingChannel?.type == ChannelType.GuildText){
            await pingChannel.send({
                content:`The queue is now ${openorclosed}. <@&${pingsRoleId}>`
            });
        }
    };
    if(region == "NA") {
        const pingChannel = await client.channels.fetch(naPings);
        if(pingChannel?.type == ChannelType.GuildText){
            await pingChannel.send({
                content:`The queue is now ${openorclosed}. <@&${pingsRoleId}>`
            });
        }
    };
}
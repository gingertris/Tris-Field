import { Client, EmbedBuilder } from "discord.js";
import { createMatch } from "@tris-field/services/MatchService";
import { clearQueue, fetchQueue } from "@tris-field/services/QueueService";
import { fetchTeam, fetchTeams, updateTeam } from "@tris-field/services/TeamService";
import {randomBytes} from 'crypto'
import syncRoles from "./syncRoles";



export const promoteAndRelegate = async (client: Client) => {

    //TODO: Make copy of leaderboard before promos and relegations?

    //await archive();

    //Also this doesn't check for game quota yet.

    for(const region in ["EU", "NA"]){
        const allTeams = await fetchTeams();

        let openTeams = allTeams.filter(t => t.region == region && t.division == "OPEN");

        let closedTeams = allTeams.filter(t => t.region == region && t.division == "CLOSED");

        //sort teams
        openTeams = openTeams.sort((a,b)=>{
            //highest first
            return b.rating - a.rating
        })

        closedTeams = closedTeams.sort((a,b)=>{
            //lowest first
            return a.rating - b.rating
        })

        //promote open teams
        let teamsToSwap = 4;
        if(closedTeams.length < 16) teamsToSwap = 16 - closedTeams.length; //if closed is empty then fill up closed div
        for(let i=0; i<(openTeams.length < teamsToSwap ? openTeams.length : teamsToSwap); i++){ //prevent index out of range if not many teams, lol

            const team = openTeams[i];

            await updateTeam(team.id, {
                division:"CLOSED",
                changesRemaining:2,
                rating:1000
                
            })
    
            team.players.forEach(async player => {
                try{
                    const guildId = process.env.GUILD_ID;
                    if(!guildId) throw new Error("GUILD_ID not found in env")
                    await syncRoles(await (await client.guilds.fetch(guildId)).members.fetch(player.id));
                    (await client.users.fetch(player.id)).send("Congratulations, your team has been promoted to Closed Division!")
                } catch(err){
                    console.log(err)
                }
            });
        }


        //if closed full, demote. this may change

        for(let i=0; i<teamsToSwap; i++){
            const team = closedTeams[i];
            await updateTeam(team.id, {
                division:"OPEN",
                changesRemaining:2,
                rating:1000
            })
            team.players.forEach(async player => {
                try{
                    (await client.users.fetch(player.id)).send("You have been demoted to Open Division.")
                }catch(err:unknown){
                    console.log(err)                    
                }
                
            });
        }
        
    }

    



}

export const createMatches = async (client: Client, powerHour: boolean, region:"EU"|"NA") => {

    const allQueue = await fetchQueue();
    const queues = [];

    //divide queues
    for(const division of ["OPEN", "CLOSED"]) {
        queues.push(allQueue.filter(q => {
            return (q.region) == (region) && (q.division) == (division)
        }))
    }

    queues.forEach(async queue => {

        //create matches
        if(queue.length % 2 === 1){
            queue = queue.sort((a,b) => {
                //least recent first 
                return a.joined.getTime() - b.joined.getTime()
            })
            const popped = queue.pop() // remove most recent queuer
            if(popped){
                let user;
                 try{
                    user = await client.users.fetch(popped.team.captainId);
                    user.send("There was an odd number of people in the queue, meaning not everyone could get a matchup. Unfortunately, your team was the last to queue, so you haven't got a matchup.");

                } catch(err:any){
                    console.log("cant dm user");

                }
                
            }
        }

        queue = queue.sort((a, b) => {
            return a.team.rating - b.team.rating;
        });

        for(let i = 0; i < queue.length; i+=2){
            const team1_q = queue.pop();
            const team2_q = queue.pop();

            if(team1_q && team2_q){
                const team1 = team1_q.team;
                const team2 = team2_q.team;

                const match = await createMatch(team1.id, team2.id, powerHour);

                const embed = new EmbedBuilder()
                    .setTitle(`Match ${match.id}`)
                    .setColor("Fuchsia")
                    .setTimestamp()
                    .setFooter({text:`Match ID: ${match.id}`});
                [match.team1, match.team2].forEach(async team => {
                    const fullTeam = await fetchTeam(team.id);
                    if(!fullTeam) return;
                    embed.addFields({
                        name:`${fullTeam.name} (${fullTeam.rating})`,
                        value:`${fullTeam.players.map(p => {
                            if(p.id == fullTeam.captainId){
                                return `${p.name} (C)`
                            } else {
                                return p.name;
                            }
                        }).join('\n')}`,
                        inline:true
                    })
                });
                const matchName = match.team1.region.toString().toUpperCase() + match.team1.division.toString().toUpperCase().charAt(0) + match.id.toString()
                const matchPass = generatePassword();

                embed.addFields({name:"Lobby Details", value:`Name: ${matchName}\nPassword: ${matchPass}\n${team1.name} creates the lobby.`});
                embed.addFields({name:"Score Reporting", value:`To report the score, use the \`/report\` command.`});
                embed.addFields({name:"Example Usage", value:`\`/report ${match.id} Win\``});
                (await client.users.fetch(team1.captainId)).send({embeds:[embed]});
                (await client.users.fetch(team2.captainId)).send({embeds:[embed]});
            }

        }


    })

    await clearQueue(region);
}

const generatePassword = () => {
    return randomBytes(2).toString('hex');
}

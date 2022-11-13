import { GuildMember } from "discord.js"
import { fetchPlayer } from "../../services/PlayerService"


export default async (member:GuildMember) => {
    const player = await fetchPlayer(member.user.id)

    if(!player) return;

    if(!(process.env.ROLE_EU && process.env.ROLE_NA && process.env.ROLE_EU_OPEN && process.env.ROLE_NA_OPEN && process.env.ROLE_NA_CLOSED && process.env.ROLE_EU_CLOSED && process.env.ROLE_REGISTERED)) throw new Error("Role IDs not in environment") //check all roles loaded in
    
    const roles = {
        EU:{
            general:process.env.ROLE_EU,
            open:process.env.ROLE_EU_OPEN,
            closed:process.env.ROLE_EU_CLOSED
        },
        NA:{
            general:process.env.ROLE_NA,
            open:process.env.ROLE_NA_OPEN,
            closed:process.env.ROLE_NA_CLOSED
        },
        registered:process.env.ROLE_REGISTERED
    }

    member.roles.add(roles.registered)

    //general player roles
    switch (player.region){
        case "EU":
            member.roles.add(roles.EU.general);
            member.roles.remove(roles.NA.general);
            break;
        case "NA":
            member.roles.remove(roles.EU.general);
            member.roles.add(roles.NA.general);
            break
    }

    //team specific roles
    if(player.team){
        switch(player.team.division){
            case "CLOSED":
                switch (player.region){
                    case "EU":
                        member.roles.add(roles.EU.closed);
                        member.roles.remove(roles.EU.open);
                        member.roles.remove(roles.NA.closed);
                        member.roles.remove(roles.NA.open);
                        break;
                    case "NA":
                        member.roles.remove(roles.EU.closed);
                        member.roles.remove(roles.EU.open);
                        member.roles.add(roles.NA.closed);
                        member.roles.remove(roles.NA.open);
                        break
                }
                break;
            case "OPEN":
                switch (player.region){
                    case "EU":
                        member.roles.remove(roles.EU.closed);
                        member.roles.add(roles.EU.open);
                        member.roles.remove(roles.NA.closed);
                        member.roles.remove(roles.NA.open);
                        break;
                    case "NA":
                        member.roles.remove(roles.EU.closed);
                        member.roles.remove(roles.EU.open);
                        member.roles.remove(roles.NA.closed);
                        member.roles.add(roles.NA.open);
                        break
                }
        }
    } else{
        member.roles.remove(roles.EU.closed);
        member.roles.remove(roles.EU.open);
        member.roles.remove(roles.NA.closed);
        member.roles.remove(roles.NA.open);
    }
} 
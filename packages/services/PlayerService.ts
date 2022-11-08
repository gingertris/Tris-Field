import prisma from "../db/PrismaClient";
import { fetchTeam } from "./TeamService";

export const fetchPlayer = async (id:string) => {
    return await prisma.player.findUnique({
        where:{
            id:id
        },
        include:{
            team:true,
            invites:{
                include:{
                    team:true
                }
            }
        }
    })
}

export const createPlayer = async (id: string, username: string, region: "EU" | "NA") => {
    return await prisma.player.create({
        data: {
            id:id,
            name:username,
            region:region
        },
        include:{
            team:true,
            invites:{
                include:{
                    team:true
                }
            }
        }
    })
}

export const setTeam = async (playerId: string, teamId: number | null) => {
    return await prisma.player.update({
        where:{
            id:playerId
        },
        data:{
            teamId:teamId
        },
        include:{
            team:true,
            invites:true
        }
    })
}

export const leaveTeam = async (playerId: string) => { //honestly just an alias function
    return await setTeam(playerId, null);
}

export const isCaptain = async (playerId: string) => {
    const player = await fetchPlayer(playerId);
    return player?.team?.captainId == playerId;
}

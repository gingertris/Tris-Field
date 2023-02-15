import prisma from "@tris-field/db/PrismaClient";

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

export const deletePlayer = async (id: string) => {
    await prisma.player.delete({
        where:{
            id:id
        }
    })
}


export const updatePlayer = async (id:string, data:{
    name?: string
    region?: "EU" | "NA"
}) => {
    return await prisma.player.update({
        where:{
            id:id
        },
        data:data
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

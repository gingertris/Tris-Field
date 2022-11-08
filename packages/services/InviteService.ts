import prisma from "../db/PrismaClient";

export const createInvite = async (playerId:string, teamId: number) => {
    return await prisma.invite.create({
        data:{
            teamId:teamId,
            playerId:playerId
        }
    })
}

export const fetchInvite = async (playerId: string, teamId: number) => {
    return await prisma.invite.findUnique({
        where:{
            teamId_playerId:{
                teamId:teamId,
                playerId:playerId
            }
        },
        include:{
            player:true,
            team:{
                select:{
                    name:true
                }
            }
        }
    })
}

export const updateInvite = async (playerId: string, teamId: number, answered: boolean) => {
    return await prisma.invite.update({
        where:{
            teamId_playerId:{
                teamId:teamId,
                playerId:playerId
            }
        },
        data:{
            answered:answered
        }
    })
}
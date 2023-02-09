import prisma from "@tris-field/db/PrismaClient";

export const createInvite = async (playerId:string, teamId: number) => {
    return await prisma.invite.create({
        data:{
            teamId:teamId,
            playerId:playerId
        }
    })
}

export const fetchUnansweredInvite = async (playerId: string, teamId: number) => {
    return await prisma.invite.findFirst({
        where:{
            teamId:teamId,
            playerId:playerId,
            answered:false
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


export const fetchInvite = async (id: number) => {
    return await prisma.invite.findUnique({
        where:{
            id:id
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

export const updateInvite = async (inviteId: number, answered: boolean) => {
    return await prisma.invite.update({
        where:{
            id:inviteId
        },
        data:{
            answered:answered
        }
    })
}
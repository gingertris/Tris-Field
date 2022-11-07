import prisma from "../db/PrismaClient";

export const fetchQueue = async () => {
    return await prisma.queue.findMany();
}

export const fetchSpecificQueue = async (region: "EU" | "NA", division: "OPEN" | "CLOSED") => {
    return await prisma.queue.findMany({
        where:{
            region:region,
            division: division
        }
    })
}

export const isQueued = async (teamId: number) => {
    await prisma.queue.findUnique({
        where:{
            teamId:teamId
        }
    }) ? true : false
}

export const joinQueue = async (teamId: number, region: "EU" | "NA", division: "OPEN" | "CLOSED") => {
    return await prisma.queue.create({
        data:{
            teamId:teamId,
            division:division,
            region:region
        }
    })
}

export const leaveQueue = async (teamId: number) => {
    await prisma.queue.delete({
        where:{
            teamId:teamId
        }
    })
}

export const clearQueue = async (region: "EU" | "NA", division: "OPEN" | "CLOSED") => {
    await prisma.queue.deleteMany({
        where:{
            region: region,
            division:division
        }
    })
}
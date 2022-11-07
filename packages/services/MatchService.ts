import prisma from "../db/PrismaClient";

export const createMatch = async (team1Id: number, team2Id: number, powerHour:boolean) => {
    return await prisma.match.create({
        data:{
            team1Id:team1Id,
            team2Id:team2Id,
            powerHour:powerHour
        },
        include:{
            team1:true,
            team2:true
        }
    });
}

export const fetchMatch = async (matchId: number) => {
    return await prisma.match.findUnique({
        where:{
            id:matchId
        },
        include:{
            team1:true,
            team2:true
        }
    })
}
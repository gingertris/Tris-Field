import prisma from "@tris-field/db/PrismaClient";

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

export const updateMatch = async (matchId: number, data:{
    team1Id?: number,
    team2Id?: number, 
    winnerId?: number | null,
    powerHour?: boolean,
    team1Difference?: number,
    team2Difference?: number
}) => {
        return await prisma.match.update({
        where:{
            id:matchId
        },
        data:data,
        include:{
            team1:true,
            team2:true
        }
    })
}
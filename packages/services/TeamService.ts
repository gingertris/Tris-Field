import prisma from "../db/PrismaClient";

export const fetchTeam = async (teamId: number) => {
    const team = await prisma.team.findUnique({
        where:{
            id:teamId
        },
        include:{
            players:true
        }
    });

    return team;
}

export const fetchTeamByName = async (teamName: string) => {
    const team = await prisma.team.findUnique({
        where:{
            name:teamName
        },
        include:{
            players:true
        }
    });

    return team;
}

export const createTeam = async (name:string, captainId:string, region: "EU"|"NA") => {
    prisma.team.create({
        data:{
            name:name,
            captainId:captainId,
            region:region,
            division:"OPEN"
        }
    })
}

export const updateTeam = async (teamId:number, data:{
    captainId?:string,
    division?:"OPEN"|"CLOSED",
    region?:"EU"|"NA",
    rating?:number,
    gamesPlayed?:number,
    changesRemaining?:number
}) => {
    return await prisma.team.update({
        where:{
            id:teamId
        },
        data:data
    })
}
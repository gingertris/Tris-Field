import prisma from "@tris-field/db/PrismaClient";

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

export const fetchTeams = async () => {
    const teams = await prisma.team.findMany({
        include:{
            players:true
        }
    });
    return teams;
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

    const nameCaps = name.toUpperCase();

    return await prisma.team.create({
        data:{
            name:name,
            nameCaps: nameCaps,
            captainId:captainId,
            region:region,
            division:"OPEN"
        },
        include:{
            players:true
        }
    })
}

export const deleteTeam = async (teamId: number) => {
    await prisma.team.delete({
        where:{
            id:teamId
        }
    })
}

export const updateTeam = async (teamId:number, data:{
    captainId?:string,
    name?:string,
    nameCaps?:string,
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
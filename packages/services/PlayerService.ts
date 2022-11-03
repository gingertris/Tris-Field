import prisma from "../db/PrismaClient";
import {Prisma} from '@prisma/client'

export const fetchPlayer = async (id:string) => {
    return await prisma.player.findUnique({
        where:{
            id:id
        },
        include:{
            team:true,
            invites:true
        }
    })
}

export const createPlayer = async (id: string, username: string, region: "EU" | "NA") => {
    //let player = Prisma.PlayerCreateInput
    const player = await prisma.player.create({
        data: {
            id:id,
            name:username,
            region:region
        }
    })
}
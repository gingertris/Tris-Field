import { ChatInputCommandInteraction } from "discord.js"
import Delete from "./captain/delete"
import Invite from "./captain/invite"
import Kick from "./captain/kick"
import Rename from "./captain/rename"
import Transfer from "./captain/transfer"
import SetDiv from "./mod/setdiv"
import Undo from "./mod/undo"
import Test from "./test"
import Clear from "./user/clear"
import Create from "./user/create"
import Join from "./user/join"
import Leave from "./user/leave"
import Pings from "./user/pings"
import Player from "./user/player"
import Register from "./user/register"
import Report from "./user/report"
import Team from "./user/team"

const Commands = [Delete, Invite, Kick, Rename, Transfer, SetDiv, Undo, Clear, Create, Join, Leave, Pings, Player, Register, Report, Team]

export interface ICommand {
    data: any, //slash command builder magic that i dont fully get
    config: {
        registered: boolean,
        captain: boolean
    },
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}

export default Commands
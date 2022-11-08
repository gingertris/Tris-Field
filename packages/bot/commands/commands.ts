import { ChatInputCommandInteraction } from "discord.js"
import Invite from "./captain/invite"
import Test from "./test"
import Clear from "./user/clear"
import Create from "./user/create"
import Join from "./user/join"
import Pings from "./user/pings"
import Player from "./user/player"
import Register from "./user/register"
import Team from "./user/team"

const Commands = [Test, Create, Register, Join, Invite, Team, Player, Pings, Clear]

export interface ICommand {
    data: any, //slash command builder magic that i dont fully get
    config: {
        registered: boolean,
        captain: boolean
    },
    execute(interaction: ChatInputCommandInteraction): Promise<void>
}

export default Commands
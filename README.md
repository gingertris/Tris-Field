# Tris' Field
My attempt at a recreation of Psyonix and Rival Esports' *The Field*.

# How will Tris’ Field work?

There will be 2 divisions: **Open Division** and **Closed Division**.

Closed Division capped at 16 teams (but may increase with more users). Open Division is open for anyone.

*For Season 1, all teams who have qualified for an RLCS 22-23 Closed Qualifier are invited to join Closed Division.*

*For Tris' Field - University League, 16 teams who have qualified for UR 22-23 Spring are invited to join Closed Division.*

At the start of each month, all teams reset to 1000 points. Players can gain/lose rating throughout the month. 

At the end of the month, **Top 4 from Open Division promote to Closed Division**, and **Bottom 4 of Closed Division relegate to Open Division**.

You will need to play 10 games in a month to be eligible for prizing and promotion. *Prizes to be determined, this is all hypothetical so far. I do not have money*

# Leaderboards

Leaderboards for Tris' Field can be found at `https://trisfield.com/<region>/<division>`.

- `<region>` must be either `EU` or `NA`.
- `<division>` must be either `open` or `closed`.

Leaderboards for Tris' Field - University League can be found at `https://uni.trisfield.com`.

# Opening times

The following times assume these timezones:
 - EU (CET - UTC+1)
 - NA (EST - UTC-5)

**Mon - Fri**

18:00 - 22:00

**Sat - Sun**

16:00 - 22:00

<ins>Power Hours

**Sat - Sun** 

19:00 - 21:00

Power Hour Ladder Point Multiplier (for wins): 1.5x

# Matchmaking


Queues will pop at the top of each hour. 22:00 is when the last queue will pop. Queueing outside of the opening times will not be possible.

All queued teams will be sorted in order of Rating. Teams will be matched against teams of a similar rating in order to create fair, balanced and (hopefully) enjoyable matches.

If there is an odd number of people in the queue at the top of the hour, the last person to join the queue doesn't get a game.

# Commands

## Important Commands
- `/register <username> EU|NA`

  Register to use this service. Username must be unique.

- `/create “Team Name”`

    Creates a team, sets person who ran command as Captain

- `/invite @User`
	
    Invites @User to your team. You can only invite players of the same region as you to your team.

    *You need to be the Captain of your team to use this command.*

- `/join`
	
    Lists invites. Button for each invite, press button to join team.

- `/clear`

    Clears all invites.

- `/leave`

    Leave team.

    *You cannot leave a team you are captain of. `/transfer` ownership of the team to someone else before leaving.*


- `/report <match id> <Win|Loss>`
	
    Report match score. 

## Team Management *(Captain only Commands)*
- `/transfer @User`

    Transfers ownership of team to @User. If not Captain of a team, this command fails.

- `/delete`

    Delete team.

- `/rename “New Team Name”`
	
    Renames team to a new team name. 
   
- `/kick @User`

    Kicks @User from team. 
    
## Other Commands

- `/info @User`

    Gives you player information. If `@User` is omitted, it gives you your own information. 

- `/team "Team name"`

    Gives you information on a team. If `"Team name"` is omitted, it gives you information on your own team. 

- `/pings on|off`

    Toggle pings for queue.

## Mod Commands

- `/setdiv "Team name" <division>`

    Change the division of a team.

- `/undo <match id>`

    Undo a match.

import { fetchTeam, fetchTeams } from "@tris-field/services/TeamService";
import { Router } from "express";
const router = Router();

router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const team = await fetchTeam(id);

    if(!team) {
        res.sendStatus(404);
        return;
    }

    res.send(JSON.stringify(team));
    return;
})

router.get('/', async (req, res) => {

    let teams = await fetchTeams();

    if(req.query.region){
        const region = req.query.region.toString().toUpperCase();

        if(region != "EU" && region != "NA"){
            res.status(400).send({message:"parameter 'region' must be 'eu' or 'na'"});
            return;
        }
        teams = teams.filter(team => team.region == region);
    }

        
    if(req.query.division){
        const division = req.query.division.toString().toUpperCase();
        if(division != "OPEN" && division != "CLOSED"){
            res.status(400).send({message:"parameter 'division' must be 'open' or 'closed'"});
            return;
        }
        teams = teams.filter(team => team.division == division);
    }

    res.send(JSON.stringify(teams));

})



export default router;
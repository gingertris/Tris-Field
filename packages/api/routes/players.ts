import { fetchPlayer } from "@tris-field/services/PlayerService";
import { Router } from "express";
const router = Router();

router.get('/:id', async (req,res) => {

    const id = req.params.id;
    const player = await fetchPlayer(id);

    if(!player){
        res.status(404).send({
            message: `Player with id ${id} not found`
        });
        return;
    }

    res.send(JSON.stringify(player));
    return;
});

router.get('/', (req, res) => {
    res.status(404).send({
            message: `Route doesn't exist`
        });
})

export default router;
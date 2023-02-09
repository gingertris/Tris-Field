import { fetchPlayer } from "@tris-field/services/PlayerService";
import { Router } from "express";
const router = Router();

router.get('/:id', async (req,res) => {

    const id = req.params.id;
    const player = await fetchPlayer(id);

    if(!player){
        res.sendStatus(404);
        return;
    }

    res.send(JSON.stringify(player));
    return;
});

router.get('/', (req, res) => {
    res.sendStatus(404);
})

export default router;
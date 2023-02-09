import express from 'express';
import teamRouter from './routes/teams';
import playerRouter from './routes/players';
const app = express();
const port = 3000;

app.use('/teams', teamRouter);
app.use('/players', playerRouter);

app.listen(port, () => {
    console.log(`Tris' Field API listening on port ${port}`);
})


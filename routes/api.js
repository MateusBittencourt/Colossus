import { Router } from 'express';
import { helloWorld } from '../src/manager.js'

const router = Router();

router.get('/helloWorld', async (req, res) => {
    const resp = await helloWorld();

    res.send(`Hello World\n\n${resp}`);
});

export default router;

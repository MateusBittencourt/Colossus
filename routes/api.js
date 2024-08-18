import { Router } from 'express';
import { helloWorld } from '../src/manager.js'

const router = Router();

router.get('/helloWorld', async (req, res) => {
    await helloWorld();
    res.sendFile('output.png', { root : '.' });
});

export default router;

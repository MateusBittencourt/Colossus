// Get dependencies
import express, { json, urlencoded, static as xstatic } from 'express';
import { join } from 'node:path';
import { createServer } from 'node:http';

// Get our API routes
import api from '../routes/api.js';

const app = express();

// Parsers for POST data
app.use(json());
app.use(urlencoded({ extended: true }));

// Point static path to dist
app.use(xstatic(join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.send('FenixNegra is running!');
});

// Set the port
const port = '5000';
app.set('port', port);

// Create the http server.
const server = createServer(app);

// Listen
server.listen(port, () => console.log(`Running on localhost:${port}`));

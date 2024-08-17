import { cgne, cgne_2, signalGain } from './algorithms.js';
import { importCSVAsColumnArray, importCSVAsMatrix, createImageFromArray } from './support.js';

export async function helloWorld() {
    console.log("starting");
    const H1 = await importCSVAsMatrix('./data/H-2.csv');
    const G1 = await importCSVAsColumnArray('./data/G-30x30-2.csv');

    const result = await cgne(H1, G1);

    await createImageFromArray(result, 'output.png');
}

import { cgne, cgne_2, signalGain } from './algorithms.js';
import { importCSVAsColumnArray, importCSVAsMatrix, createImageFromArray } from './support.js';

export async function helloWorld() {
    console.log("starting");
    const H1 = await importCSVAsMatrix('./data/H-2.csv');
    const G1 = await importCSVAsColumnArray('./data/G-30x30-2.csv');

    const { image, error, iterations } = await cgne(H1, signalGain(G1, 436, 64));

    await createImageFromArray(image, 'output.png');
    
    console.log("error", error);
    console.log("iterations", iterations);
}

import { cgne, cgnr } from './algorithms.js';
import { importCSVAsColumnArray, importCSVAsMatrix } from './support.js';

export async function helloWorld() {
    const H1 = await importCSVAsColumnArray('./data/H-2.csv');
    const G1 = await importCSVAsColumnArray('./data/G-30x30-1.csv');

    const result = cgne(H1, G1);

    // console.log(G1);

    return result;
}

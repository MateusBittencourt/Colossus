import fs from 'node:fs';
import csv from 'csv-parser';
import sharp, { kernel } from 'sharp';


export async function importCSVAsColumnArray(filePath) {
    const data = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv(['line']))
            .on('data', row => {
                data.push([parseFloat(row.line)]);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', reject);
    });
    return data;
}

export async function importCSVAsMatrix(filePath) {
    const data = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv([]))
            .on('data', (row) => {
                const items = Object.values(row).map(parseFloat);
                data.push(items);
            })
            .on('end', () => {
                // Print the matrix when done
                resolve(data);
            })
            .on('error', reject);
    });
    return data;
}

export async function createImageFromArray(array, filePath) {
    await new Promise(resolve => sharp(Buffer.from(array), {
        raw: {
            width: 30,
            height: 30,
            channels: 1 // Grayscale image, so only one channel
        }
    })
    .resize(600, 600, {
        kernel: kernel.nearest
    })
    .rotate(-90) // Rotate 90 degrees
    .flop() // Flip the image horizontally
    .png() // Convert to PNG format
    .toFile(filePath, (err, info) => {
        if (err) throw err;
        // console.log('Image saved:', info);
        resolve();
    }));
}
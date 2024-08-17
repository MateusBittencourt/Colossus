import fs from 'node:fs';
import csv from 'csv-parser';
import { Matrix } from 'ml-matrix';
import sharp from 'sharp';


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
    return new Matrix(data);
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
    return new Matrix(data);
}

export async function createImageFromArray(array, filePath) {
    return await sharp(Buffer.from(array), {
        raw: {
            width: 30,
            height: 30,
            channels: 1 // Grayscale image, so only one channel
        }
    })
    .png() // Convert to PNG format
    .toFile(filePath, (err, info) => {
        if (err) throw err;
        console.log('Image saved:', info);
    });
}
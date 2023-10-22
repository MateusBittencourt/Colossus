import fs from 'node:fs';
import csv from 'csv-parser';


export async function importCSVAsColumnArray(filePath) {
    const data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', row => {
                data.push(Object.values(row)[0]);
            })
            .on('end', () => {
                resolve(data);
            })
            .on('error', reject);
    });
}

export async function importCSVAsMatrix(filePath) {
    const data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', row => {
                // Convert each row into an array of items
                const items = Object.values(row)[0].split(',');
                // Push items array to matrix
                data.push(items);
            })
            .on('end', () => {
                // Print the matrix when done
                resolve(data);
            })
            .on('error', reject);
    });
}

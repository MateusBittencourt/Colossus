import { Matrix } from 'ml-matrix';
const { add, sub, mul, div, mod, max, min, zeros } = Matrix

// /**
//  * Transpose a matrix (H) and calculate its norm
//  *
//  * @param {Array} H - model matrix
//  * @return {number}
//  */
// export function reductionFactor(H) {
//     return norm(multiply(transpose(H), H), 2);
// }

// /**
//  * Calculate the regularization coefficient
//  *
//  * @param {Array} H - model matrix
//  * @param {Array} g - signal array
//  * @return {number}
//  */
// export function regularizationCoefficient(H, g) {
//     return max(abs(multiply(transpose(H), g))) * 0.10;
// }

/**
 * Calculate the error
 *
 * @param {Matrix} r0 - r vector at time i
 * @param {Matrix} r1 - r vector at time i+1
 * @return {number}
 */
function calculateError(r0, r1) {
    return r1.norm() - r0.norm();
}

function normalize(matrix) {
    matrix = matrix.sub(matrix.min());
    matrix = matrix.div(matrix.max());
    matrix = matrix.mul(255);

    return matrix.to1DArray();
}

// /**
//  * Signal gain and adjustment of g
//  *
//  * @param {Matrix} g - signal array
//  * @param {number} N - number of signals
//  * @param {number} S - number of signal samples
//  */
// export function signalGain(g, N, S) {
//     for (let c = 0; c <= N; c++) {
//         for (let l = 0; l <= S; l++) {
//             const gamma = 100 + 1 / 20 * l * Math.sqrt(l);
//             g[l][c] = g[l][c] * gamma;
//         }
//     }

//     return g;
// }

/**
 * CGNE algorithm
 *
 * @param {Matrix} H - model matrix
 * @param {Matrix} g - signal array
 */
export async function cgne(H, g) {
    let f0 = 0;
    let r0 = g;
    let p0 = H.transpose().mmul(r0);

    let f1, r1, p1;

    for (let i = 0; i < 1000; i++) {
        // console.log(i);
        const alpha = div(r0.transpose().mmul(r0), (p0.transpose().mmul(p0))).get(0, 0);
        f1 = f0 > 0 ? add(f0, mul(p0, alpha)) : mul(p0, alpha);
        r1 = sub(r0, mul(H.mmul(p0), alpha));
        const beta = div(r1.transpose().mmul(r1), (r0.transpose().mmul(r0))).get(0, 0);
        p1 = add(H.transpose().mmul(r1), mul(p0, beta));

        if (calculateError(r0, r1) < 1e-10) {
            break;
        }
        f0 = f1;
        r0 = r1;
        p0 = p1;
    }
    return normalize(f1);
}

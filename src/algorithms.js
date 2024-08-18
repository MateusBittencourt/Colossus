import { Matrix } from 'ml-matrix';
const { add, sub, multiply, div, mod, max, min, zeros } = Matrix

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


function normalize(matrix) {
    const min = matrix.min();
    const max = matrix.max();

    return multiply(matrix.sub(min), 255 / (max - min)).to1DArray();
}

/**
 * Signal gain and adjustment of g
 *
 * @param {Array<Array<number>>} g - signal array
 * @param {number} S - number of signal samples
 * @param {number} N - number of signals
 * @return {Array<Array<number>>}
 */
export function signalGain(g, S, N) {
    for (let c = 0; c < N; c++) {
        for (let l = 0; l < S; l++) {
            const gamma = 100 + 1 / 20 * l * Math.sqrt(l);
            g[c*S + l][0] = g[c*S + l][0] * gamma;
        }
    }
    return g;
}

/**
 * CGNE algorithm
 *
 * @param {Array<Array<number>>} H_source - model matrix
 * @param {Array<Array<number>>} g_source - signal array
 * @param {number} maxIte - maximum number of iterations
 * @param {number} tolerance - tolerance for the error
 */
export async function cgne(H_source, g_source, maxIte = 1000, tolerance = 1e-4) {

    const H = new Matrix(H_source);
    const g = new Matrix(g_source);
    const Ht = H.transpose();

    let f = 0;
    let r = g;
    let p = Ht.mmul(r);
    let r_old_norm = r.norm();
    let alpha_num = r.transpose().mmul(r);
    
    let error, iterations;

    for (iterations = 0; iterations < maxIte; iterations++) {
        const alpha_den = p.transpose().mmul(p);
        const alpha = div(alpha_num, alpha_den).get(0, 0);

        f = f > 0 ? add(f, multiply(p, alpha)) : multiply(p, alpha);
        r = sub(r, multiply(H.mmul(p), alpha));

        const r_norm = r.norm();
        error = r_norm - r_old_norm;
        if (error < tolerance) {
            break;
        }

        const beta_num = r.transpose().mmul(r);
        const beta_den = alpha_num;
        const beta = div(beta_num, beta_den).get(0, 0);
        
        p = add(Ht.mmul(r), multiply(p, beta));

        r_old_norm = r_norm;
        alpha_num = beta_num;
    }

    return {
        image: normalize(f),
        error,
        iterations
    };
}

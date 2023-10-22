import { norm, multiply, transpose, subtract, divide, zeros, max, abs, add } from 'mathjs';

/**
 * Transpose a matrix (H) and calculate its norm
 *
 * @param {Array} H - model matrix
 * @return {number}
 */
export function reductionFactor(H) {
    return norm(multiply(transpose(H), H), 2);
}

/**
 * Calculate the regularization coefficient
 *
 * @param {Array} H - model matrix
 * @param {Array} g - signal array
 * @return {number}
 */
export function regularizationCoefficient(H, g) {
    return max(abs(multiply(transpose(H), g))) * 0.10;
}

/**
 * Calculate the error
 *
 * @param {Array} r0 - r vector at time i
 * @param {Array} r1 - r vector at time i+1
 * @return {number}
 */
function calculateError(r0, r1) {
    return norm(r1, 2) - norm(r0, 2);
}

/**
 * Signal gain and adjustment of g
 *
 * @param {Array} g - signal array
 * @param {number} N - number of signals
 * @param {number} S - number of signal samples
 */
export function signalGain(g, N, S) {
    for (let c = 1; c <= N; c++) {
        for (let l = 1; l <= S; l++) {
            const gamma = 100 + 1 / 20 * l * Math.sqrt(l);
            g[l - 1][c - 1] = g[l - 1][c - 1] * gamma;
        }
    }

    return g;
}

/**
 * CGNE algorithm
 *
 * @param {Array} H - model matrix
 * @param {Array} g - signal array
 */
export function cgne(H, g) {
    const r = [];
    const p = [];
    const f = [];
    const alpha = [];

    const gLenght = g.length;

    f[0] = zeros(gLenght);
    r[0] = subtract(g, multiply(H, f[0]));
    p[0] = multiply(transpose(H), r[0]);

    for (let i = 0; i < 1000; i++) {
        alpha[i] = divide(multiply(transpose(r[i]), r[i]), multiply(transpose(p[i]), p[i]));
        f[i + 1] = add(f[i], multiply(alpha[i], p[i]));
        r[i + 1] = subtract(r[i], multiply(alpha[i], multiply(H, p[i])));
        const beta = divide(multiply(transpose(r[i + 1]), r[i + 1]), multiply(transpose(r[i]), r[i]));
        p[i + 1] = add(multiply(transpose(H), r[i + 1]), multiply(beta, p[i]));

        if (calculateError(r[i], r[i + 1]) < 1e-4) {
            break;
        }
    }

    return f;
}

/**
 * CGNR algorithm
 *
 * @param {Array} H - model matrix
 * @param {Array} g - signal array
 */
export function cgnr(H, g) {
    const f = [];
    const r = [];
    const z = [];
    const p = [];
    let alpha = [];

    const gLenght = g.length;

    f[0] = zeros(gLenght);
    r[0] = subtract(g, multiply(H, f[0]));
    z[0] = multiply(transpose(H), r[0]);
    p[0] = z[0];

    for (let i = 0; i < 100; i++) {
        const w = multiply(H, p[i]);
        alpha = divide(norm(z[i], 2), norm(w, 2));
        f[i + 1] = add(f[i], multiply(alpha, p[i]));
        r[i + 1] = subtract(r[i], multiply(alpha, w));
        z[i + 1] = multiply(transpose(H), r[i + 1]);
        const beta = divide(norm(z[i + 1], 2), norm(z[i], 2));
        p[i + 1] = add(z[i + 1], multiply(beta, p[i]));

        if (calculateError(r[i], r[i + 1]) < 1e-4) {
            break;
        }
    }

    return f;
}

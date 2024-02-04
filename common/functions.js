export function isStringOnlyNumbers(str) {
    return /^\d+$/.test(str);
}

export function isArrayOnlyNumbers(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (isNaN(Number(arr[i]))) {
            return false;
        }
    }
    return true;
}

export const LOG = console.log;

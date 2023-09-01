export const deepCopy = <T>(object: T): T => {
    const copy = JSON.parse(JSON.stringify(object));
    return copy;
}


export function getFromTableRandom(table:Object[]) {
    return table[Math.floor(Math.random() * table.length)];
}
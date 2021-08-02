const seedrandom = require('seedrandom');

function seededRandomString(string, idLength = 6, charSetOverride) {
    // const charSet = charSetOverride || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_';
    const charSet = charSetOverride || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let seedNumber = seedrandom(string)();
    let outputString = '';
    for (let i = 0; i < idLength; i++) {
        seedNumber = seedrandom(seedNumber)();
        const randomCharSetIndex = Math.floor(seedNumber * charSet.length);
        const character = charSet[randomCharSetIndex];
        // console.log(seedNumber, randomCharSetIndex, character);
        outputString += character;
    }
    return outputString;
}

module.exports = seededRandomString;

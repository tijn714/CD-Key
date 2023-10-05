const fs = require('fs');
const crypto = require('crypto');

var generatedKeys = [];
var hashedKeys = [];

let filename = generateFileName();



let logo =  [
"     ____ ____        _  __          ",
"    / ___|  _ \\      | |/ /___ _   _ ",
"   | |   | | | |_____| ' // _ \\ | | |",
"   | |___| |_| |_____| . \\  __/ |_| |",
"    \\____|____/      |_|\\_\\___|\\__, |",
"                               |___/ ",
"  By: Tijn Rodrigo                                 " 
]                                              

// check if the output folder exists, if not, create it
if (!fs.existsSync("output")) {
    fs.mkdirSync("output");
}


console.log(logo.join("\n"));

function generateKey() {
    var key = "";
    var sectors = 5; // Modify this to change the number of sectors, 5 is the default
    var sectorLength = 5; // Modify this to change the length of each sector (in characters), 5 is the default
    var possible = "ACDEFGHIJKLMNOPQRSTUVXY01245789";

    var usedCharacters = {};

    for (var i = 0; i < sectors; i++) {
        var sector = "";

        for (var j = 0; j < sectorLength; j++) {
            var char;
            do {
                char = possible.charAt(Math.floor(Math.random() * possible.length));
            } while (usedCharacters[char] >= 2);

            sector += char;
            usedCharacters[char] = (usedCharacters[char] || 0) + 1;
        }

        key += sector;
        if (i < sectors - 1) key += "-";
    }

    generatedKeys.push(key);

    const sha256 = crypto.createHash('sha256');
    sha256.update(key);
    const hashedKey = sha256.digest('hex');
    hashedKeys.push(hashedKey);

    return key;
}

var numKeysToGenerate = 10; // Modify this to change the number of keys to generate, 10 is the default
for (var i = 0; i < numKeysToGenerate; i++) {
    generateKey();
}

const data = {
    generatedKeys: generatedKeys,
    hashedKeys: hashedKeys
};


// function to generate the .json filename (date + hashed md5 date).json
function generateFileName() {
    var date = new Date();
    var dateStr = date.toISOString().replace(/:/g, "-");
    var md5 = crypto.createHash('md5');
    md5.update(dateStr);
    var md5Str = md5.digest('hex');
    return "."+dateStr + "-" + md5Str + ".json";
}

fs.writeFile("output/"+filename, JSON.stringify(data, null, 2), (err) => {
    if (err) {
        console.log(" Your CD keys have been generated successfully.\n");
        console.log(" Generated keys:");
        console.log(generatedKeys);
        console.log(" Hashed keys:");
        console.log(hashedKeys);
        console.error(` Something when wrong while saving your CD keys to 'output/${filename}'`);
        console.error(err);
    } else {
        console.log(" Your CD keys have been generated successfully.\n");
        console.log(" Generated keys:");
        console.log(generatedKeys);
        console.log(" Hashed keys:");
        console.log(hashedKeys);
        console.log(` Your CD keys have been saved successfully to 'output/${filename}'`);
    }
});

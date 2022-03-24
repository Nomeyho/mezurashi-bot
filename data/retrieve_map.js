const { getArcadeMap } = require('../src/client');
const { writeFileSync } = require('fs');
const { ACCOUNT } = require('../src/config');

const MAX_MAP = 500;

async function main() {
    const maps = [];

    for(let i = 0; i < MAX_MAP; i++) {
        const map = await getArcadeMap(ACCOUNT, i, undefined);
        if (!map) {
            break;
        } else {
            console.log(`Retrieved map ${i}: ${map._id}, ${map.name}`);
            maps.push(map);
        }
    }

    console.log(`Retrieved ${maps.length} maps`);
    writeFileSync('./data/maps.json', JSON.stringify(maps, null, 2));
}

main();

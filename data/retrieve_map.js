const { getArcadeMap } = require('../src/client');
const { writeFileSync } = require('fs');

async function main() {
    const maps = [];

    for(let i = 0; i < 500; i++) {
        const map = await getArcadeMap('0xA2Ed91BF97377eB418804c302319fa26f258292A', i);
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

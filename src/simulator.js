
const player1 = { life: 230, force: 37, speed: 19, time: 0 };
const player2 = {  life: 197,  force: 39, speed: 16, time: 0 };

console.log(player1);
console.log(player2);

while (player1.life > 0 && player2.life > 0) {
    player1.time++;
    player2.time++;

    if (player1.time == 2500 - player1.speed) {
        player2.life -= player1.force;
        player1.time = 0;
        console.log(`${player1.life} / ${player2.life}`);
    }

    if (player2.time == 2500 - player2.speed) {
        player1.life -= player2.force;
        player2.time = 0;
        console.log(`${player1.life} / ${player2.life}`);
    }
}

if (player1.life <= 0 && player2.life <= 0) {
    console.log(`Draw`);
} else if (player1.life <= 0) {
    console.log(`Player 2 win`);
} else {
    console.log(`Player 1 win`);
}

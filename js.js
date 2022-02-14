const startBtn = document.querySelector('.startBtn');
const rowList = document.querySelectorAll('.row');
const TICKSPEED = 1000;
let unavailableCells = [];
let gridSize = 20;
let gameOn = false;
let tick = 0;
// grid is rowList[i].cells[j]

startBtn.addEventListener('click', (e) => {
    if (gameOn) {return};
    start();
});

function start() {
    gameOn = true;
    placeInitialCells();
    setInterval(incrementTicks, TICKSPEED);
    setInterval(spawn, TICKSPEED);
};

// increment spawners
function spawn() {
    let cell, current;
    if (!gameOn) {return};
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // add +1 to appropriate cells
            cell = rowList[i].cells[j];
            if (cell.classList.contains('spawner')) {
                current = parseInt(cell.innerText) + 1;
                cell.innerText = current;
            }
            else if (cell.classList.contains('player' || 'cpu')) {
                if (tick % 10 === 0) {
                    current = parseInt(cell.innerText) + 1;
                    cell.innerText = current;
                }
            }
        }
    }
};

function placeInitialCells() {
    // place player in a random cell
    let num1 = randomCell();
    let num2 = randomCell();
    rowList[num1].cells[num2].classList.add('playerStart', 'spawner', 'player');
    unavailableCells.push([num1, num2]);
    placeCPU(num1, num2);
};

function placeCPU(i, j) {
    // place CPU in a random cell that is NOT player cell
    let num1, num2;
    do {
        num1 = randomCell();
        num2 = randomCell();
    } while (i === num1 && j === num2);
    rowList[num1].cells[num2].classList.add('cpuStart', 'spawner', 'cpu');
};

function randomCell() {
    return Math.floor(Math.random() * (gridSize - 1));
};

function incrementTicks() {
    tick++;
    document.querySelector('.ticks').innerText = tick;
};


const startBtn = document.querySelector('.startBtn');
const cellList = document.querySelectorAll('.row');
const TICKSPEED = 1000;
let queue = [];
let unavailableCells = [];
let activeCell = [];
let gridSize = 20;
let gameOn = false;
let isSelected = false;
let tick = 0;
let tickInterval, spawnInterval, moveInterval;
// grid is made of cellList[i].cells[j]

window.addEventListener('keydown', keyDown);

startBtn.addEventListener('click', (e) => {
    if (gameOn) {return};
    start();
});

function start() {
    gameOn = true;
    placeInitialCells();
    placeSpawners(5);
    tickInterval = setInterval(incrementTicks, TICKSPEED);
    spawnInterval = setInterval(spawn, TICKSPEED);
    moveInterval = setInterval(conquer, TICKSPEED/2);
};

// increment spawners
function spawn() {
    let cell, current;
    if (!gameOn) {return};
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // add +1 to appropriate cells
            cell = cellList[i].cells[j];
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
    let player = cellList[num1].cells[num2];
    player.classList.add('playerStart', 'spawner', 'player', 'active');
    player.classList.remove('neutral');
    activeCell.push(num1);
    activeCell.push(num2);
    unavailableCells.push(`${num1}${num2}`);
    placeCPU(num1, num2);
};

function placeCPU(i, j) {
    // place CPU in a random cell that is NOT player cell
    let num1, num2, cpu;
    do {
        num1 = randomCell();
        num2 = randomCell();
    } while (i === num1 && j === num2);
    cpu = cellList[num1].cells[num2];
    cpu.classList.add('cpuStart', 'spawner', 'cpu');
    cpu.classList.remove('neutral');
    unavailableCells.push(`${num1}${num2}`);
};

function placeSpawners(n) {
    let num1, num2;
    while (n > 0) {
        num1 = randomCell();
        num2 = randomCell();
        if (unavailableCells.indexOf(`${num1}${num2}`) === -1) {
            cellList[num1].cells[num2].classList.add('spawner');
            n--;
        }
    }
}

function randomCell() {
    return Math.floor(Math.random() * (gridSize - 1));
};

function incrementTicks() {
    tick++;
    document.querySelector('.ticks').innerText = tick;
};

// navigate the grid
function keyDown(event) {
    let active = document.querySelector('.active');
    let i = activeCell[0];
    let j = activeCell[1];
    let nextCell, currentCell;
    currentCell = cellList[i].cells[j] 
    if (currentCell.classList.contains('selected')) {
        isSelected = true;
    }

    // space bar
    if (event.keyCode === 32) {
        selectCell(i, j);
        return;
    } else if (event.key == 'w' || event.key == 'ArrowUp') {
        if (activeCell[0] == 0) {
            return;
        } else { 
            i--;
            active.classList.remove('active');
            activeCell[0] = i;
            nextCell = cellList[i].cells[j];
            nextCell.classList.add('active');
            // add cells to the queue to be conquered
            if (isSelected) {
                // original cell
                queue.unshift(cellList[i + 1].cells[j]);
                // next cell
                queue.unshift(nextCell);
                nextCell.classList.add('queued');
            }
        }
    } else if (event.key == 's' || event.key == 'ArrowDown') {
        if (activeCell[0] == (gridSize - 1)) {
            return;
        } else { 
            i++;
            active.classList.remove('active');
            activeCell[0] = i;
            nextCell = cellList[i].cells[j];
            nextCell.classList.add('active');
            // add cells to the queue to be conquered
            if (isSelected) {
                // original cell
                queue.unshift(cellList[i - 1].cells[j]);
                // next cell
                queue.unshift(nextCell);
                nextCell.classList.add('queued');
            }
        }
    } else if (event.key == 'a' || event.key == 'ArrowLeft') {
        if (activeCell[1] == 0) {
            return;
        } else { 
            j--;
            active.classList.remove('active');
            activeCell[1] = j;
            nextCell = cellList[i].cells[j]
            nextCell.classList.add('active');
            // add cells to the queue to be conquered
            if (isSelected) {
                // original cell
                queue.unshift(cellList[i].cells[j + 1]);
                // next cell
                queue.unshift(nextCell);
                nextCell.classList.add('queued');
            }
        }
    } else if (event.key == 'd' || event.key == 'ArrowRight') {
        if (activeCell[1] == (gridSize - 1)) {
            return;
        } else { 
            j++;
            active.classList.remove('active');
            activeCell[1] = j;
            nextCell = cellList[i].cells[j]
            nextCell.classList.add('active');
            // add cells to the queue to be conquered
            if (isSelected) {
                // original cell
                queue.unshift(cellList[i].cells[j - 1]);
                // next cell
                queue.unshift(nextCell);
                nextCell.classList.add('queued');
            }
        }
    } else if (event.key == 'q') {
        clearQueue();
    }
};

function selectCell(i, j) {
    let selected = cellList[i].cells[j];
    // deselect if it is already selected
    if (selected.classList.contains('selected')) {
        selected.classList.remove('selected');
        isSelected = false;
        return;
    }
    // if there is a selected cell anywhere, remove it
     else if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
        isSelected = false;
    };
    // if trying to select a new player cell, select it
    if (selected.classList.contains('player')) {
        selected.classList.toggle('selected');
        isSelected = true;
    } else {
        return;
    }
};

// pop cells off the queue to conquer
function conquer() {
    if (queue.length < 2) {
        return;
    }
    let attacker = queue.pop();
    let defender = queue.pop();
    // remore class lists
    attacker.classList.remove('queued');
    defender.classList.remove('queued');

    // check if attacker is player-owned before moving
    if (!attacker.classList.contains('player')) {
        return;
    }

    let attackArmy = parseInt(attacker.innerText) - 1;
    let defendArmy = parseInt(defender.innerText);

    // if defender is player-owned, cells should migrate together not attack
    if (defender.classList.contains('player')) {
        attacker.innerText = 1;
        defender.innerText = attackArmy + defendArmy;
        return;
    }

    // attack
    // attacker wins
    if (attackArmy > defendArmy) {
        attackArmy -= defendArmy;
        defender.classList.remove('neutral', 'cpu')
        defender.classList.add('player');
        attacker.innerText = 1;
        defender.innerText = attackArmy;
        checkWin(defender);
    }
    // tie
    else if (attackArmy === defendArmy) {
        attacker.innerText = 1;
        defender.innerText = 0;   
    }
    // defender wins
    else if (attackArmy < defendArmy) {
        attacker.innerText = 1;
        defender.innerText = defendArmy - attackArmy;
    }
};

function checkWin(defender) {
    if (defender.classList.contains('player') && defender.classList.contains('cpuStart')) {
        clearInterval(tickInterval);
        clearInterval(spawnInterval);
        clearInterval(moveInterval);
        let youWin = document.createElement('h1');
        youWin.innerText = `YOU WIN. SCORE: ${tick}. RELOAD THE PAGE`;
        document.querySelector('.instructions').append(youWin);
    }
    return;
}

function clearQueue() {
    let len = queue.length;
    let cell;
    if (document.querySelector('.selected')) {
        let selected = document.querySelector('.selected');
        selected.classList.remove('selected');
        isSelected = false;
    }
    for (let i = 0; i < len; i++) {
        cell = queue.pop();
        cell.classList.remove('queued');
    }
}

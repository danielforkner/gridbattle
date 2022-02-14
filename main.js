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
// grid is made of cellList[i].cells[j]

window.addEventListener('keydown', keyDown);

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
    activeCell.push(num1);
    activeCell.push(num2);
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
    cellList[num1].cells[num2].classList.add('cpuStart', 'spawner', 'cpu');
};

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
    }

    if (event.key == 'w' || event.key == 'ArrowUp') {
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
    }
    if (event.key == 's' || event.key == 'ArrowDown') {
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
    }
    if (event.key == 'a' || event.key == 'ArrowLeft') {
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
                queue.unshift(cellList[j + 1].cells[j]);
                // next cell
                queue.unshift(nextCell);
                nextCell.classList.add('queued');
            }
        }
    }
    if (event.key == 'd' || event.key == 'ArrowRight') {
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
                queue.unshift(cellList[j - 1].cells[j]);
                // next cell
                queue.unshift(nextCell);
                nextCell.classList.add('queued');
            }
        }
    }
};

function selectCell(i, j) {
    let selected = cellList[i].cells[j];
    // if there is a selected cell anywhere, remove it
    if (document.querySelector('.selected')) {
        document.querySelector('.selected').classList.remove('selected');
        isSelected = false;
    };
    // if trying to select a player cell, select it
    if (selected.classList.contains('player')) {
        selected.classList.add('selected');
        isSelected = true;
    } else {
        return;
    }
};

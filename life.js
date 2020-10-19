"use strict";
let lifeScreen = null;
let interval = null;

function LifeScreen(nRows, nCols) {
    this.nRows = nRows;
    this.nCols = nCols;
    this.changeds = [];

    this.drawEmptyGrid = function () {
        let parent = document.getElementById('parent');
        for (let i = 0; i < this.nRows; i++)
            for (let j = 0; j < this.nCols; j++) {
                let div = window.document.createElement('div');
                div.id = `${i}_${j}`;
                div.className = 'cellOff';
                div.onclick = (() => {
                    div.className = (div.className === 'cellOn') ? 'cellOff' : 'cellOn';
                });
                parent.appendChild(div);
            }
    }

    this.getCell = function (i, j) {
        if (i < 0)
            i = this.nCols - 1;
        if (j < 0)
            j = this.nRows - 1;
        i = i % this.nCols;
        j = j % this.nRows;
        return new Cell(i, j, document.getElementById(`${i}_${j}`), this);
    }

    this.toggleCell = function (i, j, cellClass) {
        let cell = this.getCell(i, j);
        cell.nextClass = cellClass;
        cell.paint();
    }

    this.loadInitConfiguration = function () {
        this.toggleCell(5, 5, 'cellOn');
        this.toggleCell(5, 6, 'cellOn');
        this.toggleCell(5, 7, 'cellOn');
        this.toggleCell(6, 6, 'cellOn');


        //autómata palo
        this.toggleCell(4, 15, 'cellOn');
        this.toggleCell(4, 16, 'cellOn');
        this.toggleCell(4, 17, 'cellOn');

        //autómata móvil
        this.toggleCell(11, 11, 'cellOn');
        this.toggleCell(12, 12, 'cellOn');
        this.toggleCell(12, 13, 'cellOn');
        this.toggleCell(13, 11, 'cellOn');
        this.toggleCell(13, 12, 'cellOn');
    }

    this.calculateNextGrid = function () {
        this.changeds = [];
        for (let i = 0; i < this.nRows; i++)
            for (let j = 0; j < this.nCols; j++) {
                let cell = new Cell(i, j, document.getElementById(`${i}_${j}`), this);
                cell.liveOrDie(this.changeds);
            }
    }

    this.paintGrid = function () {
        this.changeds.forEach((cell) => {
            cell.paint();
        });
    }

    return this;
}

function Cell(i, j, div, lifeScreen) {
    this.i = i;
    this.j = j;
    this.div = div;
    this.lifeScreen = lifeScreen;

    this.isOn = function () {
        return this.div.className === 'cellOn';
    }

    this.getAliveNeighbors = function () {
        return lifeScreen.getCell(this.i - 1, this.j - 1).isOn() +
            lifeScreen.getCell(this.i - 1, this.j).isOn() +
            lifeScreen.getCell(this.i - 1, this.j + 1).isOn() +
            lifeScreen.getCell(this.i, this.j - 1).isOn() +
            lifeScreen.getCell(this.i, this.j + 1).isOn() +
            lifeScreen.getCell(this.i + 1, this.j - 1).isOn() +
            lifeScreen.getCell(this.i + 1, this.j).isOn() +
            lifeScreen.getCell(this.i + 1, this.j + 1).isOn();
    }

    this.liveOrDie = function (changeds) {
        let aliveNeighbors = this.getAliveNeighbors();
        this.nextClass = this.div.className;
        this.changed = false;
        if ((this.div.className === 'cellOff') && (aliveNeighbors === 3))
            this.nextClass = 'cellOn';
        else
            if ((this.div.className === 'cellOn') && ((aliveNeighbors < 2) || (aliveNeighbors > 3)))
                this.nextClass = 'cellOff';
        if (this.nextClass !== this.div.className)
            changeds.push(this);
    }

    this.paint = function () {
        this.div.className = this.nextClass;
    }

    return this;
}

function startPressed() {
    interval = setInterval(() => {
        lifeScreen.calculateNextGrid();
        lifeScreen.paintGrid();
    }, 100);
}

function stopPressed() {
    clearInterval(interval);
}

function start() {
    lifeScreen = new LifeScreen(100, 100);
    lifeScreen.drawEmptyGrid();
    lifeScreen.loadInitConfiguration();

}
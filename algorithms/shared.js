class State{
    constructor(n,board){
        this.N = n;
        this.board = this.CloneBoard(board);
        this.totalHeuristicCost = this.getHeuristicValue();
        this.heuristicTable = this.calculateHeuristicTable();//this.inicilazeHeuristicTable();


    }
    inicilazeHeuristicTable = function () {
        let n = this.N;
        let hTable = [];
        for (let i = 0; i < n; i++) {
            hTable[i] = [];
            for (let j = 0; j < n; j++) {
                hTable[i][j] = 0;
            }
        }
        return hTable;
    }

    generateBoardWithQueensAtRandomPos = function(N) {
        let qboard = new Array(Number(N));
        for (let i = 0; i < qboard.length; ++i) {
            qboard[i] = new Array(Number(N)).fill(false);
        }

        for (let j = 0; j < N; ++j) { // col
            let queen_y = Math.floor(Math.random() * N);
            qboard[queen_y][j] = true;
        }
        return qboard;
    }

    CloneBoard = function (board) {
        if (board == undefined)
            return this.generateBoardWithQueensAtRandomPos(this.N);
        let newBoard = Array.apply(null, Array(board.length)).map(function () { return new Array(board.length).fill(false); });
        for (let i = 0; i < board.length; ++i)
            for (let j = 0; j < board.length; ++j) {
                if (board[i][j])
                    newBoard[i][j] = true;
            }
        return newBoard;
    }

    getYPosOfQueen = function (x) {
        for (let y = 0; y < this.board.length; ++y) {
            if (this.board[y][x]) {
                return y;
            }
        }
        return -1;
    }

    getHeuristicValue = function () {      
        // for (let i = 0; i < this.N; ++i) {
        //     if (this.getYPosOfQueen[i] == -1) {
        //         return Math.pow(10, 10000);
        //     }
        // }
        let simplifiedBoard = [];
        for (let i = 0; i < this.board.length; ++i)
            for (let j = 0; j < this.board.length; ++j)
                if (this.board[i][j]) {
                    simplifiedBoard[j] = i;
                }
        let h = 0;
        for (let i = 0; i < simplifiedBoard.length; ++i)
            for (let j = i + 1; j < simplifiedBoard.length; ++j) {
                if (simplifiedBoard[i] == simplifiedBoard[j])
                    ++h;
                let offset = j - i;
                if ((simplifiedBoard[i] == simplifiedBoard[j] - offset) || (simplifiedBoard[i] == simplifiedBoard[j] + offset))
                    ++h;
            }
        return h;
    }

    calculateHeuristicTable = function () {
        let heuristicTable = this.inicilazeHeuristicTable();
        // for (let i = 0; i < this.N; ++i) {
        //     if (this.getYPosOfQueen[i] == -1) {
        //         return heuristicTable;
        //     }
        // }
        for (let x = 0; x < this.N; ++x) { // cols
            let yPosOfQueen = this.getYPosOfQueen(x);
            this.board[yPosOfQueen][x] = false;
            for (let y = 0; y < this.N; ++y) { // rows
                this.board[y][x] = true;
                heuristicTable[y][x] = this.getHeuristicValue(); //this.calcHeuristicCost();
                this.board[y][x] = false;
            }
            this.board[yPosOfQueen][x] = true;
        }
        return heuristicTable;
    }

    fillHeuristicTable = function () {
        this.heuristicTable = this.calculateHeuristicTable();
    }

    moveQueen = function (X, newY) {
        //fillHeuristicTable();

        let curPosYOfQueen = this.getYPosOfQueen(X);
        this.board[curPosYOfQueen][X] = false;
        this.board[newY][X] = true;
        this.totalHeuristicCost = this.getHeuristicValue();
        this.fillHeuristicTable();
    }

    selectBest = function () { // calculate new totalHeuristics, moveQueenInTable
        //this.fillHeuristicTable();
        let localMin = [-1, -1, Math.pow(10, 1000)]; // row, column, heuristicCost
        let localMins = [];

        for (let i = 0; i < this.heuristicTable.length; ++i) {
            for (let j = 0; j < this.heuristicTable[i].length; ++j) {
                if (this.heuristicTable[i][j] < localMin[2]) {
                    localMin = [i, j, this.heuristicTable[i][j]];
                    localMins = [localMin];

                } else if (this.heuristicTable[i][j] == localMin[2]) {
                    localMin = [i, j, this.heuristicTable[i][j]];
                    localMins.push(localMin);
                }
            }
        }

        // If there are multiple global minimums choose randomly 
        // realy?
        if (localMins.length > 1) {
            localMin = localMins[Math.floor(Math.random() * localMins.length)]
        }
        return [localMin[1], localMin[0], localMin[2]]; // x,y, fitness

        // Move the queen 

        // let localMinY = localMin[0]; // row
        // let localMinX = localMin[1]; // col

        // let curPosYOfQueen = this.getYPosOfQueen(localMinX);
        // let newPosYOfQueen = localMinY;
        // this.board[curPosYOfQueen][localMinX] = false;
        // this.board[newPosYOfQueen][localMinX] = true;

        // this.totalHeuristicCost = localMin[2]; // heuristicCost
    }
    
    selectRandom = function () {
        let randomX = Math.floor(Math.random() * this.board.length);
        let randomY = Math.floor(Math.random() * this.board.length);
        let heuristicCost = this.heuristicTable[randomY][randomX];
        return [randomX, randomY, heuristicCost];
    }
    
    selectBestAndMakeMove = function () {
        let best = this.selectBest();
        this.moveQueen(best[0], best[1]);
    }
    
    selectRandomAndMakeMove = function () {
        let random = this.selectRandom();
        this.moveQueen(random[0], random[1]);
    }
    
    hello = function () {
        alert('Hello');
    }

}


//-----------------------
// function setQueensRandom(n) {
//     let qboard = new Array(Number(n));
//     for (let i = 0; i < qboard.length; ++i) {
//         qboard[i] = new Array(Number(n));
//     }

//     clearBoard(n);
//     for (let i = 0; i < qboard.length; ++i) {
//         let queen_y = Math.floor(Math.random() * n);
//         qboard[queen_y][i] = true;
//     }
//     return qboard;
// }

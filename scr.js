//
// Include files with algorithm functions
//
function setUp2(){
    let importedFiles = ['hillClimbing.js', 'simulatedAnnealing.js', 'localBeamSearch.js','geneticAlgorithm.js', 'shared.js'];
    for (i = 0; i < importedFiles.length; i++){
        let imported = document.createElement('script');
        imported.src = 'algorithms/' + importedFiles[i];
        document.head.appendChild(imported);
    }
}
this.setUp2();

//
// Initialize
//
window.onload = function() {

    // Button
    document.getElementById("my-btn").addEventListener("click", Calculte);

    // Sync range slider with text box
    let changeCells = function(id1, id2){
        document.getElementById(id1).value = document.getElementById(id2).value;
    }
    document.getElementById("cellsInRow").addEventListener("change", () => {
       changeCells("cellsInRowInfo","cellsInRow");
    });
    document.getElementById("cellsInRowInfo").addEventListener("change", () =>{
        changeCells("cellsInRow","cellsInRowInfo");
    });
    changeCells("cellsInRowInfo","cellsInRow");

    // Draw empty boards
    this.clearBoard1(document.getElementById("cellsInRow").value);
    this.clearBoard2(document.getElementById("cellsInRow").value);

    // Sync algorithm droplist with visibility of parameters 
    document.getElementById("algorithms").addEventListener("change", () => {
        let simulatedAnnealingContainer = document.getElementById("simulatedAnnealingContainer");
        let localBeamContainer = document.getElementById("localBeamContainer");
        let geneticContainer = document.getElementById("geneticContainer");
            simulatedAnnealingContainer.style.display = "none";
            localBeamContainer.style.display = "none";
            geneticContainer.style.display = "none";


        let algorithmObj = document.getElementById("algorithms");
        let algorithm = algorithmObj.options[algorithmObj.selectedIndex].value;
        switch(algorithm) {
            case 'simulated-annealing':
                simulatedAnnealingContainer.style.display = "flex";
                break;
            case 'local-beam-search':
                localBeamContainer.style.display = "flex";
                break;
            case 'genetic-algorithm':
                geneticContainer.style.display = "flex";
                break;
        }
    });
    document.getElementById("simulatedAnnealingContainer").style.display = "none";
    document.getElementById("localBeamContainer").style.display = "none";
    document.getElementById("geneticContainer").style.display = "none";
}

//
// Call algorithm chosen by user
//
function Calculte() {

    // Get algorithm and main Parameters
    let algorithmObj = document.getElementById("algorithms");
    let algorithm = algorithmObj.options[algorithmObj.selectedIndex].value;
    let N = document.getElementById("cellsInRow").value;
    if (N < 0 || N == 2 || N == 3) {
        alert("N bust be a nonnegative natural number and not equal 2 or 3.")
        return;
    }
    let maxAttempts = document.getElementById("maxAttempts").value;

    // Calculate new board
    let result;
    switch(algorithm) {
        case 'hill-climbing':
            result =  hillClimbing(N, maxAttempts);
            break;
        case 'simulated-annealing':
            startingTemperature = document.getElementById("startingTemperature").value;
            coolingFactor =  document.getElementById("coolingFactor").value;
            result = simulatedAnnealing(N, maxAttempts, startingTemperature, coolingFactor);
            break;
        case 'local-beam-search':
            nrOfStates =  document.getElementById("nrOfStates").value;
            result = localBeamSearch(N, maxAttempts, nrOfStates);
            break;
        case 'genetic-algorithm':
            sizeOfGeneration = document.getElementById("sizeOfGeneration").value;
            percentOfElitism = document.getElementById("percentOfElitism").value/100;
            crossoverProbability = document.getElementById("crossoverProbability").value/100;
            mutationProbability = document.getElementById("mutationProbability").value/100;
            nrOfGenerations = document.getElementById("nrOfGenerations").value;           
            result = geneticAlgorithms(N, maxAttempts, sizeOfGeneration, percentOfElitism, crossoverProbability, mutationProbability, nrOfGenerations);
            break;
        default:
            alert('cheating :)');
            return;
    }
    // Draw calculated board
    drawQueens2(result, N);
}

//
// Remove previous board and create a new empty one
//
function clearBoard(cellsInRow, boardContainerID) {
    var board = document.getElementById(boardContainerID);
    while (board.hasChildNodes()) {
        board.removeChild(board.childNodes[0]);
    }
    if(boardContainerID == "boardContainer1")
        createBoard1(cellsInRow);
    else
        createBoard2(cellsInRow);
}

function clearBoard1(cellsInRow) {
    clearBoard(cellsInRow, "boardContainer1");
}
function clearBoard2(cellsInRow) {
    clearBoard(cellsInRow, "boardContainer2");
}

//
// Draw empty board
//
function createBoard(cellsInRow, boardContainerID,  opacity, whiteCells_ImgSrc, blackCells_ImgSrc) {
    let board = document.getElementById(boardContainerID);

    // Adaptive board size
    board.style.width = (board.clientWidth - board.clientWidth % cellsInRow) + 'px';
    board.style.height = board.style.width;

    for (let i = 0; i < cellsInRow; ++i) {
        for (let j = 0; j < cellsInRow; ++j) {
            let img = new Image();
            img.src = whiteCells_ImgSrc;
            if ((i + j) % 2 == 1) {
                img.src = blackCells_ImgSrc;
            }
            img.width = board.clientWidth / cellsInRow;
            img.height = board.clientHeight / cellsInRow;
            img.style.left = img.width * i + 'px';
            img.style.top = img.height * j + 'px';
            img.style.opacity = opacity;
            board.appendChild(img);
        } 
    }
}

function createBoard2(cellsInRow) {
    let boardContainerID = "boardContainer2";
    let whiteCells_ImgSrc = "img/white.jpg";
    let blackCells_ImgSrc = "img/black.png";
    let opacity = 0.9;
    createBoard(cellsInRow, boardContainerID, opacity, whiteCells_ImgSrc,blackCells_ImgSrc);
}
function createBoard1(cellsInRow) {
    let boardContainerID = "boardContainer1";
    let whiteCells_ImgSrc = "img/white.jpg";
    let blackCells_ImgSrc = "img/black.png";
    let opacity = 0.65;
    createBoard(cellsInRow,boardContainerID, opacity, whiteCells_ImgSrc, blackCells_ImgSrc);
}

//
// Draw queens positions
//
function drawQueens(result, cellsInRow, boardContainerID, queen_ImgSrc) {
    
    clearBoard(cellsInRow, boardContainerID);
 
    let board = document.getElementById(boardContainerID);
    for (let i = 0; i < result.length; ++i) {
        for (let j = 0; j < result.length; ++j) {
            if (result[i][j]) {
                let img = new Image();
                img.src = queen_ImgSrc;
                img.width = board.clientWidth / cellsInRow;
                img.height = board.clientHeight / cellsInRow;
                img.style.left = img.width * j + 'px';
                img.style.top = img.height * i + 'px';
                board.appendChild(img);
            }
        } 
    }
}

function drawQueens1(result, cellsInRow){
    boardContainerID = "boardContainer1";
    let queen_ImgSrc = "img/queen.png";
    drawQueens(result, cellsInRow, boardContainerID, queen_ImgSrc);
}

function drawQueens2(result, cellsInRow){
    boardContainerID = "boardContainer2";
    let queen_ImgSrc = "img/queen.png";
    drawQueens(result, cellsInRow, boardContainerID, queen_ImgSrc);
}


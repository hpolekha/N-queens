var printCost = false;
//
// Include files with algorithm functions
//
function setUp2() {
  let importedFiles = [
    "hillClimbing.js",
    "simulatedAnnealing.js",
    "localBeamSearch.js",
    "geneticAlgorithm.js",
    "shared.js",
  ];
  for (i = 0; i < importedFiles.length; i++) {
    let imported = document.createElement("script");
    imported.src = "js/algorithms/" + importedFiles[i];
    document.head.appendChild(imported);
  }
}
this.setUp2();

//
// Initialize
//
window.onload = function () {
  // Button
  document.getElementById("run-btn").addEventListener("click", function () {
    function hideDiv(el) {
      el.classList.add("opacity");
    }

    function showDiv(el) {
      //   el.style.visibility = "visible";
      el.classList.remove("opacity");
    }
    printCost = !!document.getElementById("logInfo").checked ? true : false;
    document.getElementById("info").textContent = "Solving...";
    document.getElementById("time").textContent = "";
    let boards = document.getElementById("chessBoardContainer");
    // boards.style.visibility = "hidden";
    hideDiv(boards);
    setTimeout(() => {
      Calculte();
      //   boards.style.visibility = "visible";
      showDiv(boards);
    }, 300);
  });

  // Sync range slider with text box
  let changeCells = function (id1, id2) {
    document.getElementById(id1).value = document.getElementById(id2).value;
  };
  document.getElementById("cellsInRow").addEventListener("change", () => {
    changeCells("cellsInRowInfo", "cellsInRow");
  });
  document.getElementById("cellsInRowInfo").addEventListener("change", () => {
    changeCells("cellsInRow", "cellsInRowInfo");
  });
  changeCells("cellsInRowInfo", "cellsInRow");

  // Draw empty boards
  this.clearBoard1(document.getElementById("cellsInRow").value);
  this.clearBoard2(document.getElementById("cellsInRow").value);

  // Sync algorithm droplist with visibility of parameters
  document.getElementById("algorithms").addEventListener("change", () => {
    let simulatedAnnealingContainer = document.getElementById(
      "simulatedAnnealingContainer"
    );
    let localBeamContainer = document.getElementById("localBeamContainer");
    let geneticContainer = document.getElementById("geneticContainer");
    simulatedAnnealingContainer.style.display = "none";
    localBeamContainer.style.display = "none";
    geneticContainer.style.display = "none";

    let algorithmObj = document.getElementById("algorithms");
    let algorithm = algorithmObj.options[algorithmObj.selectedIndex].value;
    switch (algorithm) {
      case "simulated-annealing":
        simulatedAnnealingContainer.style.display = "flex";
        break;
      case "local-beam-search":
        localBeamContainer.style.display = "flex";
        break;
      case "genetic-algorithm":
        geneticContainer.style.display = "flex";
        break;
    }
  });
  document.getElementById("simulatedAnnealingContainer").style.display = "none";
  document.getElementById("localBeamContainer").style.display = "none";
  document.getElementById("geneticContainer").style.display = "none";
};

//
// Call algorithm chosen by user
//
function Calculte() {
  // Get algorithm and main Parameters
  let algorithmObj = document.getElementById("algorithms");
  let algorithm = algorithmObj.options[algorithmObj.selectedIndex].value;
  let N = document.getElementById("cellsInRow").value;
  if (N < 0 || N == 2 || N == 3) {
    alert("N bust be a nonnegative natural number and not equal 2 or 3.");
    return;
  }
  let maxAttempts = document.getElementById("maxAttempts").value;

  // Calculate new board
  let result;
  let cost;
  let start;
  let end;
  switch (algorithm) {
    case "hill-climbing":
      start = performance.now();
      [result, cost] = hillClimbing(N, maxAttempts, printCost);
      end = performance.now();
      break;
    case "simulated-annealing":
      startingTemperature = document.getElementById(
        "startingTemperature"
      ).value;
      coolingFactor = document.getElementById("coolingFactor").value;
      start = performance.now();
      [result, cost] = simulatedAnnealing(
        N,
        maxAttempts,
        startingTemperature,
        coolingFactor,
        printCost
      );
      end = performance.now();
      break;
    case "local-beam-search":
      nrOfStates = document.getElementById("nrOfStates").value;
      start = performance.now();
      [result, cost] = localBeamSearch(N, maxAttempts, nrOfStates, printCost);
      end = performance.now();
      break;
    case "genetic-algorithm":
      sizeOfGeneration = document.getElementById("sizeOfGeneration").value;
      percentOfElitism =
        document.getElementById("percentOfElitism").value / 100;
      crossoverProbability =
        document.getElementById("crossoverProbability").value / 100;
      mutationProbability =
        document.getElementById("mutationProbability").value / 100;
      nrOfGenerations = document.getElementById("nrOfGenerations").value;
      start = performance.now();
      [result, cost] = geneticAlgorithms(
        N,
        maxAttempts,
        sizeOfGeneration,
        percentOfElitism,
        crossoverProbability,
        mutationProbability,
        nrOfGenerations,
        printCost
      );
      end = performance.now();
      break;
    default:
      alert("cheating :)");
      return;
  }
  // Draw calculated board
  drawQueens2(result, N, cost);
  document.getElementById("time").textContent = `Execution time: ${(
    end - start
  ).toFixed(2)} ms`;
}

//
// Remove previous board and create a new empty one
//
function clearBoard(cellsInRow, boardContainerID) {
  var board = document.getElementById(boardContainerID);
  while (board.hasChildNodes()) {
    board.removeChild(board.childNodes[0]);
  }
  if (boardContainerID == "boardContainer1") createBoard1(cellsInRow);
  else createBoard2(cellsInRow);
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
function createBoard(
  cellsInRow,
  boardContainerID,
  opacity,
  whiteCells_ImgSrc,
  blackCells_ImgSrc
) {
  let board = document.getElementById(boardContainerID);

  // Adaptive board size
  board.style.width =
    board.clientWidth - (board.clientWidth % cellsInRow) + "px";
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
      img.style.left = img.width * i + "px";
      img.style.top = img.height * j + "px";
      img.style.opacity = opacity;
      board.appendChild(img);
    }
  }
}
function createBoardD(
  cellsInRow,
  boardContainerID,
  whiteCellClass,
  blackCellClass
) {
  let board = document.getElementById(boardContainerID);

  // Clear previous content
  board.innerHTML = "";

  // Adaptive board size
  board.style.width =
    board.clientWidth - (board.clientWidth % cellsInRow) + "px";
  board.style.height = board.style.width;
  board.style.position = "relative"; // Ensure absolute-positioned children work correctly

  let cellWidth = board.clientWidth / cellsInRow;
  let cellHeight = board.clientHeight / cellsInRow;

  for (let i = 0; i < cellsInRow; ++i) {
    for (let j = 0; j < cellsInRow; ++j) {
      let cell = document.createElement("div");
      cell.style.position = "absolute";
      cell.style.width = `${cellWidth}px`;
      cell.style.height = `${cellHeight}px`;
      cell.style.left = `${cellWidth * j}px`;
      cell.style.top = `${cellHeight * i}px`;
      // cell.style.opacity = opacity;

      // Assign CSS class based on position
      if ((i + j) % 2 === 0) {
        cell.className = whiteCellClass;
      } else {
        cell.className = blackCellClass;
      }

      board.appendChild(cell);
    }
  }
}

function createBoard2(cellsInRow) {
  let boardContainerID = "boardContainer2";
  let whiteCells_ImgSrc = "img/white.jpg";
  let blackCells_ImgSrc = "img/black.png";
  let opacity = 0.9;
  // createBoard(cellsInRow, boardContainerID, opacity, whiteCells_ImgSrc,blackCells_ImgSrc);
  createBoardD(cellsInRow, boardContainerID, "ww2", "bb2");
}
function createBoard1(cellsInRow) {
  let boardContainerID = "boardContainer1";
  let whiteCells_ImgSrc = "img/white.jpg";
  let blackCells_ImgSrc = "img/black.png";
  let opacity = 0.65;
  // createBoard(cellsInRow,boardContainerID, opacity, whiteCells_ImgSrc, blackCells_ImgSrc);
  createBoardD(cellsInRow, boardContainerID, "ww1", "bb1");
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
        img.style.left = img.width * j + "px";
        img.style.top = img.height * i + "px";
        board.appendChild(img);
      }
    }
  }
}

function drawQueens1(result, cellsInRow, cost) {
  boardContainerID = "boardContainer1";
  let queen_ImgSrc = "img/queen.png";
  drawQueens(result, cellsInRow, boardContainerID, queen_ImgSrc);
  document.getElementById(
    "cost1"
  ).innerHTML = `Attacking pairs: <span class="text-color ${
    cost === 0 ? "correct" : "wrong"
  }">${cost}</span>`;
}

function drawQueens2(result, cellsInRow, cost) {
  boardContainerID = "boardContainer2";
  let queen_ImgSrc = "img/queen.png";
  drawQueens(result, cellsInRow, boardContainerID, queen_ImgSrc);
  document.getElementById(
    "cost2"
  ).innerHTML = `Attacking pairs: <span class="text-color ${
    cost === 0 ? "correct" : "wrong"
  }">${cost}</span>`;
}

//
// Local Beam Search
//
function localBeamSearch(N, maxNumOfAttempts, nrOfStates) {
    let curNumOfAttempts = 0;

    // Generate start states
    let curStates = [];
    for (let index = 0; index < nrOfStates; index++) {
        curStates.push(new State(N));

        // Check if we were lucky
        if (curStates[index].totalHeuristicCost == 0) {
            document.getElementById('info').textContent = "Success";
            console.log("Lucky Success. Used attempts: " + curNumOfAttempts);
            drawQueens1(curStates[index].board, N);
            return curStates[index].board;
        }
    };

    let copyOfInicializedStates = [];
    for (let index = 0; index < curStates.length; index++) {
       copyOfInicializedStates.push(new State(N,  curStates[index].board));
        }

    
    while ( curNumOfAttempts < maxNumOfAttempts) {
        for (let index = 0; index < curStates.length; index++) {

            // Copy current state and make the best move 
            newState = new State(N, curStates[index].board);
            newState.selectBestAndMakeMove();  
            
            // Check if we have a solution
            if (newState.totalHeuristicCost == 0) {
                document.getElementById('info').textContent = "Success";
                console.log("Success. Used attempts: " + curNumOfAttempts);
                drawQueens1((copyOfInicializedStates[index]).board, N);
                return newState.board;
            }
            
            // Accept the state only if we have better heuristic
            if (newState.totalHeuristicCost < curStates[index].totalHeuristicCost) {
                curStates[index] = newState;
            } 
        }
         ++curNumOfAttempts;
    };

    // Find the closest state to the solutions (the one with miimum heuritic)
    let closestStateToSolutions = [[curStates[0], 0]];
    curStates.forEach(function (curState, index) {
        if (curState.totalHeuristicCost == 0) {
            document.getElementById('info').textContent = "Success";
            console.log("Success. Used attempts: " + curNumOfAttempts);
            drawQueens1((copyOfInicializedStates[index]).board, N);
            return curState.board
        } else if (curState.totalHeuristicCost < closestStateToSolutions[0].totalHeuristicCost) {
            closestStateToSolutions = [[curState, index]];
        } else if (curState.totalHeuristicCost < closestStateToSolutions[0].totalHeuristicCost) {
            closestStateToSolutions.push([curState, index]);
        }
    });

    // Pick the radom one if several states with the same heuristic have been found as the closest to the solution
    let closestStateToSolution = closestStateToSolutions[0];

    if (closestStateToSolutions.length > 1) {
        closestStateToSolution = closestStateToSolutions[Math.floor(Math.random() * closestStateToSolutions.length)]
    }
    document.getElementById('info').textContent = "Not enough attempts";
    console.log("Not enough attempts. Used attempts: " + curNumOfAttempts);

    drawQueens1((copyOfInicializedStates[closestStateToSolution[1]]).board, N);
    return closestStateToSolution[0].board;
}





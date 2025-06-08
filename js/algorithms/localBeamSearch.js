//
// Local Beam Search
//
function localBeamSearch(N, maxNumOfAttempts, nrOfStates, printCost = false) {
    if (printCost) { console.log(`Greedy local beam search ${N}x${N}`);}

    let curNumOfAttempts = 0;

    // Generate start states
    let curStates = [];
    for (let index = 0; index < nrOfStates; index++) {
        curStates.push(new State(N));

        // Check if we were lucky
        if (curStates[index].totalHeuristicCost == 0) {
            document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
            console.log("Lucky Success. Used attempts: " + curNumOfAttempts);
            drawQueens1(curStates[index].board, N, curStates[index].totalHeuristicCost);
            return [curStates[index].board, curStates[index].totalHeuristicCost];
        }
    };

    let copyOfInicializedStates = [];
    for (let index = 0; index < curStates.length; index++) {
       copyOfInicializedStates.push(new State(N,  curStates[index].board));
    }

    
    while ( curNumOfAttempts < maxNumOfAttempts) {
        if (printCost) { console.log(`[${curNumOfAttempts}] Current cost: ${Math.max(...curStates.map(state  => state.totalHeuristicCost))}`);}
        for (let index = 0; index < curStates.length; index++) {

            // Copy current state and make the best move 
            newState = new State(N, curStates[index].board);
            newState.selectBestAndMakeMove();  
            
            // Check if we have a solution
            if (newState.totalHeuristicCost == 0) {
                document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
                console.log("Success. Used attempts: " + curNumOfAttempts);
                drawQueens1((copyOfInicializedStates[index]).board, N, (copyOfInicializedStates[index]).totalHeuristicCost);
                return [newState.board, newState.totalHeuristicCost];
            }
            
            // Accept the state only if we have better heuristic
            if (newState.totalHeuristicCost < curStates[index].totalHeuristicCost) {
                curStates[index] = newState;
            } 
        }
         ++curNumOfAttempts;
    };
    if (printCost) { console.log(`[${curNumOfAttempts}] Current cost: ${Math.max(...curStates.map(state  => state.totalHeuristicCost))}`);}


    // Find the closest state to the solutions (the one with miimum heuritic)
    let closestStateToSolutions = [[curStates[0], 0]];
    curStates.forEach(function (curState, index) {
        if (curState.totalHeuristicCost == 0) {
            document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
            console.log("Success. Used attempts: " + curNumOfAttempts);
            drawQueens1((copyOfInicializedStates[index]).board, N, (copyOfInicializedStates[index]).totalHeuristicCost);
            return [curState.board, curState.totalHeuristicCost]
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
    document.getElementById("info").innerHTML = '<span class="wrong">Not enough attempts</span>';
    console.log("Not enough attempts. Used attempts: " + curNumOfAttempts);

    drawQueens1((copyOfInicializedStates[closestStateToSolution[1]]).board, N, (copyOfInicializedStates[closestStateToSolution[1]]).totalHeuristicCost);
    return [closestStateToSolution[0].board, closestStateToSolution[0].totalHeuristicCost];
}





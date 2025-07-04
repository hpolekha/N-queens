//
// Steepest ascent hill climbing
//
function hillClimbing(N, maxNumOfAttempts, printCost = false){
    if (printCost) { console.log(`Hill climbing ${N}x${N}`);}

    let curNumOfAttempts = 0;

    // Generate new state and draw it
    let curState = new State(N);
    drawQueens1(curState.board, N, curState.totalHeuristicCost);

    // Check if we were lucky
    if (curState.totalHeuristicCost == 0) {
        document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
        console.log("Lucky Success. Used attempts: " + curNumOfAttempts);
        return [curState.board, curState.totalHeuristicCost];
    }

    if (printCost) {console.log(`[${curNumOfAttempts}] Current cost: ${curState.totalHeuristicCost}`);}

    while (curState.totalHeuristicCost != 0 && curNumOfAttempts < maxNumOfAttempts) {
        // Copy current state
        let newState = new State(N, curState.board);
        // Make move with best heuristic
        newState.selectBestAndMakeMove();
        // If heuristic value is not better - do not accept ew state
        if (newState.totalHeuristicCost < curState.totalHeuristicCost) {
            if (printCost) {console.log(`[${curNumOfAttempts+1}] Current cost: ${newState.totalHeuristicCost}`);}
            curState = newState;
        } else if (newState.totalHeuristicCost == curState.totalHeuristicCost) {
            // Reset if local minimum riched
            curState = new State(N); // reset
        }
        ++curNumOfAttempts;     
    }

    // Check if the solution has been found and update the information
    if (curState.totalHeuristicCost == 0) {
        document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
        console.log("Success. Used attempts: " + curNumOfAttempts);
    } else {
        document.getElementById("info").innerHTML = '<span class="wrong">Not enough attempts</span>';
        console.log("Not enough attempts. Used attempts: " + curNumOfAttempts);
    }

    return [curState.board, curState.totalHeuristicCost];
}






//
// Simulated Annealing
//
function simulatedAnnealing(N, maxNumOfAttempts, startingTemperature, coolingFactor){
    let curNumOfAttempts = 0;

    // Generate start state
    let curState = new State(N);
    drawQueens1(curState.board, N,curState.totalHeuristicCost);

    //Check if we were lucky
    if (curState.totalHeuristicCost == 0) {
        document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
        console.log("Lucky Success. Used attempts: " + curNumOfAttempts);
        return [curState.board, curState.totalHeuristicCost];
    }

    while (curState.totalHeuristicCost != 0 && curNumOfAttempts < maxNumOfAttempts) {
        // Copy current state and make random move
        let newState = new State(N, curState.board);
        newState.selectRandomAndMakeMove();

        // Accept the new move if itis better of with some probability
        if (newState.totalHeuristicCost < curState.totalHeuristicCost) {
            curState = newState;
        } else if (startingTemperature > 0 && Math.random() <  (Math.exp((-Math.abs(newState.totalHeuristicCost - curState.totalHeuristicCost))/startingTemperature ))) {
            curState = newState;
        } 
        startingTemperature = startingTemperature - coolingFactor;
        ++curNumOfAttempts;     
    }

    // Show result
    if (curState.totalHeuristicCost == 0) {
        document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
        console.log("Success. Used attempts: " + curNumOfAttempts);
    } else {
        document.getElementById("info").innerHTML = '<span class="wrong">Not enough attempts</span>';
        console.log("Not enough attempts. Used attempts: " + curNumOfAttempts);
    }
    return [curState.board, curState.totalHeuristicCost];
}




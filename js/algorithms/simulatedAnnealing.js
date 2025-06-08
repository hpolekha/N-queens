//
// Simulated Annealing
//
function simulatedAnnealing(N, maxNumOfAttempts, startingTemperature, coolingFactor, printCost = false){
    if (printCost) { console.log(`Simulated annealing ${N}x${N}`);}
    
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

    let temperature = startingTemperature;

    while (curState.totalHeuristicCost != 0 && curNumOfAttempts < maxNumOfAttempts) {
        if (printCost) {console.log(`[${curNumOfAttempts}] Current cost: ${curState.totalHeuristicCost}`);}

        // Copy current state and make random move
        let newState = new State(N, curState.board);
        newState.selectRandomAndMakeMove();

        // Accept the new move if itis better of with some probability
        if (newState.totalHeuristicCost < curState.totalHeuristicCost) {
            curState = newState;
        } else if (temperature > 0 && Math.random() <  (Math.exp((-Math.abs(newState.totalHeuristicCost - curState.totalHeuristicCost))/temperature ))) {
            curState = newState;
        } 
        temperature = temperature - coolingFactor;
        ++curNumOfAttempts;     
    }
    if (printCost) { console.log(`[${curNumOfAttempts}] Current cost: ${curState.totalHeuristicCost}`);}

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




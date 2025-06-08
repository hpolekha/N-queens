//
// Genetic agorithm
//
function geneticAlgorithms(N, maxNumOfAttempts, sizeOfGeneration, percentOfElitism, crossoverProbability, mutationProbability, nrOfGenerations, printCost = false) {
   
    if (printCost) { console.log(`Genetic ${N}x${N}`);}

    // Roulette Selection 
    let select = function (population) {
        let selectedChromosomes = [];
        let tmpIndex = 0;
        let iter = 0;
        let j = 0;
        // Max heuristic cost
        let MaxHC = N * (N - 1) / 2;

        while (true) {
            let sum = 0;
            let fitness = [];
            population.forEach(function (state) {
                fitness.push(MaxHC - state.totalHeuristicCost);
            });
            fitness.forEach(function (fitness) {
                sum = sum + fitness;
            });
            let randomNumber = Math.floor(Math.random() * sum);
            let tempSum = fitness[0];
            j = 0;
            while (tempSum < randomNumber) {
                j = j + 1;
                tempSum = tempSum + fitness[j];
            }
            selectedChromosomes.push(population[j]);
            iter++;
            if (iter >= 2) break;

            // No duplicate is allowed
            population.splice(j, 1);
            tmpIndex = j;
        }
        population.splice(tmpIndex, 0, selectedChromosomes[0]);
        return [selectedChromosomes[0], selectedChromosomes[1]];
    }

    // Two-point crossover
    let crossover = function (P1, P2) {
        let C1 = new State(N, P1.board);
        let C2 = new State(N, P2.board);
        if (C1.board.length != C2.board.length) return [];
        let numOfColumnsToExchange = Math.floor((Math.random() * (C2.board.length - 1))) + 1;
        let startColumn = Math.floor((Math.random() * (C2.board.length - numOfColumnsToExchange + 1)));
        for (let i = startColumn; i < numOfColumnsToExchange + startColumn; ++i) {
            let newC2Y = C1.getYPosOfQueen(i);
            let newC1Y = C2.getYPosOfQueen(i);
            C1.moveQueen(i, newC1Y);
            C2.moveQueen(i, newC2Y);
        }     
        return [C1, C2];
    }

    // Uniform mutation
    let mutate = function (C1, C2) {
        //Select random column and move Queen to the random place in this column 
        let MC1 = new State(N, C1.board);
        let MC2 = new State(N, C2.board);
        
        let mc1X1 = Math.floor(Math.random() * MC1.board.length);
        MC1.moveQueen(mc1X1,  Math.floor(Math.random() * MC1.board.length));

        let mc2X1 = Math.floor(Math.random() * MC2.board.length);
        MC2.moveQueen(mc2X1,  Math.floor(Math.random() * MC2.board.length));

        return [MC1, MC2];
    }


    let curNumOfAttempts = 0;
    let k = sizeOfGeneration;
    let pE = percentOfElitism;
    let pC = crossoverProbability;
    let pM = mutationProbability;
    let nrGen = nrOfGenerations;

    // Generate start population
    let curPopulation = [];
    for (let index = 0; index < k; index++) {
        let tmpState = new State(N);
        // Check if we were lucky
        if (tmpState.totalHeuristicCost == 0) {
            document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
            console.log("Lucky Success. Used attempts: " + curNumOfAttempts);
            drawQueens1(tmpState.board, N, tmpState.totalHeuristicCost);
            return [tmpState.board, tmpState.totalHeuristicCost];
        }
        curPopulation.push(tmpState);
    };
    drawQueens1(curPopulation[0].board, N, curPopulation[0].totalHeuristicCost);



    let MaxHC = N * (N - 1) / 2;
    let numberOfAllowedSameValues = 0.25 * maxNumOfAttempts;
    let lastBest = curPopulation[0].totalHeuristicCost;


    if (printCost) {console.log(`[${curNumOfAttempts}] Current best cost: ${Math.min(...curPopulation.map(s => s.totalHeuristicCost))}`);}

    while (curNumOfAttempts < maxNumOfAttempts) {

        // Sort population with respect to heuristic
        curPopulation.sort(function (A, B) {
            return A.totalHeuristicCost - B.totalHeuristicCost;
        });


        // Check if the solution was found
        if (curPopulation[0].totalHeuristicCost == 0) {
            document.getElementById("info").innerHTML = '<span class="correct">Success</span>';
            console.log("Success. Used attempts: " + curNumOfAttempts);
            return [curPopulation[0].board, curPopulation[0].totalHeuristicCost];
        }

        // New population 
        let newPopulation = [];

        // Elitism

        // if the better heuristic was obtained - clonning
        if(curPopulation[0].totalHeuristicCost != lastBest){
            numberOfAllowedSameValues = 0.25 * maxNumOfAttempts;
            lastBest = curPopulation[0].totalHeuristicCost;
            for (let i = 0; i < (pE * curPopulation.length); i++) {
                newPopulation.push(curPopulation[i]);
            }
        }else{
            // if the best heuristic is the same

            if(--numberOfAllowedSameValues < 0) {
                document.getElementById("info").innerHTML = '<span class="wrong">Local minimum riched</span>';
                console.log("Local minimum riched. Used attempts: " + curNumOfAttempts);
                return [curPopulation[0].board, curPopulation[0].totalHeuristicCost];
            }
            // if number of alloved Same values is not surpassed - clonning
            if (numberOfAllowedSameValues > 0.5 * 0.25 * maxNumOfAttempts) {
                for (let i = 0; i < (pE * 0.25 * curPopulation.length); i++) {
                    newPopulation.push(curPopulation[i]);
                }
            } 
            // Otherwise the elitism part is missed
           
        }

        // Create new population
        while (newPopulation.length != k) {
            // Selection
            let parents = select(curPopulation);

            // Crossover
            let children = parents;
            if (Math.random() < pC) {
                children = crossover(parents[0], parents[1]);
            }
            // Mutation
            let mutatedChildren = children;
            if (Math.random() < pM) {
                mutatedChildren = mutate(children[0], children[1]);
            }

            // Do not accept bad children
            if (mutatedChildren[0].totalHeuristicCost < MaxHC*0.4)
                newPopulation.push(mutatedChildren[0]);
            if (newPopulation.length == k) { break; }
            if (mutatedChildren[1].totalHeuristicCost < MaxHC*0.4)
                newPopulation.push(mutatedChildren[1]);

        }
        if (printCost) {
            let curMin = Math.min(...newPopulation.map(s => s.totalHeuristicCost));
            if (curMin < curPopulation[0].totalHeuristicCost) console.log(`[${curNumOfAttempts+1}] Current best cost: ${curMin}`);
        }
        curPopulation = newPopulation;
        ++curNumOfAttempts;
    }

    // Return the best one
    curPopulation.sort(function (A, B) {
        return A.totalHeuristicCost - B.totalHeuristicCost;
    });

    document.getElementById("info").innerHTML = '<span class="wrong">Not enough attempts</span>';
    console.log("Not enough attempts. Used attempts: " + curNumOfAttempts);

    return [curPopulation[0].board, curPopulation[0].totalHeuristicCost];

}


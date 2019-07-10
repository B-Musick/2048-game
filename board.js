class Board {
    constructor(grid){
        if(Number.isInteger(grid)){
            // Create 2D array of equal dimension (gridSize) and place 0 within
            this.grid = [...Array(gridSize)].map(space => Array(gridSize).fill(0));
        }else{
            // Otherwise its a predifined array
            this.grid = grid;
        }
        
        // Used to control the board directions
        const UP = 'i';
        const DOWN = 'k';
        const LEFT = 'j';
        const RIGHT = 'l';
    }
    
    static changeLine(arr){
        // Shift single line according to game rule

        // Remove all zeroes
        let noZeroArr = arr.filter((val) => val!==0);

        // Combine any adjacent values according to the rules
        let alreadyCombined = false;
        for(let i = 1; i< noZeroArr.length;i++){
            let currVal = i; // hold the current i value
            if ((noZeroArr[i] === noZeroArr[currVal - 1]) && currVal-1 !== alreadyCombined){
                noZeroArr[currVal - 1] += parseInt(noZeroArr.splice(i,1)); // Splice value and add to adjacent
                alreadyCombined = currVal-1; // Holds the combined value so dont combine again this turn
                i--; // Since combined a value, backtrack
            }
        }

        // Add the zeroes back to the array 
        for(let i = noZeroArr.length; i<arr.length;i++){
            // Add zeroes to the rest of the array
            noZeroArr.push(0);
        }
        console.log(noZeroArr);
    }
    
    // Public method to print the board
    printBoard() {
        // This will print the board
        let grid = [...this.grid];
        let board = ""; // This will hold the board to be printed
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                j != grid.length - 1 ?
                    // If not at the end of the row, then check if contains 0 or not
                    grid[i][j] === 0 ? board += '-\t' : board += `${grid[i][j]}\t` :
                    // If at the end of the row then need newline, then check if contains 0 or not
                    grid[i][j] === 0 ? board += '-\n' : board += `${grid[i][j]}\n`;
            }
        }
        console.log(board);
    }

    extractLine(i, vertical, reverse){
    // i is the column/row number
    // Vertical is a boolean whether vertical line or not
    // Reverse determines if line should be reversed
    
    // Return newly created array
        // let grid = this.grid;
        let line = []; // This will hold the line to return

        // Extract the line
        // Verticle = true return column i, false return row i (grid[i])
        !vertical ? line = this.grid.splice(i,1)[0] : this.grid.forEach((row) => {line.push(row.splice(i,1)[0])});

        // Reverse the line if needed
        // Reverse false return line normal, true then reverse it
        reverse ? line = line.reverse() : line;

        return line;
    }

    insertLine(line, i, vertical, reverse){
        // Works like extractLine but in reverse

        // If line was reversed then re-reverse it
        reverse ? line.reverse():line;

        if(vertical){
            let idxCount = 0; // Used to count the index for the column values to insert from line array
            this.grid.forEach((row) => {
                // Insert the column values into each (row) at the respective 'i'
                row.splice(i, 0, line[idxCount]);
                idxCount++;
            });
            
            
        }else{
            this.grid.splice(i,0,line);
        }

    }

    shift(direction){
        // This should return a new board object in the shifted form in direction
        // The existing board shouldnt be
        let thisBoard = new Board([...this.grid]); // Make deep copy of board
        


    }

}






// // Test 1
// Board.changeLine([0, 2, 0, 0, 8, 0, 4]); // [ 2, 8, 4, 0, 0, 0, 0 ]
// console.log(Board.changeLine([0, 2, 0, 0, 8, 0, 4])); // true

// // Test 2 - Should combine adjacent values
// Board.changeLine([2, 0, 2, 4, 0, 0, 4]); // 2,0,4,2,0,0,4
// console.log(Board.changeLine([2, 0, 2, 4, 0, 0, 4])); // true
// Board.changeLine([2, 0, 4, 2, 0, 0, 4]); //[ 2, 4, 2, 4, 0, 0, 0 ]
// console.log(Board.changeLine([2, 0, 4, 2, 0, 0, 4])); // true

// // Test 3 - Shouldnt combine at same spot if already been combined
// Board.changeLine([2, 0, 2, 4, 0, 8]); //[ 4, 4, 8, 0, 0, 0 ]

// Test 4 - board should print
let board = new Board([[1,2,3],[4,5,6],[7,8,9]]);
board.printBoard();
Board.changeLine([8, 8, 0, 0, 0, 0]);
board.extractLine(2,true,true);
board.printBoard();
board.insertLine([13,14,15],2,true,true);
board.printBoard();
/********************THINGS LEARNED ************************************ */
/* 
 * Create class method with keyword 'static' before function name 
*/
class Board {
    constructor(grid){
        if(Number.isInteger(grid)){
            // Create 2D array of equal dimension (gridSize) and place 0 within
            this.grid = [...Array(gridSize)].map(space => Array(gridSize).fill(0));
        }else{
            // Otherwise its a predifined array
            this.grid = grid;
        }
 
        const UP = 'i';
        const DOWN = 'k';
        const LEFT = 'j';
        const RIGHT = 'l';
    }
    
    static changeLine(arr){
        // Shift single line according to game rule
        let arrCopy = [...arr] // Make deep copy of array
        let alreadyCombined = -1; // This will hold where the last adjacent values were defined
        // 1. Number tiles should shift left as far as possible
        for(let i = 0; i<arrCopy.length; i++){
            if ((arrCopy[i] !== 0 && arrCopy[i - 1] === 0 )|| arrCopy[i] === arrCopy[i - 1]){
                // If the current value is 0 and it can be moved left (since 0 before it)
                // Or if there are no 0 before but the values next to eachother are the same
                let count = i; // Store current i value
                let movedVal = arrCopy[i]; // Store value to be moved
                while(arrCopy[count-1]===0){
                    // While the value can be moved left (since 0)
                    count-=1;
                }
                if ((movedVal === arrCopy[count - 1]) && count-1 !== alreadyCombined){
                    // 2. If the value just moved matches the one beside it, combine them
                    // Cant combine them once a value has already been combined once this turn
                    arrCopy[count-1]+=movedVal;
                    alreadyCombined = count-1; 
                }else{
                    // Place value moved at left most spot, if doesnt match the one beside it
                    arrCopy[count] = movedVal; 
                }
                arrCopy[i] = 0; // Set the spot where value moved from to 0

            }
        }
        console.log(arrCopy);
        return arr !== arrCopy;
    }

    get board(){
        // This will print the board
        let grid = this.grid;
        let board = ""; // This will hold the board to be printed
        for(let i = 0; i<grid.length;i++){
            for(let j = 0; j < grid.length;j++){
                if(j!=grid.length-1){
                    // If not at the end of the row
                    grid[i][j] === 0 ? board += '-\t':board += `${grid[i][j]}\t`; 
                }else{
                    // If at the end of the row then need newline
                    grid[i][j] === 0 ? board += '-\n' : board += `${grid[i][j]}\n`;
                }
            }
        }
        console.log(board);
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
let board = new Board([[2,3,0,0],[0,3,4,0],[5,0,5,0],[3,2,3,0]]);
board.board;
/********************THINGS LEARNED ************************************ */
/* 
 * Create class method with keyword 'static' before function name 
*/
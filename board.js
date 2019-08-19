class Board {
    constructor(grid){
        if(Number.isInteger(grid)){
            // Create 2D array of equal dimension (gridSize) and place 0 within
            this.grid = [...Array(gridSize)].map(space => Array(gridSize).fill(0));
        }else{
            // Otherwise its a predifined array
            this.grid = grid;
        }
        this.printedBoard = false; // Used to set the elements only needed once
        // Hold score
        this.score = 0;
        // Display the score
        this.screenBody = d3.select('body');
        this.boardScoreContainer = d3.select('#board-score-container')
        this.scoresControlsContainer = d3.select('.score-controls-container');
        // Select the svg board
        this.boardDisplay = d3.select('svg').attr('id','board-display');

        // Board Dimensions
        this.blockWidth = (this.boardDisplay.attr('width'))/this.grid.length; // Width of individual blocks

        // Used to control the board directions
        this.UP = 'i';
        this.DOWN = 'k';
        this.LEFT = 'j';
        this.RIGHT = 'l';

        // Use to set block color in setTile() based on block value
        this.color = {
            '2': '#9cf0d4',
            '4': '#78f0c8',
            '8': '#47e6b1',
            '16': '#09e3e3',
            '32': '#09b7e3',
            '64': '#d967eb',
            '128': '#c421de',
            '256': '#e35bb1',
            '512': '#db2799',
            '1024': '#db2760',
            '2048': '#db272d',

        }

    }
    get boardGrid(){
        return this.grid; // Used in gameOver() 
    }
    
    static changeLine(arr){
        // Shift single line according to game rule
        // 0 will represent empty space

        // Remove all zeroes
        let noZeroArr = arr.filter((val) => val!==0);
        let score=0;
        // Combine any adjacent values according to the rules
        let alreadyCombined = false;
        for(let i = 1; i< noZeroArr.length;i++){
            // Start at 1 so dont check undefined values
            let currVal = i; // hold the current i value
            if ((noZeroArr[i] === noZeroArr[currVal - 1]) && currVal-1 !== alreadyCombined){
                // If an value matches the one before it, and the index prior hasnt already been combined, then combine them
                let numToCombine = parseInt(noZeroArr.splice(i, 1));
                score = (noZeroArr[currVal - 1] + numToCombine);
                noZeroArr[currVal - 1] += numToCombine; // Splice value and add to adjacent
                alreadyCombined = currVal-1; // Holds the combined value so dont combine again this turn
                i--; // Since combined a value, backtrack
                
            }
        }

        // Add the zeroes back to the array 
        for(let i = noZeroArr.length; i<arr.length;i++){
            // Add zeroes to the rest of the array
            noZeroArr.push(0);
        }
        // Return boolean whether array changed or not
        
        return [noZeroArr,score];
        
    }
    
    // Public method to print the board
    printBoard() {
        // This will print the board
        let grid = [...this.grid];
        
        // Loop through the values in the grid and set the tiles appropriately
        // Pass in the values to set its color in setTile()
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {          
                if(grid[i][j] === 0){
                    // If grid tile === 0
                    this.setTile(this.boardDisplay, this.blockWidth, i, j, true,this.grid,grid[i][j]);
                }else{
                    // If doesnt equal 0 then place value in rect
                    this.setTile(this.boardDisplay, this.blockWidth, i, j, false,this.grid,grid[i][j]);
                }           
            }
        }
        if(!this.printedBoard){
            // Displays the elements only needed to be set once (SCORE BANNER)
            this.scoresControlsContainer.append('div').attr('id', 'score-banner');
            d3.select('#score-banner').append('h3').text('SCORE');
            d3.select('#score-banner').append('p').attr('id','score-value'); // Shows score, changed in printBoard()
            this.printedBoard = true; // Prevent this if block from being printed again (unless new game)
        }
        // Change the score display to the current score
        d3.select('#score-value').text(this.score+"")



    }

    setTile(board,blockWidth,i,j,zero,grid,value){
        // This will control the tiles in printBoard()
        // If value is zero (true or false)
        // board is the svg display
        // Use 'value' along with the color choosing object to set block color
        board.append('rect')
            .attr('width', blockWidth)
            .attr('height', blockWidth)
            .attr('x', blockWidth * j)
            .attr('y', blockWidth * i)
            // If zero then red tile, else set to color object value
            .style('fill', zero ? '#d98b8b':this.color[value]) 
            .style('stroke', 'black')
            .style('stroke-width', 5)

        board.append('text')
            .text(zero ? '' :grid[i][j] + "") // If zero put blank '', else put the value
            // Need to subtract (2 + (value.toString().length*4) so in the center of block horizontally as number places increase
            .attr('x', (this.blockWidth / 2 + (this.blockWidth * j)) - (2 + (value.toString().length*4)))
            // Need to add 3 so in center of block vertically
            .attr('y', (this.blockWidth / 2 + (this.blockWidth * i)) + 3)
            .style('fill', 'black')
            .style('text-align', 'center');
        console.log()
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
            // Can just insert the line array since rows are [[row],[row]]
            this.grid.splice(i,0,line);
        }

    }

    shift(direction){
        // This should return a new board object in the shifted form in direction
        // The existing board shouldnt be
        
        let thisBoard = this.grid;
        let prevBoard = JSON.parse(JSON.stringify(this.grid)); // Make deep copy of board

        // the line extracted is a row not a column
        if(direction === this.LEFT){   
            // If direction is left, then the rows dont need to be reversed
            this.boardShift(thisBoard,false,false);
        } else if (direction === this.RIGHT){
            // If direction is right, row needs to be reversed to do the combining
            this.boardShift(thisBoard, true, false);
        }
    
        else if (direction === this.UP) {
            // If direction is up, then the columns dont need to be reversed
            this.boardShift(thisBoard, false, true);


        } else if(direction === this.DOWN) {
            // If direction is down, column needs to be reversed to do the combining
            this.boardShift(thisBoard, true, true);
        }
        // console.log(thisBoard);
        // console.log(prevBoard);
        if(!(this.checkValid(prevBoard,thisBoard))){
            // If the previous array and current one are different, add tile
            this.newTile();
        };
        
    }

    checkValid(prevBoard, newBoard){
        // Checks if the board actually changed, then it will add the newTile
        // Dont want to add a tile if nothing changed
        let same = true;
        prevBoard.forEach((array,i)=>{
            array.forEach((val,j)=>{
                if(val!==newBoard[i][j]){
                    same = false;
                }
            })
            
            
        })
        ;
        return same;

    }

    changeScore(value){
        // Add the score provided by second value from array returned from changeLine()

        this.score+=value;

        console.log(this.score);
    }

    boardShift(thisBoard, reverse, vertical){
        // Used in shift() to actually shift the board
        thisBoard.forEach((val, i) => {
            let line = this.extractLine(i, vertical, reverse); // Returns extracted line
            line = Board.changeLine(line); // Change the lines according to game rules
            this.changeScore(line[1]); // Takes score returned from changeLine() combining values and adds to total
            
            this.insertLine(line[0], i, vertical, reverse); // Insert the lines back into board
        });
    }
    

    emptySpaces(){
        // Creates array of empty space coordinates, used in newTile()
        let emptyCoord = []; // Holds array of [i,j] for the zeroes
        // Find the coordinates of the emptySpaces, to be used by newTile()
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid.length; j++) {
                if (this.grid[i][j] === 0) {
                    // Pass coordinate of 0 place to the array
                    emptyCoord.push([i,j])
                } 
            }
        }
        return emptyCoord;
    }

    newTile(){
        let emptySpaces = this.emptySpaces();  // Get empty space coordinates
        let emptySpacesLength = emptySpaces.length; // Get amount of empty spaces
        let randomIndex = Math.floor(Math.random()*emptySpacesLength); // Get randomIndex val
        let coord = emptySpaces[randomIndex]; // Get random coordinates from array
        this.grid[coord[0]][coord[1]]=this.randomValue(); // Set the new empty space to a value
    }

    randomValue(){
        // Returns four 20% of the time and 2 80%
        // Used in newTile() to set the value of the new tile to 2 or 4
        let tileArray = [2,2,4,2,2,4,2,2,4,2];
        let randomIndex = Math.floor(Math.random()*tileArray.length);
        return tileArray[randomIndex];
    }

    gameOver(){
        // Occurs if the prevBoard is the same as the current and no other moves can be made
        let directionArray = ['i','j','k','l']; // Directions to be tested
        
        return directionArray.every(direction=>{
            // For every direction, if no change occurs then game over (.every() returns true)
            let testBoard = new Board(JSON.parse(JSON.stringify(this.grid))); // Deep copy
            testBoard.shift(direction); // Produce the shift on test board
            return this.checkValid(testBoard.boardGrid,this.grid);
        })
        
    }
}



let playGame=(arr)=>{
    let board = new Board(arr);
    board.printBoard();

    
    document.addEventListener('keydown',move=(e)=>{
        // Shift the board when the matching keycode pressed
        if (!board.gameOver()) {
            board.shift((String.fromCharCode(e.keyCode)).toLowerCase());
            board.printBoard();  
        }else{
            // If the game is over, print to screen and remove keylistener for keydown
            d3.select('body').append('h1')
                .attr('id','game-over')
                .text('GAME OVER!')
                .style('color', 'black')
                .style('text-align', 'center');
            board.printBoard();
            document.removeEventListener('keydown',move);
            console.log('Game Over!');
        }
    });

}

// Start game

playGame([[2, 2, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]);




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
// let board = new Board([[2,2,0],[0,2,0],[2,0,2]]);

// board.printBoard();
// // board.changeLine([8, 8, 0, 0, 0, 0]);
// // board.extractLine(2,true,true);
// // board.printBoard();
// // board.insertLine([13,14,15],2,true,true);
// board.printBoard();
// board.shift('k');
// board.printBoard();
// board.shift('j');
// board.printBoard();

/********************THINGS LEARNED ************************************ */
/* 
 * Create class method with keyword 'static' before function name 
*/
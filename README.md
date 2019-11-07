Idea from Assignment (from John Bates) in University Computer Science Course which was run in the terminal and in Java. I refactored it to be animated with D3. Code inside methods wholly my own and refactored for Javascript.

THINGS LEARNED
- 'static' will make a class method
- Normal methods made can be accessed through instances of the object
- arr.splice(index, how many values) will return an array with the removed values (which is why in extractLine there is [0] at the end of the splice to only add the value removed not in an array). It will also leave the original array with the values removed.
- To make a deep copy, need to use --> JSON.parse(JSON.stringify(arr))
- Remove an event listener from within the same method, you have to give the callback a name

        document.addEventListener('keydown',move=(e)=>{
            // Shift the board when the matching keycode pressed
            if (!board.gameOver()) {
                board.shift((String.fromCharCode(e.keyCode)).toLowerCase());
                board.printBoard();  
            }else{

                board.boardDisplay.append('h1')
                    .text('Game Over!')
                    .style('color', 'black')
                    .style('fill', 'black')

                    .style('text-align', 'center');
                board.printBoard();
                document.removeEventListener('keydown',move);
                console.log('Game Over!')
            }
        });
<!-- https://stackoverflow.com/questions/4402287/javascript-remove-event-listener -->

CSS
- To overlay a value (GAME OVER), use z-index and position: absolute, then use top/left/right/bottom to place it on the screen
SVG
- For adding text to say a rect, dont append it to the rect, append it to the actual display (see printBoard()

EVENTS
   
 document.addEventListener('keydown',(e)=>{
        // Shift the board when the matching keycode pressed
        board.shift((String.fromCharCode(e.keyCode)).toLowerCase());
        board.printBoard();
    })
    

NODE APP
- Need to install d3 and require in app.js
<!-- https://stackoverflow.com/questions/9948350/how-to-use-d3-in-node-js-properly -->
- When loading D3 to Node app, you need to make sure to put the JS and CSS file in the /public folder then change the associated root
<!-- Robert Macneils answer
https://teamtreehouse.com/community/cant-get-the-css-to-load-in-the-nodejs-server -->
  const bodyParser = require('body-parser');

  //body parser middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(express.static(path.join(__dirname, 'public')));

- Also need the absolute path to the index.html file (__dirname), need to use npm path as well to join '..' to allow access when in 'routes'. __dirname will refer to the path to the current folder your in, so if in 'routes' and need to be in 'views', then need to go back a folder
<!-- https://stackoverflow.com/questions/18088034/how-to-go-up-using-dirname-in-the-folder-hierarchy/18088133 -->
- Need to res.sendFile() as well and not render 

router.get('/2048',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views/projects/2048/index.html'))
})


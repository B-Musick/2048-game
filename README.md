Copyright @ John Bate, University of Manitoba
Assignment from Comp 1020 (Java)
Methods and uses outlined
Code inside said methods wholly my own and refactored for Javascript

THINGS LEARNED
- 'static' will make a class method
- Normal methods made can be accessed through instances of the object
- arr.splice(index, how many values) will return an array with the removed values (which is why in extractLine there is [0] at the end of the splice to only add the value removed not in an array). It will also leave the original array with the values removed.
- To make a deep copy, need to use --> JSON.parse(JSON.stringify(arr))

SVG
- For adding text to say a rect, dont append it to the rect, append it to the actual display (see printBoard()

EVENTS
<!--    
 document.addEventListener('keydown',(e)=>{
        // Shift the board when the matching keycode pressed
        board.shift((String.fromCharCode(e.keyCode)).toLowerCase());
        board.printBoard();
    })
     -->
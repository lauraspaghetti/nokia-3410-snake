console.log('script snake'); 

// event DOMContentLoaded : https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener('DOMContentLoaded', () => {
    ///HTML Elements
    //Targeting
    const squares              = document.querySelectorAll('.grid div'); 
    const scoreDisplay         = document.querySelector('span'); 
    const startBtn             = document.querySelector('.start'); 
    //Defining the game's width
    const width                = 10; 
    //Initializing the positions 
    let currentIndex           = 0; // is now on the first div in our grid
    let appleIndex             = 0; // is now on the first div in our grid too
    //Defining the snake
    let currentSnake           = [2, 1, 0]; //all divs with a values of 2 will be the head, all 0's the end and all 1's the body
    let direction              = 1; 
    let score                  = 0; 
    let speed                  = 0.9; 
    let intervalTime           = 0; 
    let interval               = 0; 

    ///Functions 
    //to start and restart the game 
    function startGame(){
        // console.log('startGame() is on'); 
        ///first we need to reset everything, each index into the array has to be taken into consideration
        //the class snake is removed from all the squares at the start of the function
        currentSnake.forEach(index => squares[index].classList.remove('snake')); 
        //same for the apple
        squares[appleIndex].classList.remove('apple');
        clearInterval(interval); 
        score                  = 0; 
        ///Then we set all the settings we want to happen at the start of the game 
        randomApple()
        direction              = 1; 
        scoreDisplay.innerText = score; 
        intervalTime           = 1000; 
        currentSnake           = [2, 1, 0]; 
        currentIndex           = 0; 
        currentSnake.forEach(index => squares[index].classList.add('snake')); 
        interval               = setInterval(moveOutComes, intervalTime); //moveOutComes will deal with all the user's decisions to move the snake
        document.getElementById("game-over").innerHTML = " "; 
    }; 

    //to deal with all the move outcomes of the snake
    function moveOutComes(){
        //dealing with snake hitting border or snake hitting self
        if(
            (currentSnake[0] + width >= (width*width) && direction === width) || //if snake hits bottom
            // % : "Remainder (...) Returns the integer remainder of dividing the two operands." from : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
            (currentSnake[0] % width === width-1 && direction === 1) || //if snakes hits right wall
            (currentSnake[0] % width === 0 && direction === -1)      || //if the snake hits left wall
            (currentSnake[0] - width < 0 && direction === -width)    || //if the snake hits the top
            squares[currentSnake[0] + direction].classList.contains('snake') //if the snake goes into itself
        ){
            document.getElementById("game-over").innerHTML = "game over"; 
            return clearInterval(interval);
        }; 
        // array.pop : "removes the last element from an array and returns that element" from : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop
        const tail = currentSnake.pop(); //removes last item of the array snake and shows it
        squares[tail].classList.remove('snake'); //removes class name from the tail
        //array.unshift : "adds one or more elements to the beginning of an array and returns the new length of the array" from : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
        currentSnake.unshift(currentSnake[0] + direction); //gives direction to the head of the array

        //dealing with snake getting apple
        //"if the snakes goes into an apple" 
        if(squares[currentSnake[0]].classList.contains('apple')){
            //"this apple is removed from the grid"
            squares[currentSnake[0]].classList.remove('apple'); 
            //we add a tail to the snake making it appear it grew longer
            squares[tail].classList.add('snake'); 
            currentSnake.push(tail); 
            //then another apple spawn randomly on the grid
            randomApple()
            //and we add one to the score, we display it and clear th interval time
            score++; 
            scoreDisplay.textContent    = score; 
            clearInterval(interval); 
            //we create a new interval time with the speed, this will decrease the interval time each time this is updated
            intervalTime                = intervalTime * speed; 
            //the interval is then reseted
            interval                    = setInterval(moveOutComes, intervalTime); 
        }
        
        squares[currentSnake[0]].classList.add('snake'); 

    };

    //generate new apple once apple is eaten 

    function randomApple(){

        do{
            //an apple car spawn anywhere on the grid as the number generated by math.random is based on the length of the grid
            //math.floor : "returns the largest integer less than or equal to a given number" from : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
            appleIndex= Math.floor(Math.random() * squares.length);
        }while (squares[appleIndex].classList.contains('snake'));//but the apple musn't appear in a div currently containing the snake, so an apple can't spawn on the snake
        squares[appleIndex].classList.add('apple'); 
    };

    //assign functions to keycodes 
    function control(e){
        //removing the class snake to the squares between each move
        squares[currentIndex].classList.remove('snake'); 
        // event.keyCode : https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        //"if the key pressed is right arrow"
        if(e.key === "ArrowRight"){
            direction = 1;//the snake will go right on
            // console.log(e.key); 
        }
        else if(e.key === "ArrowUp"){ //"or if the key pressed is up arrow"
            direction = -width //the snake will go back 10 divs, appearing to go up
            // console.log(e.key); 
        }
        else if(e.key === "ArrowLeft"){ //"or if the key pressed is left arrow"
            direction = -1; //the snake will go left one div
            // console.log(e.key); 
        }
        else if(e.key === "ArrowDown"){ //"or if the key pressed is down arrow"
            direction = +width;//the snake's head will appear in the div ten divs back from its current position 
            // console.log(e.key); 
        } 
    }; 
    //then we use the event keyup to execute the function control, so everytime a key is released the event will run the function 
    document.addEventListener("keyup", control); 
    startBtn.addEventListener("click", startGame); 

}); 

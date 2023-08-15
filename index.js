//variables and constants
let direction= {x:0,y:0};
const foodSound=new Audio("css/assets/food.mp3");
const gameoverSound=new Audio("css/assets/gameover.mp3");
const moveSound=new Audio("css/assets/move.mp3");
const bgMusic=new Audio("css/assets/music.mp3");
let hasGrown = false;
let speed=7;
let lastPaint=0;
let score=0;
let snakeArr=[
    {x:10,y:13} 
];
let food={x:5,y:7};
board=document.querySelector(".board");

//game functions
function main(ctime){
    window.requestAnimationFrame(main);
    
    if(((ctime-lastPaint)/1000)<1/speed){
        return;
    }
        lastPaint=ctime;
        gameEngine();
}

function isCollide(snake){
 //snake bump into its own body
 for(let i=1;i<snake.length;i++)
 {
    if(snake[i].x===snake[0].x&&snake[i].y===snake[0].y){
        return true;
    }
 }
 if(snake[0].x>=20||snake[0].x<=0 || snake[0].y>=20 ||snake[0].y<=0 ){
    return true;
}
}

function gameEngine(){
    //Update the snake array and food

    if(isCollide(snakeArr)){
        bgMusic.pause();
        bgMusic.currentTime=0;
        gameoverSound.play();
        direction={x:0,y:0};
        alert("Game Over! Press any key to retart");
        snakeArr=[{x:10,y:13}];
        bgMusic.play();
        document.getElementById("score").textContent="Score : 0";
        hasGrown=false;
        score=0;
    }

    //if you have eaten the food then increment the snake and relocate the food
    if(snakeArr[0].x===food.x&&snakeArr[0].y===food.y){
        foodSound.play();
        score++;
        if(highScoreval<score){
            highScoreval=score;
            localStorage.setItem("highScore",JSON.stringify(highScoreval));
            document.getElementById("highScorebox").textContent="High-Score : "+highScoreval;
        }
        if (!hasGrown) {
            hasGrown = true;
        }
        document.getElementById("score").textContent="Score : "+score;
        snakeArr.unshift({x: snakeArr[0].x+direction.x, y: snakeArr[0].y+direction.y});
        //reloating the food
        let a=2;
        let b=18;
        let newFoodX, newFoodY;
        do {
            newFoodX = Math.round(a + (b - a) * Math.random());
            newFoodY = Math.round(a + (b - a) * Math.random());
        } while (snakeArr.some(segment => segment.x === newFoodX && segment.y === newFoodY)); //method is used to check if any element in the array satisfies a given condition. The condition is provided as a function, which is passed as an argument to the some() method.

        food = { x: newFoodX, y: newFoodY };
    }
    
    //moving the snake
    for(let i=snakeArr.length-2;i>=0;i--){
        snakeArr[i+1]={...snakeArr[i]};
    }
    snakeArr[0].x+=direction.x;
    snakeArr[0].y+=direction.y;

    //display snake
    board.innerHTML="";
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement("div");
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;
        
        if(index===0)
        {
            snakeElement.classList.add("head");
        }
        else{
            snakeElement.classList.add("snakeBody");
        }
        board.appendChild(snakeElement);
    })

    //display food 
        foodElement=document.createElement("div");
        foodElement.style.gridRowStart=food.y;
        foodElement.style.gridColumnStart=food.x;
        foodElement.classList.add("food");
        board.appendChild(foodElement);
    
}
//game logic
let highScore=localStorage.getItem("highScore");
let highScoreval=0;
if(highScore===null){
    highScoreval=0;
    localStorage.setItem("highScore",JSON.stringify(highScoreval));
}
else{
    highScoreval=JSON.parse(highScore);
    highScorebox.textContent="High-Score : "+highScore;
}

window.requestAnimationFrame(main);
window.addEventListener("keydown",(e)=>{
    bgMusic.play();
    moveSound.play();
    //start game
    let newDirection;
    switch (e.key) {
        case "w":
            newDirection = { x: 0, y: -1 };
            break;
        case "s":
            newDirection = { x: 0, y: 1 };
            break;
        case "a":
            newDirection = { x: -1, y: 0 };
            break;
        case "d":
            newDirection = { x: 1, y: 0 };
            break;
        default:
            return; // Do nothing if an invalid key is pressed
    }

    // Check if the new direction is valid (not opposite to the current direction)
    if (
        hasGrown &&
        ((newDirection.x !== 0 && newDirection.x !== -direction.x) ||
        (newDirection.y !== 0 && newDirection.y !== -direction.y))
    ) {
        direction = newDirection; // Update the direction if it's valid
    } else if (!hasGrown) {
        direction = newDirection; // Allow movement in any direction if the snake hasn't grown
    }
})
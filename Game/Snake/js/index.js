//Constants & Variables
let input_dir ={x:0,y:0};
const food_sound = new Audio('assets/music/food-eat.mp3');
const move_sound = new Audio('assets/music/arrow-move.mp3');
const bg_score = new Audio('assets/music/BG-score.mp3');
const gameover_sound = new Audio('assets/music/game-over.wav');
let last_print = 0;
let speed = 7;
let snake_array =[{x:10,y:10}];
let food_element ={x:5,y:7};
let score_count=0;
bg_score.volume = 0.1;
move_sound.volume = 0.3;

//Game Functions


function isCollide(snakearr){
    //if Hit yourself
    for (let i = 1; i < snake_array.length; i++) {
        if(snakearr[i].x === snakearr[0].x && snakearr[i].y === snakearr[0].y){
            return true;
        } 
    }

    //if Hit wall
    if(snakearr[0].x >20 || snakearr[0].x <1 || snakearr[0].y >20 || snakearr[0].y <1 ){
        return true;
    }
}



function main(ctime){
    window.requestAnimationFrame(main); // game loop by calling main repeatingly
    
    if((ctime-last_print)/1000 < 1/speed){  // controllling fps of Animation using difference between current-time and last_print_time
        return;
    }
    last_print=ctime; // upadting last_print_time
    game_engine();
}

function game_engine(){

    bg_score.play(); 

    //To update Snake and Food:-
    
    // When Snake hits the wall. Show gameover alert and reset the game
    if(isCollide(snake_array)){   
        gameover_sound.play();
        bg_score.pause();
        score_count=0;
        speed = 7;
        score.innerHTML= "<h2>Your<br>Score : "+score_count+"</h2>";
        alert("!!!---GAME OVER---!!!\nPress enter key or 'OK' to Play Again...\n:)");
        input_dir = {x:0,y:0};
        snake_array =[{x:10,y:10}];
        food_element ={x:5,y:7};
        bg_score.play();    
    }



     // to avoid backward movement of snake
     if(snake_array.length>1 &&(snake_array[0].x+input_dir.x === snake_array[1].x && snake_array[0].y+input_dir.y === snake_array[1].y)){ 
        if(input_dir.x === 1){input_dir.x = -1;}
        else if(input_dir.y === 1 )  {input_dir.y = -1;}
        else if(input_dir.x === -1 ) {input_dir.x = 1;}
        else if(input_dir.y === -1 ) {input_dir.y = 1;}
    }

    //Moving Snake:
    for (let i = snake_array.length-2; i >= 0; i--) {
        snake_array[i+1] = {...snake_array[i]};  
    }

    // moving head
    snake_array[0].x += input_dir.x;
    snake_array[0].y += input_dir.y;



    // When Food is eaten. Increase score and regenrate Food
    if(snake_array[0].y === food_element.y && snake_array[0].x === food_element.x){
        score_count+=1;

        if(high_score_val < score_count){ //if we break high-score
            high_score_val=score_count;
            localStorage.setItem("high_score",JSON.stringify(high_score_val));
            hi_score.innerHTML = "<h3>Your<br>Hi-Score : "+high_score_val+"</h3>";
        }

        score.innerHTML= "<h2>Your<br>Score : "+score_count+"</h2>";
        food_sound.play();
        snake_array.unshift({x:snake_array[0].x + input_dir.x, y:snake_array[0].y + input_dir.y}); // increasing snake by adding head in the direction it was moving
        let a=2;
        let b=18;
        // generating new food at random place
        food_element={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())}; 
        let foundx = snake_array.some(el => el.x === food_element.x && el.y === food_element.y );

        while(foundx){ // avoid appering of food in snake body
            food_element={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())};
            foundx = snake_array.some(el => el.x === food_element.x && el.y === food_element.y );
        }

        if(score_count%10 === 0){ /// increase speed after score got bigger than any multiple of 10
            speed *= 1.5;
        }
    }
    



    //To Display Snake and Food:-
        //Display Snake
    field.innerHTML="";  // clear the field befor displaying to aviod one inside other effect
    snake_array.forEach((ele,index)=>{
        snake_element=document.createElement('div');    // creating div for each part in snake body's array
        snake_element.style.gridRowStart = ele.y;       //locating style to row y in grid field
        snake_element.style.gridColumnStart = ele.x;    //locating style to column x in grid field 
        if(index===0){
            snake_element.classList.add('snake_head');      //applying css style to the snake head
        }
        else{
            snake_element.classList.add('snake_body');      //applying css style to the snake body
        }
        
        field.appendChild(snake_element);           //appending element to field for displaying
    })

    //Display Food
        
        food_particle=document.createElement('div');            // creating div for food
        food_particle.style.gridRowStart = food_element.y;       //locating style to row y in grid field for food
        food_particle.style.gridColumnStart = food_element.x;    //locating style to column x in grid field for food
        //Uncomment below part  to add food as image of apple
        //var img = document.createElement('img');
        //img.src ='assets/images/apple.png';
        //food_particle.appendChild(img);
        food_particle.classList.add('food');             //applying css style to the food particle
        field.appendChild(food_particle);                //appending element to field for displaying
}




// Main Logic of Game

let high_score = localStorage.getItem("high_score"); // functionality of Hi-score
if(high_score === null){
    high_score_val=0;
    localStorage.setItem("high_score",JSON.stringify(high_score_val))
}
else{
    high_score_val = JSON.parse(high_score);
    hi_score.innerHTML = "<h3>Your<br>Hi-Score : "+high_score+"</h3>";
}

window.requestAnimationFrame(main);
window.addEventListener('keydown' , e=>{
    input_dir={x:0, y:0};   //Pressed key to Start Game
    move_sound.play();
    switch (e.key) {     //Taking input from user and detriming the direction to move the snake
        case "ArrowUp":
            input_dir.x=0;
            input_dir.y=-1;
            break;
            
        case "ArrowDown":
            input_dir.x=0;
            input_dir.y=1;
            break;

        case "ArrowLeft":
            input_dir.x=-1;
            input_dir.y=0;
            break;
        
        case "ArrowRight":
            input_dir.x=1;
            input_dir.y=0;
            break;
    
        default:
            break;
    }
})
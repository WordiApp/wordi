import Word from "./word.js";

const timer = document.getElementById("timer")
const word_question = document.getElementById("word_question")

function correct(){
    // Add points
    console.log("Correct")
    new_question()
}

function incorrect(){
    console.log("Wrong")
    new_question()
}

let correct_choice

async function new_question(){
    let answer_word = await new Word().create_word()
    let correct_index = parseInt(Math.random()*4)
    word_question.textContent = answer_word[0]

    for(let i = 0; i < 4; i++){
        let choice = document.getElementById("choice-" + String(i + 1))
        choice.removeEventListener("click", correct)
        choice.removeEventListener("click", incorrect)

        if(i != correct_index){
            let word = await new Word().create_word()
            choice.innerHTML = String(word[1])
            choice.removeEventListener("click", incorrect)
            choice.addEventListener("click", incorrect)
        }
    }

    correct_choice = document.getElementById("choice-" + String(correct_index + 1))
    correct_choice.innerHTML = String(answer_word[1])
    correct_choice.addEventListener("click", correct)
}

function sleep(seconds) {
    return new Promise(function(resolve){
        setTimeout(resolve, seconds*1000)
    });
}

async function start_timer(length){
    let counter = length
    while (counter > 0){
        timer.textContent = Math.floor(counter*100)/100 + "s"
        await sleep(0.1)
        counter -= 0.1
    }
}

new_question()
//start_timer(10)
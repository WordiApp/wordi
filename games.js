import Word from "./word.js";

const timer = document.getElementById("timer")

async function new_question(){
    let answer_word = await new Word().create_word()

    console.log(answer_word[0] + " | " + answer_word[1])
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
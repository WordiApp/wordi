//----------------Database----------------//
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Word from "./word.js"
import notification from "./notification.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDft-OAjQovGmUmmcyowkcYgV0kEPBMrME",
    authDomain: "wordsearch-8ef82.firebaseapp.com",
    projectId: "wordsearch-8ef82",
    storageBucket: "wordsearch-8ef82.appspot.com",
    messagingSenderId: "483921968995",
    appId: "1:483921968995:web:040b330d0dd874fbfc9d56",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getDatabase()

const timer = document.getElementById("timer")
const start_button = document.getElementById("start_button")
const quiz_container = document.getElementById("quiz_container")
const game_container = document.getElementById("game_container")
const word_question = document.getElementById("word_question")
const results = document.getElementById("results")

let points = 0
let questions = 0

function correct(){
    points += 1
    questions += 1
    notification("Correct!", 5, "#00FF00")
    new_question()
}

function incorrect(){
    questions += 1
    notification("Incorrect...", 5, "#FF0000")
    new_question()
}

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

    let correct_choice = document.getElementById("choice-" + String(correct_index + 1))
    correct_choice.innerHTML = String(answer_word[1])
    correct_choice.addEventListener("click", correct)
}

function new_game(){
    points = 0
    questions = 0
    start_timer(10)
    new_question()
}

function sleep(seconds) {
    return new Promise(function(resolve){
        setTimeout(resolve, seconds*1000)
    });
}

async function start_timer(length){
    quiz_container.style.display = "Block"
    game_container.style.display = "None"
    let counter = length
    while (counter > 0){
        timer.textContent = Math.floor(counter*100)/100 + "s"
        await sleep(0.1)
        counter -= 0.1
    }
    quiz_container.style.display = "None"
    game_container.style.display = "Block"
    results.textContent = (points + "/" + questions)
}

start_button.addEventListener("click", function(){
    new_game()
})

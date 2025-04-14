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
let correct_answer = null
let can_answer = false

function sleep(seconds) {
    return new Promise(function(resolve){
        setTimeout(resolve, seconds*1000)
    });
}

function correct(){
    can_answer = false
    streak += 1
    points += 1
    questions += 1
    notification("Correct!", 5, "var(--success-green)")
    new_question()
}

function incorrect(){
    can_answer = false
    streak = 0
    questions += 1
    notification("Incorrect...", 5, "var(--error-red)")
    new_question()
}

async function new_question(){
    word_question.innerHTML = '<div id="spinner" class="spinner-border" role="status""></div>'
    for(let i = 0; i < 4; i++){
        let choice = document.getElementById("choice-" + String(i + 1))
        choice.textContent = "..."
    }
    let words = [await Word.New(), await Word.New(), await Word.New(), await Word.New()]
    let rand = parseInt(Math.random()*4)
    word_question.textContent = words[rand].get_word()
    correct_answer = words[rand].get_definitions()
    console.log(correct_answer)
    for(let i = 0; i < 4; i++){
        let choice = document.getElementById("choice-" + String(i + 1))
        choice.textContent = words[i].get_definitions()
    }
    can_answer = true
}

async function new_game(length){
    // Resets global variables
    points = 0
    questions = 0
    // Starts the question loop
    new_question()
    // Shows the quiz screen, hides the main screen
    quiz_container.style.display = "Block"
    game_container.style.display = "None"
    // Timer that lasts for <length> seconds
    await sleep(0.5)
    let counter = length
    while (counter > 0){
        timer.textContent = Math.floor(counter*100)/100 + "s"
        await sleep(0.1)
        counter -= 0.1
    }
    // Hides the quiz screen, goes back to main screen
    quiz_container.style.display = "None"
    game_container.style.display = "Flex"  
    // Gives the user their final result 
    results.textContent = "Your Previous Score: " + (points + "/" + questions)
    // Adds points to user's account and notifies them
    if(points > 0){
        get(ref(db, "userdata/" + auth.currentUser.uid + "/score")).then(function(snapshot){
            update(ref(db, "userdata/" + auth.currentUser.uid), {
                score: snapshot.val() + points
            }).then(function(){
                notification("You earned " + points + " points!", 5)
            }).catch(function(err){
                notification("Error: " + err, 5, "var(--error-red)")
            })
        })
    }
}

for(let i = 0; i < 4; i++){
    let choice = document.getElementById("choice-" + String(i + 1))
    choice.addEventListener("click", function(){
        if(can_answer){
            console.log(choice.textContent)
            if(choice.textContent == correct_answer){
                correct()
            } else {
                incorrect()
            }
        }
    })
}

start_button.addEventListener("click", function(){
    new_game(30)
})
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
//----------------Variables----------------//
let points = 0
let questions = 0
let correct_answer = null
let can_answer = false

const quizContainer = document.getElementById("quiz-container")
const startContainer = document.getElementById("start-container")
const startButton = document.getElementById("start-button")
const wordQuestion = document.getElementById("word-question")
const timer = document.getElementById("timer")
const results = document.getElementById("results")
//----------------Functions----------------//
function sleep(seconds) {
    return new Promise(function(resolve){
        setTimeout(resolve, seconds*1000)
    });
}

function correct(){
    can_answer = false
    points += 1
    questions += 1
    notification("Correct!", 5, "var(--success-green)")
    new_question()
}

function incorrect(){
    can_answer = false
    questions += 1
    notification("Incorrect...", 5, "var(--error-red)")
    new_question()
}

async function new_question(){
    // Shows spinner
    wordQuestion.innerHTML = '<div id="spinner" class="spinner-border" role="status""></div>'
    // Makes all choices load
    for(let i = 0; i < 4; i++){
        let choice = document.getElementById("choice-" + String(i + 1))
        choice.textContent = "..."
    }
    // Generates 4 random words
    let words = [await Word.New(), await Word.New(), await Word.New(), await Word.New()]
    // Picks a random word to be correct
    let rand = parseInt(Math.random()*4)
    wordQuestion.textContent = words[rand].get_word()
    correct_answer = words[rand].get_definitions()
    // Shows all the definitions
    for(let i = 0; i < 4; i++){
        let choice = document.getElementById("choice-" + String(i + 1))
        choice.textContent = words[i].get_definitions()
    }
    // Allows the user to answer
    can_answer = true
}

async function new_game(length){
    // Resets global variables
    points = 0
    questions = 0
    // Starts the question loop
    new_question()
    // Shows the quiz screen, hides the main screen
    quizContainer.style.display = "flex"
    startContainer.style.display = "none"
    // Timer that lasts for <length> seconds
    await sleep(0.25)
    let counter = length
    while (counter > 0){
        timer.textContent = Math.floor(counter*100)/100 + "s"
        await sleep(0.1)
        counter -= 0.1
    }
    // Hides the quiz screen, goes back to main screen
    quizContainer.style.display = "none"
    startContainer.style.display = "flex"  
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
//----------------Game Loop----------------//
for(let i = 0; i < 4; i++){
    let choice = document.getElementById("choice-" + String(i + 1))
    choice.addEventListener("click", function(){
        if(can_answer){
            if(choice.textContent == correct_answer){
                correct()
            } else {
                incorrect()
            }
        }
    })
}

startButton.addEventListener("click", function(){
    new_game(30)
})
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

let currentLink = []
let lengthRequrirement = 3
let strikes = 3

const link = document.getElementById("link")
const requiredLength = document.getElementById("requiredLength")
const strikesDisplay = document.getElementById("strikes")
const results = document.getElementById("results")
const linkLength = document.getElementById("linkLength")
const input = document.getElementById("word_input")
const submit = document.getElementById("submit_button")
const game_container = document.getElementById("game_container")
const link_container = document.getElementById("link_container")
const start_button = document.getElementById("start_button")

const rules = [
    {
        check: (wordObj) => wordObj.get_definitions() != null,
        error: "Can't link; this word does not exist."
    },
    {
        check: (wordObj) => wordObj.get_word()[0] == getLinkingLetter(),
        error: "Can't link; word must start with the last letter of the previous word."
    },
    {
        check: (wordObj) => wordObj.get_word().length >= lengthRequrirement,
        error: "Can't link; your word is too short."
    },
    {
        check: (wordObj) => currentLink.indexOf(wordObj.get_word()) == -1,
        error: "Can't link; no repeats allowed."
    }
]

function getLinkingLetter(){
    const previous_word = currentLink[currentLink.length-1]
    return previous_word[previous_word.length-1]
}

function addLink(word){
    currentLink.push(word)
    linkLength.textContent = "Link Length: " + currentLink.length
    renderNewLink(word)
    lengthRequrirement = Math.max(parseInt(Math.random()*7), 3)
    requiredLength.innerHTML = "Your next word must be at least <i>" + lengthRequrirement + "</i> characters long"
    link.scrollTop = link.scrollHeight
    input.value = ""
}

function renderNewLink(word){
    const wordDiv = document.createElement("div")
    wordDiv.textContent = word.toUpperCase()
    link.appendChild(wordDiv)
    const arrow = document.createElement("i")
    arrow.classList.add("bi")
    arrow.classList.add("bi-arrow-down")
    link.appendChild(arrow)
}

async function newLink(){
    currentLink = []
    strikes = 3
    strikesDisplay.innerHTML = "Strikes Remaining: <i>" + "X ".repeat(strikes).trim() + "</i>"
    const startingWord = (await Word.New()).get_word().toLowerCase()
    addLink(startingWord)
}

submit.addEventListener("click", async function(){
    if(input.value == ""){return}
    const wordObj = await Word.New(input.value.toLowerCase())
    for(const {check, error} of rules){
        if(!check(wordObj)){
            strikes -= 1
            strikesDisplay.textContent = "Strikes Remaining: " + "X ".repeat(strikes).trim()
            if(strikes <= 0){
                notification("GAME OVER!! | " + error, 5, "var(--error-red)")
                game_container.style.display = "flex"
                link_container.style.display = "none"
                results.style.display = "block"
                results.textContent = "Previous Link Length: " + currentLink.length
                if(currentLink.length > 0){
                    get(ref(db, "userdata/" + auth.currentUser.uid + "/score")).then(function(snapshot){
                        update(ref(db, "userdata/" + auth.currentUser.uid), {
                            score: snapshot.val() + currentLink.length
                        }).then(function(){
                            notification("You earned " + currentLink.length + " points!", 5)
                        }).catch(function(err){
                            notification("Error: " + err, 5, "var(--error-red)")
                        })
                    })
                }
            } else {
                notification(error, 5, "var(--error-red)")
            }
            return
        }
    }
    addLink(wordObj.get_word())
})

start_button.addEventListener("click", function(){
    game_container.style.display = "none"
    link_container.style.display = "flex"
    newLink()
})
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

const lengthRequirements = {
    a: 6, e: 6, i: 6, o: 6, u: 6,
    r: 5, s: 5, t: 5, 
    v: 3, x: 3, z: 3,
    default: 4
};

  
const link = document.getElementById("link")
const input = document.getElementById("word_input")
const submit = document.getElementById("submit_button")
const game_container = document.getElementById("game_container")
const link_container = document.getElementById("link_container")
const start_button = document.getElementById("start_button")

let currentLink = []

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
        check: (wordObj) => wordObj.get_word().length >= lengthRequirements[getLinkingLetter()] || lengthRequirements.default,
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

async function newLink(){
    currentLink = []
    const word = (await Word.New()).get_word().toLowerCase()
    currentLink.push(word)
    link.textContent = word.toUpperCase() + " -> "
}

submit.addEventListener("click", async function(){
    const wordObj = await Word.New(input.value.toLowerCase())
    for(const {check, error} of rules){
        if(!check(wordObj)){
            return notification(error, 5)
        }
    }
    currentLink.push(wordObj.get_word())
    link.textContent = link.textContent + wordObj.get_word().toUpperCase() + " -> "
    link.scrollLeft = link.scrollWidth
    input.value = ""
})

start_button.addEventListener("click", function(){
    game_container.style.display = "none"
    link_container.style.display = "flex"
})



newLink()
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

const link = document.getElementById("link")
const input = document.getElementById("word_input")
const submit = document.getElementById("submit_button")


let currentLink = []
let currentLinkText = null 
let previous_word = null

async function newLink(){
    currentLink = []
    previous_word = (await Word.New()).get_word().toLowerCase()
    currentLink.push(previous_word)
    currentLinkText = previous_word.toUpperCase() + " -> "
    link.textContent = currentLinkText
}

submit.addEventListener("click", async function(){
    const word = input.value.toLowerCase() 
    if(word != ""){
        const definition = (await Word.New(word)).get_definitions()
        
        if(definition == null){
            notification("Can't link; this word doesn't exist.", 5)
        } else {
            if(previous_word[previous_word.length-1] == word[0]){
                if(currentLink.indexOf(word) == -1){
                    currentLink.push(word)
                    currentLinkText += word.toUpperCase() + " -> "
                    previous_word = word
                    link.textContent = currentLinkText
                    link.scrollLeft = link.scrollWidth
                    input.value = ""
                } else {
                    notification("Can't link; no repeats allowed.", 5)
                }
            } else {
               notification("Can't link; first letter of answer doesn't match last letter of previous word.", 5)
            }
        }
    }
})

newLink()
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Word from "./word.js"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDft-OAjQovGmUmmcyowkcYgV0kEPBMrME",
    authDomain: "wordsearch-8ef82.firebaseapp.com",
    projectId: "wordsearch-8ef82",
    storageBucket: "wordsearch-8ef82.appspot.com",
    messagingSenderId: "483921968995",
    appId: "1:483921968995:web:040b330d0dd874fbfc9d56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getDatabase()
//----------------Random Words----------------//
function display_definition(word_object){
    const definition_area = document.getElementById("word_definition")
    if(document.getElementById("word") != null){
        document.getElementById("word").remove()
    }
    let word_div = document.createElement("div")
    word_div.id = "word"
            
    let defined_word = document.createElement("div")
    defined_word.classList.add("defined_word")
    defined_word.textContent = word_object.get_word()
    word_div.append(defined_word)

    try{
        let definitions = word_object.get_definitions()
        if(definitions.length != 0){
            definitions.forEach(function(definition){
                let definition_div = document.createElement("div")
                definition_div.classList.add("definition")
                definition_div.textContent = definition
                word_div.append(definition_div)
            })
            definition_area.textContent = ""
            definition_area.append(word_div)
        }
    } catch {
        let error_div = document.createElement("div")
        error_div.textContent = "Definition Unavailable."
        word_div.append(error_div)
    }
}

document.getElementById("search_button").addEventListener("click", function(e){
    let val = document.getElementById("word_input").value
    if(val != ""){
        document.getElementById("word_definition").textContent = "Loading..."
        let word = new Word(val.toLowerCase())
        setTimeout(function(){
            display_definition(word)
        }, 100)
    }
})

document.getElementById("random_button").addEventListener("click", function(e){
    document.getElementById("word_definition").textContent = "Loading..."
    function try_generate(){
        let word = new Word(4)
        document.getElementById("random_button").disabled = true
        setTimeout(function(){
            display_definition(word) 
            document.getElementById("random_button").disabled = false
            // TODO: Add recursive functionality
        }, 1000)
    }
    try_generate()
})

onAuthStateChanged(auth, function(user){
    if(user == null){
        document.location.href = "index.html"
    }
})



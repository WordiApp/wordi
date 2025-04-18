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
//----------------Elements & Variables----------------//
const spinner = document.getElementById("spinner")
const result = document.getElementById("result")
const wordHistory = document.getElementById("word-history")
const searchButton = document.getElementById("search-button")
const randomButton = document.getElementById("random-button")
const searchbar = document.getElementById("searchbar")

let previousWord = ""
//----------------Load----------------//
onAuthStateChanged(auth, async function (user) {
    if (user == null) {
        window.location.href = "index.html"
    } else {
        //----------------Search History----------------//
        function refreshWordHistory() {
            if (user != null) {
                get(ref(db, "userdata/" + user.uid)).then(async function (snapshot) {
                    let data = JSON.parse(snapshot.val()["word_history"])
                    wordHistory.innerHTML = ""
                    for (let i = 0; i < Math.min(100, data.length); i++) {
                        let card = document.createElement("div")
                        card.classList.add("word-card")
                        card.textContent = data[i]
                        card.addEventListener("click", async function () {
                            const wordObj = await Word.New(data[i]) 
                            displayWord(wordObj, false)
                            window.scrollTo({top: 0, left: 0, behavior: "smooth"})
                        })
                        wordHistory.appendChild(card)
                    }
                })
            }
        }
        //----------------Display Word----------------//
        async function displayWord(wordObj, evaluate) {
            spinner.style.display = "block"
            let word = wordObj.getWord()
            let definitions = wordObj.getDefinitions()

            if (document.getElementById("word") != null) {
                document.getElementById("word").remove()
            }
            const wordContainer = document.createElement("div")
            wordContainer.id = "word"

            const definitionContainer = document.createElement("div")
            definitionContainer.classList.add("defined-word")
            definitionContainer.textContent = word
            wordContainer.append(definitionContainer)

            if (definitions != null) {
                definitions.forEach(function (definition) {
                    const definitionLine = document.createElement("div")
                    definitionLine.classList.add("definition")
                    definitionLine.textContent = definition
                    wordContainer.append(definitionLine)
                })
                get(ref(db, "userdata/" + user.uid))
                    .then(function (snapshot) {
                        let wordHistory = JSON.parse(snapshot.val()["word_history"])
                        let wordsSearched = Number(snapshot.val()["words_searched"])
                        let points = Number(snapshot.val()["score"])
                        let addedPoints = 1
                        if (wordHistory.includes(word) == false) {
                            addedPoints = 2
                        } else {
                            wordHistory.splice(wordHistory.indexOf(word), 1)
                        }
                        wordHistory.unshift(word)
                        if (evaluate == false || previousWord == word) {
                            addedPoints = 0
                        } else {
                            previousWord = word
                        }
                        update(ref(db, "userdata/" + user.uid), {
                            score: points + addedPoints,
                            words_searched: wordsSearched + 1,
                            word_history: JSON.stringify(wordHistory),
                        })
                            .then(function () {
                                refreshWordHistory()
                                if (addedPoints > 0) {
                                    notification("You earned " + addedPoints + " point(s)!", 5)
                                }
                            })
                            .catch(function (err) {
                                notification("Error: " + err, 5)
                            })
                    })
                    .catch(function (err) {
                        notification("Error1: " + err, 5)
                    })
            } else {
                const noDefinition = document.createElement("div")
                noDefinition.classList.add("definition")
                noDefinition.textContent = "No definition found for this word."
                wordContainer.append(noDefinition)
            }
            result.textContent = ""
            result.append(wordContainer)
            spinner.style.display = "none"
        }
        //----------------Buttons----------------//
        searchButton.addEventListener("click", async function () {
            let val = searchbar.value
            searchButton.disabled = true
            if (val != "") {
                const wordObj = await Word.New(val.toLowerCase())
                displayWord(wordObj)
            } else {
                notification("Please enter a word!")
            }
            setTimeout(function () {
                searchButton.disabled = false
            }, 100)
        })

        randomButton.addEventListener("click", async function () {
            randomButton.disabled = true
            const wordObj = await Word.New()
            displayWord(wordObj)
            setTimeout(function () {
                randomButton.disabled = false
            }, 1000)
        })

        refreshWordHistory()
        //----------------Dashboard Lookup----------------//
        if (localStorage["word_to_look_up"] != undefined) {
            const wordObj = await Word.New(localStorage["word_to_look_up"])
            displayWord(wordObj, false)
            delete localStorage["word_to_look_up"]
        }
    }
})

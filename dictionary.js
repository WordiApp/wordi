// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Word from "./word.js"
import Notification from "./notification.js"

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

function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms)
    })
}

if (auth.currentUser == null) {
    window.location.href = "index.html"
} else {
    function refresh_word_history() {
        if (auth.currentUser.uid != null) {
            get(ref(db, "userdata/" + auth.currentUser.uid)).then(async function (snapshot) {
                let word_history = JSON.parse(snapshot.val()["word_history"])
                document.getElementById("word_history").innerHTML = ""
                for (let i = 0; i < Math.min(100, word_history.length); i++) {
                    let card = document.createElement("div")
                    card.classList.add("word_card")
                    card.addEventListener("click", function () {
                        search_word(word_history[i])
                        window.scrollTo({top: 0, left: 0, behavior: "smooth"})
                    })
                    document.getElementById("word_history").appendChild(card)
                }
            })
        }
    }

    async function search_word(input) {
        document.getElementById("spinner").style.display = "block"
        let wordObj = new Word()
        await wordObj.create_word(input.toLowerCase())
        let word = wordObj.get_word()
        let definitions = wordObj.get_definitions()

        const definition_area = document.getElementById("word_definition")
        if (document.getElementById("word") != null) {
            document.getElementById("word").remove()
        }
        let word_div = document.createElement("div")
        word_div.id = "word"

        let defined_word = document.createElement("div")
        defined_word.classList.add("defined_word")
        defined_word.textContent = word
        word_div.append(defined_word)

        if (definitions.length > 0) {
            definitions.forEach(function (definition) {
                let definition_div = document.createElement("div")
                definition_div.classList.add("definition")
                definition_div.textContent = definition
                word_div.append(definition_div)
            })
        } else {
            let no_definition_div = document.createElement("div")
            no_definition_div.classList.add("definition")
            no_definition_div.textContent = "No definition found for this word."
            word_div.append(no_definition_div)
        }
        definition_area.textContent = ""
        definition_area.append(word_div)

        get(ref(db, "userdata/" + auth.currentUser.uid))
            .then(function (snapshot) {
                let word_history = JSON.parse(snapshot.val()["word_history"])
                let current_words_searched = Number(snapshot.val()["words_searched"])
                let current_points = Number(snapshot.val()["score"])
                let added_points = 1
                if (word_history.includes(word) == false) {
                    added_points = 2
                    word_history.unshift(word)
                } else {
                    word_history.splice(word_history.indexOf(word), 1)
                    word_history.unshift(word)
                }
                update(ref(db, "userdata/" + auth.currentUser.uid), {
                    score: current_points + added_points,
                    words_searched: current_words_searched + (added_points - 1),
                    word_history: JSON.stringify(word_history),
                })
                    .then(function () {
                        refresh_word_history()
                        new Notification(document, "You earned " + added_points + " point(s)! 🪙", 5)
                    })
                    .catch(function (err) {
                        new Notification(document, "Error: " + err, 5)
                    })
            })
            .catch(function (err) {
                new Notification(document, "Error: " + err, 5)
            })

        document.getElementById("spinner").style.display = "none"
    }

    //----------------Random Words----------------//
    // TODO: fix this function to work w/ new system
    //----------------Random Words----------------//

    document.getElementById("search_button").addEventListener("click", async function (e) {
        let val = document.getElementById("word_input").value
        document.getElementById("search_button").disabled = true
        search_word(val)
        setTimeout(function () {
            document.getElementById("search_button").disabled = false
        }, 100)
    })

    document.getElementById("random_button").addEventListener("click", async function (e) {
        document.getElementById("random_button").disabled = true
        search_word()
        setTimeout(function () {
            document.getElementById("random_button").disabled = false
        }, 100)
    })

    refresh_word_history()
}

onAuthStateChanged(auth, function (user) {
    if (user == null) {
        document.location.href = "index.html"
    }   
})

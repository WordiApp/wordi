//----------------Database----------------//
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase, query, orderByChild, limitToFirst, ref, get, set, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
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
const greeting = document.getElementById("greeting")
const streak = document.getElementById("streak")
const word_count = document.getElementById("word_count")
const date_box = document.getElementById("date_box")
const word_history = document.getElementById("word_history")
const leaderboard = document.getElementById("leaderboard")

const greetings = ["Hello, ", "Greetings, ", "Salutations, ", "Good day, ", "Welcome back, ", "Why hello there, ", "Nice to see you,  ", "Glad you're back, ", "Hope you're having a good day, ", "Welcome to Wordi, ", "Aloha, "]
//----------------Load----------------//
onAuthStateChanged(auth, function (user) {
    if (user == null) {
        document.location.href = "index.html"
    } else {
        //----------------Display User Data----------------//
        get(ref(db, "userdata/" + user.uid))
            .then(function (snapshot) {
                greeting.textContent = greetings[Math.floor(Math.random() * greetings.length)] + snapshot.val()["username"] + "!"
                //----------------Streak----------------//
                let last_streak_log = snapshot.val()["last_streak_log"]
                let current_streak = snapshot.val()["streak"]
                if (current_streak == "") {
                    update(ref(db, "userdata/" + user.uid), {
                        last_streak_log: new Date(),
                        streak: 1,
                    })
                        .then(function () {
                            streak.textContent = "1 days"
                        })
                        .catch(function (err) {
                            notification("Streak Error: " + err)
                        })
                }
                if (last_streak_log != "") {
                    let previous_seconds = Number(new Date(last_streak_log).getTime())
                    let current_seconds = Number(new Date().getTime())
                    let time_difference = Math.floor((current_seconds - previous_seconds) / 1000)
                    if (time_difference >= 86400) {
                        update(ref(db, "userdata/" + user.uid), {
                            last_streak_log: new Date(),
                        })
                            .then()
                            .catch(function (err) {
                                notification("Streak Error: " + err, 3)
                            })
                        if (time_difference < 172800) {
                            update(ref(db, "userdata/" + user.uid), {
                                streak: current_streak + 1,
                            })
                                .then(function () {
                                    streak.textContent = current_streak + 1 + " days"
                                    notification("You kept your streak! Login everyday to maintain it.")
                                })
                                .catch(function (err) {
                                    notification("Streak Error: " + err)
                                })
                        } else {
                            update(ref(db, "userdata/" + user.uid), {
                                streak: 1,
                            })
                                .then(function () {
                                    streak.textContent = "1 days"
                                    notification("You lost your streak! Login everyday to maintain it.")
                                })
                                .catch(function (err) {
                                    notification("Streak Error: " + err)
                                })
                        }
                    }
                }
                streak.textContent = snapshot.val()["streak"] + " days"
                //----------------Word Count----------------//
                let count = Number(snapshot.val()["words_searched"])
                word_count.textContent = count + " Words"
                //----------------Word History----------------//
                let history = JSON.parse(snapshot.val()["word_history"])
                for (let i = 0; i < Math.min(history.length, 50); i++) {
                    let card = document.createElement("div")
                    card.classList.add("word_card")
                    card.textContent = history[i]
                    card.addEventListener("click", function () {
                        localStorage["word_to_look_up"] = history[i]
                        window.location.href = "dictionary.html"
                    })
                    word_history.appendChild(card)
                }
            })
            .catch(function (err) {
                notification("Error fetching user data: " + err, 5, "var(--error-red)")
            })
        //----------------Leaderboards----------------//
        let spots = 25

        function leaderboard_refresh() {
            let data_query = query(ref(db, "userdata"), orderByChild("score"), limitToFirst(25))
            get(data_query)
                .then(function (snapshot) {
                    let data_keys = []
                    let data_values = []
                    snapshot.forEach(function (child) {
                        data_keys.unshift(child.key)
                        data_values.unshift(child.val())
                    })
                    for (let i = 0; i < spots; i++) {
                        let spot = document.getElementById("spot" + String(i))
                        if (spot == null) {
                            spot = document.createElement("div")
                            spot.id = "spot" + String(i)
                            spot.classList.add("spot")
                            leaderboard.append(spot)
                        }
                        if (i < data_keys.length) {
                            get(ref(db, "userdata/" + data_keys[i] + "/username"))
                                .then(function (snapshot) {
                                    spot.innerHTML = String("<b>#" + (i + 1) + "</b> " + snapshot.val() + " - " + data_values[i].score) + " Points"
                                })
                                .catch(function (err) {
                                    spot.innerHTML = String("<b>#" + (i + 1) + "<b>    Username Unknown - " + data_values[i].score) + " Points"
                                    console.log("Leadeboard error: " + err)
                                })
                        } else {
                            spot.innerHTML = String("<b>#" + (i + 1) + "</b> ???")
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err)
                })
        }

        function loop() {
            setTimeout(function () {
                leaderboard_refresh()
                loop()
            }, 2000)
        }
        //----------------Calendar----------------//
        setInterval(function () {
            let current_date = new Date()
            date_box.textContent = current_date.toDateString() + " " + current_date.toLocaleTimeString()
        }, 1000)

        leaderboard_refresh()
        loop()
    }
})

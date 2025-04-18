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
const wordCount = document.getElementById("word-count")
const dateBox = document.getElementById("date-box")
const wordHistory = document.getElementById("word-history")
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
                let lastStreakLog = snapshot.val()["last_streak_log"]
                let currentStreak = snapshot.val()["streak"]
                if (currentStreak == "") {
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
                if (lastStreakLog != "") {
                    let previousSeconds = Number(new Date(lastStreakLog).getTime())
                    let currentSeconds = Number(new Date().getTime())
                    let timeDifference = Math.floor((currentSeconds - previousSeconds) / 1000)
                    if (timeDifference >= 86400) {
                        update(ref(db, "userdata/" + user.uid), {
                            last_streak_log: new Date(),
                        })
                            .then()
                            .catch(function(err) {
                                notification("Streak Error: " + err, 3)
                            })
                        if (timeDifference < 172800) {
                            update(ref(db, "userdata/" + user.uid), {
                                streak: currentStreak + 1,
                            })
                                .then(function() {
                                    streak.textContent = currentStreak + 1 + " days"
                                    notification("You kept your streak! Login everyday to maintain it.")
                                })
                                .catch(function (err) {
                                    notification("Streak Error: " + err)
                                })
                        } else {
                            update(ref(db, "userdata/" + user.uid), {
                                streak: 1,
                            })
                                .then(function() {
                                    streak.textContent = "1 days"
                                    notification("You lost your streak! Login everyday to maintain it.")
                                })
                                .catch(function(err) {
                                    notification("Streak Error: " + err)
                                })
                        }
                    }
                }
                streak.textContent = snapshot.val()["streak"] + " days"
                //----------------Word Count----------------//
                let count = Number(snapshot.val()["words_searched"])
                wordCount.textContent = count + " Words"
                //----------------Word History----------------//
                let history = JSON.parse(snapshot.val()["word_history"])
                for (let i = 0; i < Math.min(history.length, 50); i++) {
                    let card = document.createElement("div")
                    card.classList.add("word-card")
                    card.textContent = history[i]
                    card.addEventListener("click", function () {
                        localStorage["word_to_look_up"] = history[i]
                        window.location.href = "dictionary.html"
                    })
                    wordHistory.appendChild(card)
                }
            })
            .catch(function (err) {
                notification("Error fetching user data: " + err, 5, "var(--error-red)")
            })
        //----------------Leaderboards----------------//
        let spots = 25

        function leaderboardRefresh() {
            let dataQuery = query(ref(db, "userdata"), orderByChild("score"), limitToFirst(25))
            get(dataQuery)
                .then(function (snapshot) {
                    let dataKeys = []
                    let dataValues = []
                    snapshot.forEach(function (child) {
                        dataKeys.unshift(child.key)
                        dataValues.unshift(child.val())
                    })
                    for (let i = 0; i < spots; i++) {
                        let spot = document.getElementById("spot" + String(i))
                        if (spot == null) {
                            spot = document.createElement("div")
                            spot.id = "spot" + String(i)
                            spot.classList.add("spot")
                            leaderboard.append(spot)
                        }
                        if (i < dataKeys.length) {
                            get(ref(db, "userdata/" + dataKeys[i] + "/username"))
                                .then(function (snapshot) {
                                    spot.innerHTML = String("<b>#" + (i + 1) + "</b> " + snapshot.val() + " - " + dataValues[i].score) + " Points"
                                })
                                .catch(function (err) {
                                    spot.innerHTML = String("<b>#" + (i + 1) + "<b>    Username Unknown - " + dataValues[i].score) + " Points"
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
                leaderboardRefresh()
                loop()
            }, 2000)
        }
        //----------------Calendar----------------//
        setInterval(function () {
            const currentDate = new Date()
            dateBox.textContent = currentDate.toDateString() + " " + currentDate.toLocaleTimeString()
        }, 1000)

        leaderboardRefresh()
        loop()
    }
})

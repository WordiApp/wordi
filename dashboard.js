// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, query, orderByChild, limitToFirst, ref, get, set, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Notification from "./notification.js";
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

onAuthStateChanged(auth, function(user){
    if(user == null){
        document.location.href = "index.html"
    } else {
        get(ref(db, "userdata/" + user.uid)).then(function(snapshot){
            new Notification(document, "Welcome, " + snapshot.val()["username"], 5)
            let last_streak_log = snapshot.val()["last_streak_log"]
            console.log(new Date(last_streak_log))
            let previous_seconds = Number(new Date(last_streak_log).getTime())
            let current_seconds = Number(new Date().getTime())
            let current_streak = snapshot.val()["streak"]
            if(current_streak == undefined){
                current_streak = 0
            }
            if(last_streak_log != undefined){
                let time_difference = Math.floor((current_seconds - previous_seconds)/1000)
                console.log(previous_seconds)
                console.log(current_seconds)
                console.log(time_difference)
                if(time_difference >= 86400){
                    update(ref(db, "userdata/" + user.uid), {
                        last_streak_log: new Date()
                    }).then().catch(function(err){console.log(err)})
                    if(time_difference < 172800){
                        update(ref(db, "userdata/" + user.uid), {
                            streak: current_streak + 1
                        }).then().catch(function(err){console.log(err)})
                    } else {
                        update(ref(db, "userdata/" + user.uid), {
                            streak: 0
                        }).then().catch(function(err){console.log(err)})
                    }
                }
                //TBA: Display Streak
            } else {
                update(ref(db, "userdata/" + user.uid), {
                    last_streak_log: new Date()
                })
            } 
        }).catch(function(err){
            alert(err)
        })
    }
})
//----------------Dashboard Functions----------------//
const date_box = document.getElementById("date_box")
setInterval(function(){
    let current_date = new Date()
    date_box.textContent = current_date.toDateString() + " " + current_date.toLocaleTimeString()
}, 1000)
//----------------Leaderboards----------------//
const leaderboard = document.getElementById("leaderboard")
let spots = 25

function leaderboard_refresh(){
    let data_query = query(ref(db, "userdata"), orderByChild("score"), limitToFirst(25))
    get(data_query).then(function(snapshot){
        let data_keys = []
        let data_values = []
        snapshot.forEach(function(child){
            data_keys.unshift(child.key)
            data_values.unshift(child.val())
        })
        for (let i = 0; i < spots; i++){
            let spot = document.getElementById("spot" + String(i))
            if(spot == null){
                spot = document.createElement("div")
                spot.id = "spot" + String(i) 
                spot.classList.add("spot")
                leaderboard.append(spot)
            }
            if (i < data_keys.length){
                get(ref(db, "userdata/" + data_keys[i] + "/username")).then(function(snapshot){
                    spot.textContent = String("#" + (i+1) +  " " + snapshot.val() + " - " + data_values[i].score) + " Points" 
                }).catch(function(err){
                    spot.textContent = String("#" + (i+1) +  " Username Unknown - " + data_values[i].score) + " Points"  
                    console.log(err)
                })
            } else{
                spot.textContent = String("#" + (i+1) + " ???")
            }
        }
    }).catch(function(err){
        console.log(err)
    })
}

function loop(){
    setTimeout(function(){
        leaderboard_refresh()
        loop()
    }, 2000)
}
leaderboard_refresh()
loop()
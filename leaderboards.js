// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, query, orderByChild, limitToFirst, ref, get, set, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"

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

const leaderboard = document.getElementById("leaderboard")

//----------------Leaderboards----------------//
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
                    spot.textContent = String("#" + (i+1) +  " " + snapshot.val() + " - " + data_values[i].score) 
                }).catch(function(err){
                    spot.textContent = String("#" + (i+1) +  " Username Unknown - " + data_values[i].score) 
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
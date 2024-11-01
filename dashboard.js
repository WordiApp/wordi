// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
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
        }).catch(function(err){
            alert(err)
        })
    }
})
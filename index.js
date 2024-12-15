// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, query, orderByChild, limitToFirst, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Notification  from "./notification.js";
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

//----------------Elements----------------//
const form_name = document.getElementById("form_name")

const username_input_section = document.getElementById("username")
const email_input_section = document.getElementById("email")
const password_input_section = document.getElementById("password")

const username_input = document.getElementById("input_username")
const email_input = document.getElementById("input_email")
const password_input = document.getElementById("input_password")
const toggle_password = document.getElementById("toggle_password")
const toggle_password_icon = document.getElementById("toggle_password_icon")

const submit_button = document.getElementById("submit_button")
const toggle_link = document.getElementById("toggle_link")
//----------------Signin----------------//
let register_activated = false
let show_password = false
document.getElementById("access_form").addEventListener("submit", function(event){
    let name = username_input.value
    let email = email_input.value
    let password = password_input.value
    if(register_activated){
        createUserWithEmailAndPassword(auth, email, password).then(function(user_credential){
            set(ref(db, "userdata/" + user_credential["user"].uid),{
                username: name,
                email: email,
                score: 0,
                words_searched: 0,
                streak: 0,
                word_history: "",
                last_streak_log: ""
            })
            document.location.href = "dashboard.html" 
        }).catch(function(err){
            new Notification(document, "Register Error: " + err, 5, "var(--error-red)")
            console.log(err)
        })
    } else{
        signInWithEmailAndPassword(auth, email, password).then(function(user_credential){
            document.location.href = "dashboard.html"
        }).catch(function(err){
            new Notification(document, "Login Error: " + err, 5, "var(--error-red)")
            console.log(err)
        })
    }
    event.preventDefault()
})

toggle_password.addEventListener("click", function(e){
    if(show_password == true){
        password_input.type = "password"
        toggle_password_icon.classList.replace("bi-eye-slash", "bi-eye")
    }else{
        password_input.type = "text"
        toggle_password_icon.classList.replace("bi-eye", "bi-eye-slash")
    }
    show_password = !show_password
})

toggle_link.addEventListener("click", function(){
    if(register_activated == true){
        toggle_link.textContent = "Don't have an account? Register here!"
        username_input_section.style.display = "none"
        submit_button.textContent = "LOGIN"
        form_name.textContent = "Login"
    } else {
        toggle_link.textContent = "Already have an account? Login here!"
        username_input_section.style.display = "block"
        submit_button.textContent = "REGISTER"
        form_name.textContent = "Register"
    }
    register_activated = !register_activated
})


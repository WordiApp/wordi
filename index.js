// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, query, orderByChild, limitToFirst, ref, get, set, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
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

//----------------Elements----------------//
const login_button = document.getElementById("login_button")
const register_button = document.getElementById("register_button")

const username_input_section = document.getElementById("username")
const email_input_section = document.getElementById("email")
const password_input_section = document.getElementById("password")

const username_input = document.getElementById("input_username")
const email_input = document.getElementById("input_email")
const password_input = document.getElementById("input_password")
const password_checkbox = document.getElementById("show_password")

const submit_button = document.getElementById("submit_button")
//----------------Signin----------------//
let register_activated = false
document.getElementById("signin").addEventListener("submit", function(event){
    let name = document.getElementById("input_username").value
    let email = document.getElementById("input_email").value
    let password = document.getElementById("input_password").value
    console.log("click")
    if(register_activated){
        console.log(email + " | " + password)
        createUserWithEmailAndPassword(auth, email, password).then(function(user_credential){
            let uid = user_credential.user.uid
            set(ref(db, "userdata/" + uid),{
                username: name,
                email: email,
                score: 0
            })
            document.location.href = "dashboard.html" 
        }).catch(function(err){
            console.log(err)
        })
    } else{
        signInWithEmailAndPassword(auth, email, password).then(function(user_credential){
            document.location.href = "dashboard.html"
        }).catch(function(err){
            alert(err)
            console.log(err)
        })
    }
    event.preventDefault()
})

password_checkbox.addEventListener("change", function(e){
    if(password_checkbox.checked == true){
        password_input.type = "text"
    }else{
        password_input.type = "password"
    }
})

login_button.addEventListener("click", function(){
    register_activated = false
    login_button.classList.replace("btn-secondary", "btn-primary")
    register_button.classList.replace("btn-primary", "btn-secondary")
    username_input_section.style.visibility = "hidden"
    username_input_section.style.height = "0px"
    submit_button.textContent = "Login"
})

register_button.addEventListener("click", function(){
    register_activated = true
    login_button.classList.replace("btn-primary", "btn-secondary")
    register_button.classList.replace("btn-secondary", "btn-primary")
    username_input_section.style.visibility = "visible"
    username_input_section.style.height = ""
    submit_button.textContent = "Register"
})

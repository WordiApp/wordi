// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"

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

const display_username = document.getElementById("username_display")
const display_email = document.getElementById("email_display")
const display_score = document.getElementById("score_display")

const update_username_input = document.getElementById("update_username_input")
const update_email_input = document.getElementById("update_email_input")
const update_password_input = document.getElementById("update_password_input")

const update_username_button = document.getElementById("update_username_button")
const update_email_button = document.getElementById("update_email_button")
const update_password_button = document.getElementById("update_password_button")

const signout_button = document.getElementById("signout_button")

function display_info(user){
    if(user != null){
        get(ref(db, "userdata/" + user.uid)).then(function(snapshot){
            display_username.textContent = "Username: " + snapshot.val()["username"]
            display_email.textContent = "Email: " + snapshot.val()["email"]
            display_score.textContent = "Score: " + snapshot.val()["score"]
        }).catch(function(err){
            alert(err)
        })
    }
}
onAuthStateChanged(auth, function(user){
    display_info(user)
})

update_username_button.addEventListener("click", function(event){
    if(auth.currentUser != null){
        let new_username = update_username_input.value
        if(new_username.length >= 3){
            update(ref(db, "userdata/" + auth.currentUser.uid), {
                username: new_username
            }).then(function(snapshot){
                alert("Username succesfully changed to " + new_username + "!")
            }).catch(function(err){
                alert(err)
            })
        }else{
            alert("Username must be at least 3 characters long.")
        }
    }else{
        alert("User not logged in.")
    }
    event.preventDefault()
})

update_email_button.addEventListener("click", function(event){
    if(auth.currentUser != null){
        let new_email = update_email_input.value
        updateEmail(auth.currentUser, new_email).then(function(){
            update(ref(db, "userdata/" + auth.currentUser.uid), {
                email: new_email
            }).then(function(snapshot){
                alert("Email successfully updated!")
            }).catch(function(err){
                alert("There was an error saving the user's new email. (" + err + ")")
            })
        }).catch(function(err){
            alert("There was an error updating the user's email. (" + err + ")")
        })
    }else{
        alert("User not logged in.")
    }
    event.preventDefault()
})

update_password_button.addEventListener("click", function(event){
    if(auth.currentUser != null){
        let new_password = update_password_input.value
        if(new_password.length >= 6){
            updatePassword(auth.currentUser, new_password).then(function(){
                alert("Password successfully updated!")
            }).catch(function(err){
                alert("There was an error updating the user's password. (" + err + ")")
            })
        }else{
            alert("Username must be at least 6 characters long.")
        }
    }else{
        alert("User not logged in.")
    }
    event.preventDefault()
})

signout_button.addEventListener("click", function(){
    auth.signOut()
    document.location.href = "index.html"
})
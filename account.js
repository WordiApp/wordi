//----------------Database----------------//
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import {getAuth, onAuthStateChanged, updateEmail, updatePassword} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
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
//----------------Load----------------//
onAuthStateChanged(auth, function (user) {
    if (user == null) {
        document.location.href = "index.html"
    } else {
        //----------------Display User Info----------------//
        function display_info(user) {
            if (user != null) {
                get(ref(db, "userdata/" + user.uid))
                    .then(function (snapshot) {
                        display_username.textContent = "Username: " + snapshot.val()["username"]
                        display_email.textContent = "Email: " + snapshot.val()["email"]
                        display_score.textContent = "Total Points: " + snapshot.val()["score"]
                    })
                    .catch(function (err) {
                        notification("Error: " + err, 5, "var(--error-red)")
                    })
            }
        }
        //----------------Buttons----------------//
        update_username_button.addEventListener("click", function (event) {
            let new_username = update_username_input.value
            if (auth.currentUser != null && new_username != "") {
                if (new_username.length >= 3) {
                    update(ref(db, "userdata/" + auth.currentUser.uid), {
                        username: new_username,
                    })
                        .then(function (snapshot) {
                            notification("Username succesfully changed to " + new_username + "!")
                            display_info(auth.currentUser)
                        })
                        .catch(function (err) {
                            notification("Error: " + err, 5, "var(--error-red)")
                        })
                } else {
                    notification("Username must be more than 3 characters long", 5, "var(--error-red)")
                }
            } else {
                notification("Something went wrong.", 5, "var(--error-red)")
            }
            event.preventDefault()
        })

        update_email_button.addEventListener("click", function (event) {
            let new_email = update_email_input.value
            if (auth.currentUser != null && new_email != "") {
                updateEmail(auth.currentUser, new_email)
                    .then(function () {
                        update(ref(db, "userdata/" + auth.currentUser.uid), {
                            email: new_email,
                        })
                            .then(function () {
                                notification("Email successfully updated!")
                                display_info(auth.currentUser)
                            })
                            .catch(function (err) {
                                notification("Email Error: " + err, 5, "var(--error-red)")
                            })
                    })
                    .catch(function (err) {
                        notification("Email Error: " + err, 5, "var(--error-red)")
                    })
            } else {
                notification("Something went wrong.", 5, "var(--error-red)")
            }
            event.preventDefault()
        })

        update_password_button.addEventListener("click", function (event) {
            let new_password = update_password_input.value
            if (auth.currentUser != null && new_password != "") {
                if (new_password.length >= 6) {
                    updatePassword(auth.currentUser, new_password)
                        .then(function () {
                            notification("Password successfully updated!")
                            display_info(auth.currentUser)
                        })
                        .catch(function (err) {
                            notification("Password Error: " + err, 5, "var(--error-red)")
                        })
                } else {
                    notification("Password must be more than 6 characters long", 5, "var(--error-red)")
                }
            } else {
                notification("Something went wrong.", 5, "var(--error-red)")
            }
            event.preventDefault()
        })

        signout_button.addEventListener("click", function () {
            auth.signOut()
            document.location.href = "index.html"
        })

        display_info(user)
    }
})

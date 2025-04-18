//----------------Database----------------//
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase, ref, get, update, remove} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
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
const displayUsername = document.getElementById("username-display")
const displayEmail = document.getElementById("email-display")
const displayPassword = document.getElementById("password-display")
const displayScore = document.getElementById("score-display")
const displayStreak = document.getElementById("streak-display")
const displaySearched = document.getElementById("search-display")

const updateUsernameButton = document.getElementById("update-username-button")
const updateEmailButton = document.getElementById("update-email-button")
const updatePasswordButton = document.getElementById("update-password-button")

const updateUsernameTab = document.getElementById("update-username")
const updateEmailTab = document.getElementById("update-email")
const updatePasswordTab = document.getElementById("update-password")

const editUsernameInput = document.getElementById("edit-username-input")
const editEmailInput = document.getElementById("edit-email-input")
const editPasswordInput = document.getElementById("edit-password-input")

const editUsernameButton = document.getElementById("edit-username-button")
const editEmailButton = document.getElementById("edit-email-button")
const editPasswordButton = document.getElementById("edit-password-button")

const signoutButton = document.getElementById("signout-button")
const deleteButton = document.getElementById("delete-button")
//----------------Load----------------//
onAuthStateChanged(auth, function (user) {
    if (user == null) {
        document.location.href = "index.html"
    } else {
        //----------------Display User Info----------------//
        function displayInfo(user) {
            if (user != null) {
                get(ref(db, "userdata/" + user.uid))
                    .then(function (snapshot) {
                        displayUsername.innerHTML = '<i class="bi bi-person"></i> Username: ' + snapshot.val()["username"]
                        displayEmail.innerHTML = '<i class="bi bi-envelope"></i> Email: ' + snapshot.val()["email"]
                        displayPassword.innerHTML = '<i class="bi bi-key"></i> Password: •••••••••••'
                        displayScore.innerHTML = '<i class="bi bi-coin"></i> Total Points: ' + snapshot.val()["score"]
                        displayStreak.innerHTML = '<i class="bi bi-fire"></i> Current Streak: ' + snapshot.val()["streak"]
                        displaySearched.innerHTML = '<i class="bi bi-search"></i> Words Searched: ' + snapshot.val()["words_searched"]
                    })
                    .catch(function (err) {
                        notification("Error: " + err, 5, "var(--error-red)")
                    })
            }
        }
        //----------------Buttons----------------//
        editUsernameButton.addEventListener("click", function (event) {
            let newUsername = editUsernameInput.value
            if (auth.currentUser != null && newUsername != "") {
                if (newUsername.length >= 3) {
                    update(ref(db, "userdata/" + auth.currentUser.uid), {
                        username: newUsername,
                    })
                        .then(function (snapshot) {
                            notification("Username succesfully updated!")
                            displayInfo(auth.currentUser)
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

        editEmailButton.addEventListener("click", function (event) {
            let newEmail = editEmailInput.value
            if (auth.currentUser != null && newEmail != "") {
                updateEmail(auth.currentUser, newEmail)
                    .then(function () {
                        update(ref(db, "userdata/" + auth.currentUser.uid), {
                            email: newEmail,
                        })
                            .then(function () {
                                notification("Email successfully updated!")
                                displayInfo(auth.currentUser)
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

        editPasswordButton.addEventListener("click", function (event) {
            let newPassword = editPasswordInput.value
            if (auth.currentUser != null && newPassword != "") {
                if (newPassword.length >= 6) {
                    updatePassword(auth.currentUser, newPassword)
                        .then(function () {
                            notification("Password successfully updated!")
                            displayInfo(auth.currentUser)
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

        updateUsernameButton.addEventListener("click", function(){
            if(window.getComputedStyle(updateUsernameTab).display == "flex"){
                updateUsernameTab.style.display = "none"
            } else {
                updateUsernameTab.style.display = "flex"
            }
        })

        updateEmailButton.addEventListener("click", function(){
            if(window.getComputedStyle(updateEmailTab).display == "flex"){
                updateEmailTab.style.display = "none"
            } else {
                updateEmailTab.style.display = "flex"
            }
        })

        updatePasswordButton.addEventListener("click", function(){
            if(window.getComputedStyle(updatePasswordTab).display == "flex"){
                updatePasswordTab.style.display = "none"
            } else {
                updatePasswordTab.style.display = "flex"
            }
        })

        signoutButton.addEventListener("click", function () {
            auth.signOut()
            document.location.href = "index.html"
        })

        deleteButton.addEventListener("click", function () {
            const doDelete = confirm("Are you SURE you want to delete your Wordi account? This action CANNOT be undone.")
            if(doDelete){
                remove(ref(db, "userdata/" + auth.currentUser.uid))
                .then(function(){
                    auth.currentUser.delete()
                    .then(function(){
                        window.location.href = "index.html"
                    })
                    .catch(function(err){
                        notification("Something went wrong.", 5, "var(--error-red)")
                    })
                    window.location.href = "index.html"
                })
                .catch(function(err){
                    notification("Something went wrong.", 5, "var(--error-red)")
                })
            }
        })
        displayInfo(user)
    }
})

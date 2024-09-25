// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import { getDatabase, query, orderByChild, limitToFirst, ref, get, set, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Word from "./word.js"
import Topics from "./topics.js"

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
const leaderboard = document.getElementById("leaderboard")

const login_button = document.getElementById("login_button")
const register_button = document.getElementById("register_button")

const username_input_section = document.getElementById("username")
const email_input_section = document.getElementById("email")
const password_input_section = document.getElementById("password")

const username_input = document.getElementById("input_username")
const email_input = document.getElementById("input_email")
const password_input = document.getElementById("input_password")
const password_checkbox = document.getElementById("show_password")

const display_username = document.getElementById("username_display")
const display_email = document.getElementById("email_display")
const display_score = document.getElementById("score_display")

const update_username_input = document.getElementById("update_username_input")
const update_email_input = document.getElementById("update_email_input")
const update_password_input = document.getElementById("update_password_input")

const update_username_button = document.getElementById("update_username_button")
const update_email_button = document.getElementById("update_email_button")
const update_password_button = document.getElementById("update_password_button")

const submit_button = document.getElementById("submit_button")

const signout_button = document.getElementById("signout_button")
//----------------Functions----------------//
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
//----------------Random Words----------------//
function definition_popup(word_object){
    const modalContent = document.getElementById("definition_body")
    const modalBS = new bootstrap.Modal(document.getElementById("word_modal"))
    modalBS.toggle()
            
    document.getElementById("word").remove()
    let word_div = document.createElement("div")
    word_div.id = "word"
    modalContent.append(word_div)
            
    let defined_word = document.createElement("div")
    defined_word.classList.add("defined_word")
    defined_word.textContent = word_object.get_word()
    word_div.append(defined_word)

    let definitions = word_object.get_definitions()
    if(definitions.length != 0){
        definitions.forEach(function(definition){
            let definition_div = document.createElement("div")
            definition_div.classList.add("definition")
            definition_div.textContent = definition
            word_div.append(definition_div)
        })
    } else{
        let error_div = document.createElement("div")
        error_div.textContent = "Couldn't get a definition for this word. Sorry!"
        word_div.append(error_div)
    }
}
//----------------Signin----------------//
let register_activated = false
document.getElementById("signin").addEventListener("submit", function(event){
    let name = document.getElementById("input_username").value
    let email = document.getElementById("input_email").value
    let password = document.getElementById("input_password").value

    if(register_activated){
        console.log(email + " | " + password)
        createUserWithEmailAndPassword(auth, email, password).then(function(user_credential){
            let uid = user_credential.user.uid
            set(ref(db, "userdata/" + uid),{
                username: name,
                email: email,
                score: 0
            })
        }).catch(function(err){
            console.log(err)
        })
    } else{
        signInWithEmailAndPassword(auth, email, password).then(function(user_credential){
            alert(user_credential.user.uid + " -  Has successfully signed in!")
            console.log(user_credential.user.uid + " -  Has successfully signed in!")
        }).catch(function(err){
            alert(err)
            console.log(err)
        })
    }
    event.preventDefault()
})

onAuthStateChanged(auth, function(user){
    display_info(user)
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
    console.log(auth.currentUser)
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
})

let word = new Word(8, true)
document.getElementById("generate_word").addEventListener("click", function(){
    definition_popup(word)
})
setTimeout(function(){
    document.getElementById("generate_word").textContent = word.get_word()
}, 500)

function loop(){
    setTimeout(function(){
        leaderboard_refresh()
        loop()
    }, 2000)
}
leaderboard_refresh()
//loop()
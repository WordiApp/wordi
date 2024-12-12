// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {getDatabase, ref, get, query, orderByChild, limitToFirst, startAt} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCL1o4DPK4trjBkaALzjfPQ-7ubu-BJtOQ",
    authDomain: "words-3a481.firebaseapp.com",
    databaseURL: "https://words-3a481-default-rtdb.firebaseio.com",
    projectId: "words-3a481",
    storageBucket: "words-3a481.firebasestorage.app",
    messagingSenderId: "448694732469",
    appId: "1:448694732469:web:5bbdaffef9bf6564a4e0fc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase()

export default class Word{
    constructor(){
        this.word = ""
        this.word_length = 0
        this.word_definitions = []
    }

    async create_word(given){
        if(given != null){
            this.word = given
            this.word_length = given.length
            const snapshot_definition = await get(ref(db, "words/" + given))
            console.log(snapshot_definition.val())
            this.word_definitions = JSON.parse(snapshot_definition.val())
        } else {
            let word_data = null
            let word_count = await get(ref(db, "/word_count"))
            let rand = Math.floor(Math.random()*Number(word_count.val()))
            let snapshot_word = await get(query(ref(db, "/words"), orderByChild("id"), limitToFirst(1), startAt(rand)))

            this.word = Object.keys(snapshot_word.val())[0]
            this.word_length = Object.keys(snapshot_word.val())[0].length
            this.word_definitions = JSON.parse(Object.values(snapshot_word.val())[0]["definition"])
        }

        // if(this.word == ""){
        //     let word_api = "https://random-word-api.herokuapp.com/word"
        //     if(isNaN(parseInt(given)) == false){
        //         if(given > 12){
        //             given = 12
        //         } else if (given < 3){
        //             given = 3
        //         }
        //         word_api = "https://random-word-api.herokuapp.com/word?length=" + String(given)
        //     }
        //     // Generates a random word
        //     let word_response = await fetch(word_api)
        //     let word_json = await word_response.json()
        //     this.word = word_json[0]
        //     this.word_length = word_json[0].length
        // }
        
        // // Grabs the definition of the word
        // const definition_api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + String(this.word)
        // try{
        //     let definition_response = await fetch(definition_api)
        //     let definition_json = await definition_response.json()
        //     let definition_array = []
        //     let count = 1
        //     if(definition_json != undefined){
        //         definition_json[0]["meanings"].forEach(function(meaning){
        //             let part_of_speech = meaning["partOfSpeech"]
        //             meaning["definitions"].forEach(function(definition){
        //                 definition_array.push(count + ") " + part_of_speech + ". " + definition["definition"])
        //                 count++
        //             })
        //         })
        //     }
        //     this.word_definitions = definition_array
        // } catch(error){
        //     console.log("Error: " + error)
        // }
    }

    get_word(){
        return this.word
    }

    get_definitions(){
        return this.word_definitions
    }

    get_length(){
        return this.word_length
    }
}
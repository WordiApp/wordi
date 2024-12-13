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
            const snapshot_definition = await get(ref(db, "words/" + (given.charAt(0).toUpperCase() + given.slice(1))))
            console.log(snapshot_definition.val()["definition"])
            this.word_definitions = JSON.parse(snapshot_definition.val()["definition"])
        } else {
            let word_data = null
            let word_count = await get(ref(db, "/word_count"))
            let rand = Math.floor(Math.random()*Number(word_count.val()))
            let snapshot_word = await get(query(ref(db, "/words"), orderByChild("id"), limitToFirst(1), startAt(rand)))

            this.word = Object.keys(snapshot_word.val())[0]
            this.word_length = Object.keys(snapshot_word.val())[0].length
            this.word_definitions = JSON.parse(Object.values(snapshot_word.val())[0]["definition"])
        }
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
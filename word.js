//----------------Database----------------//
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
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
    appId: "1:448694732469:web:5bbdaffef9bf6564a4e0fc",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase()
//----------------Classes----------------//
export class WordGenerator {
    constructor() {}

    async generate() {
        let word_count = await get(ref(db, "/word_count"))
        let rand = Math.floor(Math.random() * Number(word_count.val()))
        return await get(query(ref(db, "/words"), orderByChild("id"), limitToFirst(1), startAt(rand)))
    }
}

export class Dictionary{
    constructor() {}

    async define(word){
        try {
            let snapshot_definition = await get(ref(db, "words/" + word))
            return JSON.parse(snapshot_definition.val()["definition"])
        } catch {
            return []
        }
    }
}
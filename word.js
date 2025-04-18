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
export default class Word {
    constructor() {
        this.word = ""
        this.wordDefinitions = []
    }

    static async New(given){
        const wordInstance = new Word()
        await wordInstance.createWord(given)
        return wordInstance
    }

    async createWord(given) {
        if (given != null && given != "" && given != undefined) {
            this.word = given
            try {
                let snapshotDefinition = await get(ref(db, "words/" + given))
                this.wordDefinitions = JSON.parse(snapshotDefinition.val()["definition"])
            } catch {
                this.wordDefinitions = null
            }
        } else {
            let word_count = await get(ref(db, "/word_count"))
            let rand = Math.floor(Math.random() * Number(word_count.val()))
            let snapshotWord = await get(query(ref(db, "/words"), orderByChild("id"), limitToFirst(1), startAt(rand)))

            this.word = Object.keys(snapshotWord.val())[0]
            this.wordDefinitions = JSON.parse(Object.values(snapshotWord.val())[0]["definition"])
        }
    }

    getWord() {
        return this.word
    }

    getDefinitions() {
        return this.wordDefinitions
    }
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js"
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

function sleep(ms) {
  return new Promise(function(resolve){setTimeout(resolve, ms)})
}

function readFile() {
    const fileInput = document.getElementById("file_input");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const fileContent = event.target.result; // The file content as a string
      let array = JSON.parse(fileContent)

      for(let i = 0; i < array.length; i++){
        update(ref(db, "words/" + array[i]["word"].toLowerCase()), {
          definition: JSON.stringify(array[i]["definitions"]),
          id: i
        }).then(function(){console.log("Word Added!")}).catch(function(err){console.log(err)})
        update(ref(db, "/"), {
          word_count: i + 1
        }).then(function(){}).catch(function(err){console.log(err)})
        await sleep(5)
      }  
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file); // Read the file as a text string
  }


document.getElementById("upload_button").addEventListener("click", function(){
    console.log("click")
    readFile()
})
//----------------Database----------------//
// Import the functions you need from the SDKs you need
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"
import {getDatabase, ref, get, update} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js"
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"
import Word from "./word.js"
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
//----------------Constants----------------//
const alphabet = "abcdefghijklmnopqrstuvwxyz"
const directions = [
    [-1, 0], [0, 1], [1, 0], [0, -1], // Left, Up, Right, Down
    [1, 1], [-1, 1], [-1, -1], [1, -1] // NE, NW, SW, SE
]

const startButton = document.getElementById("start-button")
const startContainer = document.getElementById("start-container")
const searchContainer = document.getElementById("search-container")
const selectedLetters = document.getElementById("selected-letters")
const letterGrid = document.getElementById("letter-grid")
const findWord = document.getElementById("find-word")
//----------------Variables----------------//
let selected = []
let lines = []
let letters = ""
let currentWord = null
let mouseDown = false
let canSearch = false
//----------------Functions: Grid Generation----------------//
// Fisher-Yates Shuffle Algorithm
function shuffle(arr){
    for(let i = arr.length - 1; i >= 0; i--){
        let j = Math.floor(Math.random()*(i + 1)); // Get a random # [0, i]
        [arr[i], arr[j]] = [arr[j], arr[i]] // Swap elements
    }
    return arr
}

// Depth-First Search Algorithm - Finds any path of specified length in a rows x cols grid
function findPath(pathLength, rows, cols){
    function depthFirstSearch(r, c, visited, currentPath){
        if(currentPath.length == pathLength){return currentPath} // If the path length is what we want it to be, return the currentPath array

        let shuffledDirections = shuffle([...directions]) // New shuffled directions array

        for(let[dr, dc] of shuffledDirections){ // Goes through EACH direction possible
            let rNew = r + dr
            let cNew = c + dc
            let key = `${rNew},${cNew}` // This is like fString in python

            if(rNew >= 0 && rNew < rows && // Doesn't go out of bounds on x-axis
               cNew >= 0 && cNew < cols && // Doesn't go out of bounds on y-axis
               !visited.has(key) // Hasn't been to this spot already
            ){
                visited.add(key) // Adds in the new spot
                currentPath.push(`${rNew},${cNew}`) // Pushes in the current position into the currentPath array
                let result = depthFirstSearch(rNew, cNew, visited, currentPath) // Recursion here; starts the whole process for the new position
                if(result != null){
                    return result // If the path has been reached, return through all the recursion and end the sequence
                } else {
                    visited.delete(key) // This path doesn't work. Go back to the old spot
                    currentPath.pop() // Removes the attempted step from the currentPath array
                }
            }
        }
        return null // No path was found in any of the 8 directions
    }

    // Random start position
    let rStart = Math.floor(Math.random()*rows)
    let cStart = Math.floor(Math.random()*cols)
    let visited = new Set([`${rStart},${cStart}`]) // Initializes the set that holds all the spots already visited
    let currentPath = [`${rStart},${cStart}`] // Initializes the currentPath array with the random start position already in it
    let path = depthFirstSearch(rStart, cStart, visited, currentPath) // Searches for a path using Depth-First Search

    return path
}

function drawLine(element1, element2, relativeTo = document.body, line = null){
    // Getting rect for the element that the lines will be relative to
    const relativeToRect = relativeTo.getBoundingClientRect()
    relativeTo.style.position = "relative"
    // Getting the rect of both endpoints
    const rect1 = element1.getBoundingClientRect()
    const rect2 = element2.getBoundingClientRect()
    // Getting the coordinates of both endpoints (adjusted for scroll and the relativeTo element)
    const x1 = rect1.left + rect1.width/2 - relativeToRect.left
    const y1 = rect1.top + rect2.height/2 - relativeToRect.top
    const x2 = rect2.left + rect2.width/2 - relativeToRect.left
    const y2 = rect2.top + rect2.height/2 - relativeToRect.top
    // Calculations for drawing the line
    const xMid = (x1 + x2)/2
    const yMid = (y1 + y2)/2
    const dist = Math.hypot(y2-y1, x2-x1)
    const angleDeg = Math.atan2(y2-y1, x2-x1)*180/Math.PI
    // Creating a line if one doesn't exist already
    if(!line){
        // Element Creation
        line = document.createElement("div")
        line.id = element1.id + "-" + element2.id
        line.classList.add("line")
        line.style.position = "absolute"
        // Adds our line to the lines list
        lines.push(line)
    }
    // Resizes and rotates the line
    const lineThickness = 10
    line.style.top = `${yMid - 5}px`
    line.style.height = `${lineThickness}px`
    line.style.width = `${dist}px`
    line.style.left = `${xMid - (dist/2)}px`
    line.style.transform = `rotate(${angleDeg}deg)`
    // Adds the line to our element that the lines are relative to and returns it
    relativeTo.appendChild(line)
    return line
}

function generateGrid(word, rows, cols){
    letterGrid.innerHTML = ""
    let path = findPath(word.length, rows, cols)
    if(path != null){
        for(let i = 0; i < rows; i++){
            for(let k = 0; k < cols; k++){
                let div = document.createElement("div")
                if(path.indexOf(`${i},${k}`) != -1){
                    div.textContent = word[path.indexOf(`${i},${k}`)].toUpperCase()
                } else {
                    div.textContent = alphabet.charAt(parseInt(Math.random()*26)).toUpperCase()
                }
                div.id =  i + "," + k
                div.classList.add("letter")
                div.addEventListener("mousedown", function(){
                    selectElement(div)
                })
                div.addEventListener("touchstart", function(){
                    selectElement(div)
                })
                letterGrid.appendChild(div)
            }
        }
        let width = parseInt(window.getComputedStyle(letterGrid).width)
        let height = parseInt(window.getComputedStyle(letterGrid).height)
        let gap = parseInt(window.getComputedStyle(letterGrid).gap)

        let xL = (width - gap*(rows-1))/rows
        let yL = (height - gap*(cols-1))/cols
        let aText = Math.pow(Math.min(xL, yL), 2)
        let fontSize = aText/40
        
        letterGrid.style.setProperty("--letter-size", fontSize)        
        letterGrid.style.setProperty("--rows", rows)
        letterGrid.style.setProperty("--cols", cols)
        currentWord = word
    } else {
        console.log("IMPOSSIBLE")
        window.location.reload()
    }
}

async function newSearch(rows, cols){
    const word = await Word.New()
    findWord.textContent = "Find: " + word.getWord().toUpperCase()
    generateGrid(word.getWord(), rows, cols)
    canSearch = true
}
//----------------Functions: Drag System----------------//
function clearSelection(){
    function clearElements(){
        for(let i = selected.length - 1 ; i >= 0 ; i--){
            selected[i].style.backgroundColor = "transparent"
            selected.pop()
        }
        for(let i = lines.length - 1; i >= 0; i--){
            lines[i].remove()
            lines.pop()
        }
        letters = ""
        selectedLetters.textContent = "..."
    }
    if(canSearch){
        if(letters.toLowerCase() == currentWord.toLowerCase()){
            canSearch = false
            for(let i = 0; i < selected.length; i++){
                selected[i].style.backgroundColor = "var(--success-green)"
                if(i > 0){
                    lines[i-1].style.backgroundColor = "var(--success-green)"
                }
            }
            if(auth.currentUser.uid){
                get(ref(db, "userdata/" + auth.currentUser.uid + "/score")).then(function(snapshot){
                    update(ref(db, "userdata/" + auth.currentUser.uid), {
                        score: snapshot.val() + 5
                    }).then(function(){
                        notification("You earned " + 5 + " points!", 5)
                     }).catch(function(err){
                        notification("Error: " + err, 5, "var(--error-red)")
                    })
                })
            }
            setTimeout(function(){
                clearElements()
                newSearch(9, 7)
            }, 2000)
        } else {
            clearElements()
        }
    }
}

function isTouching(firstID, secondID){
    let [rowFirst, columnFirst] = firstID.split(",").map(Number)
    let [rowSecond, columnSecond] = secondID.split(",").map(Number)
    if(Math.abs(rowSecond - rowFirst) <= 1 && Math.abs(columnSecond - columnFirst) <= 1){
        return true
    }
    return false
}

function selectElement(div){
    if(canSearch){
        const position = selected.indexOf(div)
        const touching = (selected.length > 0 && isTouching(selected[selected.length - 1].id, div.id))
        if(position == -1){
            if(selected.length == 0 || touching){
                letters += div.textContent
                div.style.backgroundColor = "rgb(151, 172, 240)"
                if(touching){
                    drawLine(selected[selected.length - 1], div, letterGrid)
                }
                selected.push(div)
            }
        } else if(position == selected.length - 2) {
            for(let i = selected.length - 1; i > position; i--){
                letters = letters.substring(0, i)
                selected[i].style.backgroundColor = "transparent"
                selected.pop()
                lines[i-1].remove()
                lines.pop()
            }
        }
        selectedLetters.textContent = letters
    }
}
//----------------Listeners----------------//
document.addEventListener("mouseup", function(){
    mouseDown = false
    clearSelection()
})

document.addEventListener("mousedown", function(){
    mouseDown = true
})

letterGrid.addEventListener("mousemove", function(e){
    if(!mouseDown){return}

    const element = document.elementFromPoint(e.clientX, e.clientY)
    if(element.parentElement == letterGrid){
        selectElement(element)
    }
})

document.addEventListener("touchstart", function(){
    mouseDown = true;
}, { passive: true });

document.addEventListener("touchend", function(){
    mouseDown = false;
    clearSelection();
}, { passive: true });

letterGrid.addEventListener("touchmove", function(e){
    if(!mouseDown){return}
    e.preventDefault()
    const touch = e.touches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    if(element != null && element.parentElement == letterGrid){
        selectElement(element)
    }
}, {passive: false})

window.addEventListener("resize", function redraw(){
    for(let i = 0; i < lines.length; i++){
        let splitID = lines[i].id.split("-")
        drawLine(document.getElementById(splitID[0]), document.getElementById(splitID[1]), letterGrid, lines[i])
    }
})

startButton.addEventListener("click", function(){
    startContainer.style.display = "none"
    searchContainer.style.display = "flex"
    newSearch(9, 7)
})
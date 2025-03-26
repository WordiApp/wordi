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

const alphabet = "abcdefghijklmnopqrstuvwxyz"

let selected_elements = []
let selected = ""
let current_word = ""

let lines = []

let previous_element = null

const selected_letters = document.getElementById("selected_letters")
const letter_grid = document.getElementById("letter_grid")
const find_word = document.getElementById("find_word")

function in_between(num, min, max){
    if(num >= min && num <= max){
        return true
    }
    return false
}

function draw_line(element1, element2, line){
    let rect1 = element1.getBoundingClientRect()
    let rect2 = element2.getBoundingClientRect()
    let x1 = rect1.left + (rect1.right - rect1.left)/2
    let y1 = rect1.top +(rect1.bottom  - rect1.top)/2
    let x2 = rect2.left +(rect2.right - rect2.left)/2
    let y2 = rect2.top + (rect2.bottom  - rect2.top)/2


    let xMid = (x1 + x2)/2
    let yMid = (y1 + y2)/2
    let dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2)

    let slopeInRadians = Math.atan2(y1-y2, x1-x2)
    let slopeInDegrees = (slopeInRadians*180)/Math.PI

    if(line == null){
        line = document.createElement("p")
        line.id = element1.id + "-" + element2.id
        line.style.width = dist
        line.style.backgroundColor = "rgb(151, 172, 240)"
        line.style.height = "10px"
        line.style.position = "absolute"
        lines.push(line)
    }
    
    line.style.width = dist/2
    line.style.top = yMid - 5
    line.style.left = xMid - (dist/4)
    line.style.transform = "rotate(" + slopeInDegrees + "deg)"

    document.body.appendChild(line)
    
    return line
}

function is_touching(first_id, second_id){
    let [row_first, column_first] = first_id.split(",").map(Number)
    let [row_second, column_second] = second_id.split(",").map(Number)
    if(Math.abs(row_second - row_first) <= 1 && Math.abs(column_second - column_first) <= 1){
        return true
    }
    return false
}

function select_element(div){
    if(String(div.style.backgroundColor) != "rgb(151, 172, 240)"){
        if(previous_element == null){
            selected_elements.push(div)
            selected = div.textContent
            div.style.backgroundColor = "rgb(151, 172, 240)"
            previous_element = div
        } else if(is_touching(previous_element.id, div.id)) {
            selected_elements.push(div)
            selected += div.textContent
            div.style.backgroundColor = "rgb(151, 172, 240)"
            draw_line(previous_element, div)
            previous_element = div
        }
        selected_letters.textContent = selected
    } else {
        if(selected_elements.length >= 2 && selected_elements.indexOf(div) == selected_elements.length - 2){
            let unselect = selected_elements[selected_elements.length - 1]
            unselect.style.backgroundColor = "transparent"
            document.getElementById(div.id + "-" + unselect.id).remove()
            lines.pop()
            selected_elements.pop()
        }
    }
}


const directions = [
    [-1, 0], [0, 1], [1, 0], [0, -1], // Left, Up, Right, Down
    [1, 1], [-1, 1], [-1, -1], [1, -1] // NE, NW, SW, SE
]

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

// function hide_word(rows, cols, word){
//     let directions = ["-1,1", "-1,0", "-1,-1", "0,1", "0,-1", "1,1", "1,0", "1,-1"]
//     let positions = []
//     let word_length = word.length

//     let current_pos = parseInt(Math.random()*rows) + "," + parseInt(Math.random()*cols)
//     positions.push(current_pos)

//     let count = 0
//     for(let i = 1; i < word_length; i++){
//        count = 0
//        while(count < 500){
//             let direction = directions[parseInt(Math.random()*directions.length)]
//             let temp_pos = String(parseInt(current_pos.split(",")[0]) + parseInt(direction.split(",")[0])) 
//                             + "," + 
//                            String(parseInt(current_pos.split(",")[1]) + parseInt(direction.split(",")[1]))
            
//             if(in_between(temp_pos.split(",")[0], 0, rows-1) && in_between(temp_pos.split(",")[1], 0, cols-1) && positions.indexOf(temp_pos) == -1){
//                 positions.push(temp_pos)
//                 current_pos = temp_pos
//                 break
//             } else {
//                 temp_pos = current_pos
//             }
//             count++
//        }
//        if(count >= 250){
//         positions = null
//         break
//        }
//     }
//     return positions
// }

function generate_grid(rows, cols, word){
    for(let i = 0; i < rows; i++){
        for(let k = 0; k < cols; k++){
            let div = document.createElement("div")
            div.textContent = alphabet.charAt(parseInt(Math.random()*26)).toUpperCase()
            div.id =  i + "," + k
            div.addEventListener("mouseover", function(e){
                if(mouse_down){
                    select_element(div)
                }
            })
            div.addEventListener("mousedown", function(){
                select_element(div)
            })
            letter_grid.appendChild(div)
        }
    }
}

let mouse_down = false

document.addEventListener("mousedown", function(){
    mouse_down = true
})

document.addEventListener("mouseup", function(){
    mouse_down = false
    for(let i = 0; i < selected_elements.length; i++){
        selected_elements[i].style.backgroundColor = "transparent"
    }
    for(let i = lines.length - 1; i >= 0; i--){
        lines[i].remove()
        lines.pop()
    }
    selected = "..."
    selected_letters.textContent = selected
    previous_element = null
})

window.addEventListener("resize", function redraw(){
    for(let i = 0; i < lines.length; i++){
        let splitID = lines[i].id.split("-")
        draw_line(document.getElementById(splitID[0]), document.getElementById(splitID[1]), lines[i])
    }
})

generate_grid(8, 8)
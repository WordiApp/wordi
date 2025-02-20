let selected_elements = []
let lines = []
let previous_element = null
let search_container =  document.getElementById("search_container")

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

function dynamic_line(element1, element2){
    let line = draw_line(element1, element2, null)
    window.addEventListener("resize", function(){
        draw_line(element1, element2, line)
    })
}

function select_element(div){
    if(String(div.style.backgroundColor) != "rgb(151, 172, 240)"){
        selected_elements.push(div)
        if(previous_element != null){
            dynamic_line(previous_element, div)
        }
    }
    previous_element = div
    div.style.backgroundColor = "rgb(151, 172, 240)"
}

let mouse_down = false

document.addEventListener("mousedown", function(){
    mouse_down = true
    console.log("down")
})

document.addEventListener("mouseup", function(){
    mouse_down = false
    for(let i = 0; i < selected_elements.length; i++){
        selected_elements[i].style.backgroundColor = "transparent"
    }
    for(let i = 0; i < lines.length; i++){
        lines[i].remove()
    }
    previous_element = null
})

for(let i = 0; i < 10; i++){
    for(let k = 0; k < 10; k++){
        let div = document.createElement("div")
        div.textContent = "A"
        document.getElementById("search_container").appendChild(div)
        div.addEventListener("mouseover", function(e){
            if(mouse_down){
                select_element(div)
            }
        })
        div.addEventListener("mousedown", function(){
            select_element(div)
        })
    }
}


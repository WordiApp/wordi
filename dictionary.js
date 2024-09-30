import Word from "./word.js"

let word = new Word("adopt")

document.getElementById("generate_word").addEventListener("click", function(){
    definition_popup(word)
})

setTimeout(function(){
    document.getElementById("generate_word").textContent = word.get_word()
}, 500)

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
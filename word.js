export default class Word{
    constructor(given){
        this.word = ""
        this.word_length = ""
        this.word_definitions = []
        if(given != null && isNaN(parseInt(given)) == true){
            this.word = given
            this.word_length = given.length
        }
        this.generate_word(given)
    }

    async generate_word(given){
        if(this.word == ""){
            let word_api = "https://random-word-api.herokuapp.com/word"
            if(isNaN(parseInt(given)) == false){
                if(given > 12){
                    given = 12
                } else if (given < 3){
                    given = 3
                }
                word_api = "https://random-word-api.herokuapp.com/word?length=" + String(given)
            }
            // Generates a random word
            let word_response = await fetch(word_api)
            let word_json = await word_response.json()
            this.word = word_json[0]
            this.word_length = word_json[0].length
        }
        
        // Grabs the definition of the word
        const definition_api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + String(this.word)
        try{
            let definition_response = await fetch(definition_api)
            let definition_json = await definition_response.json()
            let definition_array = []
            let count = 1
            console.log(definition_json)
            if(definition_json != undefined){
                definition_json[0]["meanings"].forEach(function(meaning){
                    let part_of_speech = meaning["partOfSpeech"]
                    meaning["definitions"].forEach(function(definition){
                        definition_array.push(count + ") " + part_of_speech + ". " + definition["definition"])
                        count++
                    })
                })
            }
            this.word_definitions = definition_array
        } catch(error){
            console.log("Error: " + error)
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
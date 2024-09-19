export default class Word{
    constructor(len){
        this.word = ""
        this.word_definitions = []
        if(len != null){
            if(len > 12){
                len = 12
            } else if (len < 3){
                len = 3
            }
        }
        this.word_length = len
        this.change_word()
    }

    async change_word(){
        // Generates a random word
        const word_api = "https://random-word-api.herokuapp.com/word?length=" + this.word_length
        let word_response = await fetch(word_api)
        let word_json = await word_response.json()
        this.word = word_json[0]
        // Grabs the definition of the word
        const definition_api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + String(this.word)
        let definition_response = await fetch(definition_api)
        let definition_json = await definition_response.json()
        let definition_array = []
        let count = 1
        try{
            definition_json[0]["meanings"].forEach(function(meaning){
                let part_of_speech = meaning["partOfSpeech"]
                meaning["definitions"].forEach(function(definition){
                    definition_array.push(count + ") " + part_of_speech + ". " + definition["definition"])
                    count++
                })
            })
        } catch(error){
            console.log("Couldn't get a definition for this word: " + this.word + " | Error: " + error)
        }
        this.word_definitions = definition_array
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
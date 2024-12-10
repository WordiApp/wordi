function readFile() {
    const fileInput = document.getElementById("file_input");
    const file = fileInput.files[0];

    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result; // The file content as a string
      let array = JSON.parse(fileContent)
      console.log(array)
      for(let i = 0; i < 100; i++){
        console.log("Word: " + array[i][0] + " | " + "Definitions: " + array[i][1])
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
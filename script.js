async function fetchData(){
    try {
         const response = await fetch("./recipe.json")
         const data = await response.json();
// Prints out the JSON file data to ensure that the information is all there
console.log(data);
//send data to database once it's created

//return data;
     } catch (error) {
         return console.error("Error", error);
     }
}

async function execPythonScript() {
    //pyscript.interpreter.globals.get('click_handler')();
    const response = await fetch('./resipi.py');
    const data = await response.text();
    console.log(data.output);
}

async function handleButtonClick() {
    //await execPythonScript();
    window.location.href = 'downloadRecipe.html';
}

function writeRecipeJSON(url, name, ingredients, instructions) {
    data = {
        "url": url,
        "name": name,
        "ingredients": ingredients,
        "instructions": instructions
    }

    const jsonData = JSON.stringify(data);
    console.log(jsonData);
}

/*async function fetchData(){
    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/");
    const data = await response.json();
    console.log(data);
// Prints out the JSON file data to ensure that the information is all there
console.log(data);
//send data to database once it's created

//return data;
}*/

async function scrape() {

    const HTMLURL =
        document
            .getElementById("recipe-input").value;

    try {

        const response = await fetch(
            "https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/scrape",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url: HTMLURL
                })
            }
        );

        const data = await response.json();

        console.log(data);

        downloadJSON(data);

    } catch (error) {

        console.error(error);
    }
}


const testRecipe = {
    "url": "https://test",
    "name": "Test Recipe",
    "ingredients": [
        "1 cup of test ingredient 1",
        "2 cups of test ingredient 2",
    ],
    "instructions": {
        "step1": "Test instruction 1",
        "step2": "Test instruction 2"
    }
}

//const submitButton = document.getElementById("submit-button");
//submitButton.addEventListener("click", scrape);

function downloadJSON(data) {

    const blob = new Blob(
        [JSON.stringify(data, null, 4)],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "recipe.json";

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
}


//other functions to send data to database and redirect to download page
function redirectToDownload() {
    //await recipeData(URL,'', [], {}); 
    window.location.href = 'downloadRecipe.html';
}

// This function sends the recipe data to the database
async function sendRecipeData(URL, name, ingredients, instructions) {
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/addRecipe",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: URL,
                name: name,
                ingredients: ingredients,
                instructions: instructions
            })
        });

    if (!response.ok) {
        const text = await response.text();
        console.error("Lambda response:", text);
        throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
}

//const submitButton = document.getElementById("submit-button");
//submitButton.addEventListener("click", sendRecipeData(testRecipe.url, testRecipe.name, testRecipe.ingredients, testRecipe.instructions));

// This function reads the recipe data from the database based on the recipe title
async function readRecipeData(URL, name, ingredients, instructions) {
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/readRecipe",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: URL,
                name: name,
                ingredients: ingredients,
                instructions: instructions
            })
        });

    if (!response.ok) {
        const text = await response.text();
        console.error("Lambda response:", text);
        throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
}

// This function tests the connection to the database
async function testConnection() {
    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/testConnection",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: URL,
                name: name,
                ingredients: ingredients,
                instructions: instructions
            })
        });

    if (!response.ok) {
        const text = await response.text();
        console.error("Lambda response:", text);
        throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
}

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", testConnection);

/*async function runScript(){
    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/");
    const data = await response.json();
    console.log(data);
}*/

//adds the ingredients and instructions

//ingrdients
const addIngredientButton =
    document.getElementById("ingredient-add-button");
const removeIngredientButton =
    document.getElementById("ingredient-remove-button");
const ingredientForm = document.getElementById("ingredient-form");

let ingredientCount = 1;

function addIngredient() {
    ingredientCount++;

    const label = document.createElement("label");
    label.setAttribute("for", `ingredient${ingredientCount}`);
    label.textContent = `Ingredient ${ingredientCount}:`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `ingredient${ingredientCount}`;
    input.name = `ingredient${ingredientCount}`;

    const br = document.createElement("br");

    ingredientForm.appendChild(label);
    ingredientForm.appendChild(input);
    ingredientForm.appendChild(br);
}

function removeIngredient() {
    if (ingredientCount > 1) {
        ingredientForm.removeChild(ingredientForm.lastChild);
        ingredientForm.removeChild(ingredientForm.lastChild);
        ingredientForm.removeChild(ingredientForm.lastChild);

        ingredientCount--;
    }
}

addIngredientButton.addEventListener("click", addIngredient);
removeIngredientButton.addEventListener("click", removeIngredient);


//instructions
const addInstructionButton =
    document.getElementById("instruction-add-button");
const removeInstructionButton =
    document.getElementById("instruction-remove-button");
const instructionForm = document.getElementById("instructions-form");

let instructionCount = 1;

function addInstruction() {
    instructionCount++;

    const label = document.createElement("label");
    label.setAttribute("for", `instructions${instructionCount}`);
    label.textContent = `Step ${instructionCount}:`;

    const input = document.createElement("input");
    input.type = "text";
    input.id = `instructions${instructionCount}`;
    input.name = `instructions${instructionCount}`;

    const br = document.createElement("br");

    instructionForm.appendChild(label);
    instructionForm.appendChild(input);
    instructionForm.appendChild(br);
}

function removeInstruction() {
    if (instructionCount > 1) {
        instructionForm.removeChild(instructionForm.lastChild);
        instructionForm.removeChild(instructionForm.lastChild);
        instructionForm.removeChild(instructionForm.lastChild);

        instructionCount--;
    }
}

addInstructionButton.addEventListener("click", addInstruction);
removeInstructionButton.addEventListener("click", removeInstruction);



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

    if(!response.ok){
       const text = await response.text();
       console.error("Lambda response:", text);
       throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
}

const submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", sendRecipeData(testRecipe.url, testRecipe.name, testRecipe.ingredients, testRecipe.instructions));

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

    if(!response.ok){
       const text = await response.text();
       console.error("Lambda response:", text);
       throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
}

/*async function runScript(){
    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/");
    const data = await response.json();
    console.log(data);
}*/


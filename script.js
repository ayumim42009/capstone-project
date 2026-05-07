
async function fetchData(){
    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/");
    const data = await response.json();
    console.log(data);
// Prints out the JSON file data to ensure that the information is all there
console.log(data);
//send data to database once it's created

//return data;
}

async function handleButtonClick() {
    //runScript();
    fetchData();
    //window.location.href = 'downloadRecipe.html';
}

async function writeRecipeJSON(URL, name, ingredients, instructions) {
    data = {
        "url": URL,
        "name": name,
        "ingredients": ingredients,
        "instructions": instructions
    }

    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/",
     {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: URL,
            name,
            ingredients,
            instructions
        })
    });

    if(!response.ok){
        throw new Error("Failed to send data to the server");   
    }

    const result = await response.json();
    console.log("Success:", result);
    return result;
}

async function runScript(){
    const response = await fetch("https://pgvh253inp3c4wkphsv2uwrequ0zzjwe.lambda-url.us-east-2.on.aws/");
    const data = await response.json();
    console.log(data);
}
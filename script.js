async function fetchData(){
    try {
         const response = await fetch("./recipe.json"),
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
    const response = await fetch('/resipi.py');
    const data = await response.json();
    console.log(data.output);
}
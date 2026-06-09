// This function to show and hide the filter menu when the hamburger menu is clicked
function toggleFilterMenu() {
    document.querySelector(".sidebar").classList.toggle("hidden");
}

function toggleSearchMenu() {
    document.querySelector(".dropdown").classList.toggle("open");
}

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


//other functions to send data to database and redirect to display page
async function redirectToDisplay() {
    const recipeName = document.getElementsByClassName("recipe-card-title")[0].textContent.trim().replace(/\s+/g, ' ');
    sessionStorage.setItem("selectedRecipe", recipeName);
    console.log(recipeName);
    window.location.href = 'displayRecipe.html';
}

async function getAllRecipes() {
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/getAllRecipes",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
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

async function getRecipeIdByName(name) {
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/getRecipeID",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name
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

async function getRecipeTag(tag) {
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/getRecipeTag",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tag: tag
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

// This function for the search bar to search for recipes based on the recipe name
async function searchForRecipe() {
    const searchInput = document.getElementById("search-bar").value.trim().replace(/\s+/g, ' ');
    const recipes = await getAllRecipes();
    let filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchInput.toLowerCase()));
    if (filteredRecipes.length > 0) {
        document.getElementById("recipe-grid").innerHTML = filteredRecipes.map(recipe =>
            `<div class="recipe-card">
             <img src="${recipe.image_url != null ? '/' + recipe.image_url.replace(/^\/+/, '') : '/images/placeholder.jpg'}"
              alt="${recipe.name}" class="recipe-img-square">
            <h3 class="recipe-card-title">${recipe.name}</h3>
            <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
            <a href="displayRecipe.html?id=${recipe.id}" class="view-recipe-link">View Recipe</a>
          </div>`).join('');
    } else {
        document.getElementById("recipe-grid").innerHTML = "<p>No recipes found.</p>";
    }
}

async function filterRecipes() {
    const filter_label = document.getElementById("filter_label");
    const recipes = await getRecipeTag();
    let filteredRecipes = recipes.filter(recipe => recipe.tag.toLowerCase().includes(filter_label.toLowerCase()));
    if (filteredRecipes.length > 0) {
        document.getElementById("recipe-grid").innerHTML = filteredRecipes.map(recipe =>
            `<div class="recipe-card">
             <img src="${recipe.image_url != null ? '/' + recipe.image_url.replace(/^\/+/, '') : '/images/placeholder.jpg'}"
              alt="${recipe.name}" class="recipe-img-square">
            <h3 class="recipe-card-title">${recipe.name}</h3>
            <div class="stars">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
            <a href="displayRecipe.html?id=${recipe.id}" class="view-recipe-link">View Recipe</a>
          </div>`).join('');
    } else {
        document.getElementById("recipe-grid").innerHTML = "<p>No recipes found.</p>";
    }
}

// This is the event listener for the search bar
const search = document.getElementById("search-button").addEventListener("click", async function () { await suggestRecipes(); searchForRecipe(); });

// This function sends the recipe data to the database
async function sendRecipeData(URL, name, ingredients, instructions, tags, image_url) {
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
                instructions: instructions,
                tags: tags,
                image_url: image_url
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

// This function removes a recipe's entry in the databse based on the recipe title
async function removeRecipeData() {
    const name = document.getElementsByClassName("recipe-title")[0].textContent;
    console.log(name);
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/deleteRecipe",
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name
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

// This function updates the recipe data from the database based on the recipe title
async function modifyRecipeData() {


    //const recipeId = await getRecipeIdByName((sessionStorage.getItem("selectedRecipe")));
    //const recipeData = await readRecipeData(recipeId[0]['id']);
    const nameData = document.getElementById("recipe-name").value;
    const recipeId = await getRecipeIdByName(nameData);
    const recipeData = await readRecipeData(recipeId[0]['id']);
    console.log(nameData);

    const ingredientFormData = new FormData(document.querySelector("form[name='ingredient-form']"));
    const ingredientData = Array.from(ingredientFormData.values());
    console.log(ingredientData);

    const instructionsFormData = new FormData(document.querySelector("form[name='instructions-form']"));
    const instructionData = Array.from(instructionsFormData.values());
    const tagsFormData = document.getElementById("filter-label").textContent;
    const tagData = Array.from(tagsFormData);

    const imageData = document.getElementById("image-url").value;
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/updateRecipe",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: recipeData[0].id,
                name: nameData,
                ingredients: ingredientData,
                instructions: instructionData,
                tags: tagData,
                image_url: imageData
            })
        });

    if (!response.ok) {
        const text = await response.text();
        console.error("Lambda response:", text);
        throw new Error(`HTTP error ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log("Success:", result);
    addRecipe();
    return result;
}
``
// This function retrieves the recipe data from the database based on the rexipe 
async function readRecipeData(id) {
    const response = await fetch("https://2spa6g6eub.execute-api.us-east-2.amazonaws.com/test/readRecipe",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
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



/**
 * THIS CODE IS FOR MANUAL INPUT OF RECIPE DATA
 * 
 */


if (window.location.pathname.endsWith("recipeForm.html") || window.location.pathname.endsWith("modifyRecipe.html")) {

    //ingredients
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

    const submitButton = document.getElementById("submit-button");
    //add input validation
    submitButton.addEventListener("click", createRecipeData);
}

function addRecipe() {
    const btn = document.querySelector('.action-btn');

    // avoid double clicks
    btn.disabled = true;
    btn.textContent = 'Saved!';
    btn.style.backgroundColor = '#5a8a00';
    //UNCOMMENT THIS   setTimeout(() => { window.location.href = 'index.html'; }, 1000);
}


//for testing
function createRecipeData() {
    // takes the data from the form
    const nameData = document.getElementById("recipe-name").value;

    const ingredientFormData = new FormData(document.querySelector("form[name='ingredient-form']"));
    const ingredientData = Array.from(ingredientFormData.values());

    const instructionsFormData = new FormData(document.querySelector("form[name='instructions-form']"));
    const instructionData = Array.from(instructionsFormData.values());

    const tagsData = document.querySelectorAll('.filter-form input[type="checkbox"]');
    const recipeTags = Array.from(tagsData).map(checkbox => checkbox.checked);

    const imageData = document.getElementById("image-url").value;

    //send the data to the database
    if (nameData === "" || ingredientData.length === 0 || instructionData.length === 0) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.textContent = "Please fill out all fields before submitting.";
        errorMessage.classList.add("open");
        return;
    }
    sendRecipeData("", nameData, ingredientData, instructionData, recipeTags, imageData);
    addRecipe();
}


document.addEventListener('DOMContentLoaded', function () {
    const filterMenu = document.getElementById("hamburger-menu");
    filterMenu.addEventListener("click", toggleFilterMenu);
});

document.addEventListener('DOMContentLoaded', function () {
    const searchMenu = document.getElementById("search-bar");
    document.addEventListener("click", function (event) {
        event.stopPropagation();
        if (event.target === searchMenu) {
            toggleSearchMenu();
        } else {
            document.querySelector(".dropdown").classList.remove("open");
        };

    });
});
//const redirect = document.querySelector('.recipe-card');
//redirect.addEventListener("click", redirectToDisplay);


function openNav() {
    document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("menu-button").classList.toggle("shift");
}

async function suggestRecipes() {
    const searchInput = document.getElementById("search-bar").value.trim().replace(/\s+/g, ' ');
    const recipes = await getAllRecipes();
    let suggestions = recipes.filter(recipe => recipe.name.toLowerCase().startsWith(searchInput.toLowerCase()));
    if (suggestions.length > 0) {
        document.getElementsByClassName("suggestions")[0].innerHTML = suggestions.map(suggestion => `<li class="suggestionitem" id="suggestionitem">${suggestion.name}</li>`).join('');
    } else {
        document.getElementsByClassName("suggestions")[0].innerHTML = "<p>No recipes found.</p>";
    }
    return suggestions;
}

console.log(suggestRecipes());

document.getElementsByClassName("suggestions")[0].addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        const searchInput = document.getElementById("search-bar");
        searchInput.value = e.target.textContent;
    }
});

document.getElementsByClassName("filter-label")[0].addEventListener('click', function (e) {
    if (e.target.tagName === 'LABEL') {
        getRecipeTag(e.target.textContent);
    }
});
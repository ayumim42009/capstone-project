
import * as cheerio from "https://cdn.jsdelivr.net/npm/cheerio/+esm";
import fs from 'fs';
import cloudscraper from 'cloudscraper';

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

async function handleButtonClick() {
    runScript();
    window.location.href = 'downloadRecipe.html';
}

function writeRecipeJSON(URL, name, ingredients, instructions) {
    data = {
        "url": URL,
        "name": name,
        "ingredients": ingredients,
        "instructions": instructions
    }

    const jsonData = JSON.stringify(data);
    console.log(jsonData);
}

async function runScript(){

const URL = "https://www.allrecipes.com/recipe/279991/lemony-almond-ricotta-cookies/";

const numberWords = [
    "One", "Two", "Three", "Four",
    "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
    "Twenty"
];

async function scrape() {

    const html = await cloudscraper.get(URL);

    const $ = cheerio.load(html);

    // NAME
    const name = $("h1.article-heading.text-headline-400")
        .text()
        .trim();

    // INGREDIENTS
    const ingredients = [];

    $("ul.mm-recipes-structured-ingredients__list li")
        .each((i, el) => {

            ingredients.push(
                $(el)
                    .text()
                    .trim()
                    .replace(/\s+/g, " ")
            );
        });

    // INSTRUCTIONS
    const instructions = {};

    $("ol.comp.mntl-sc-block.mntl-sc-block-startgroup.mntl-sc-block-group--OL li")
        .each((i, el) => {

            const stepName = `Step ${numberWords[i + 1] || (i + 1)}`;

            instructions[stepName] = $(el)
                .text()
                .trim()
                .replace(/\s+/g, " ");
        });

    const recipe = {
        URL,
        name,
        ingredients,
        instructions
    };

    // WRITE JSON FILE
    fs.writeFileSync(
        "recipe.json",
        JSON.stringify(recipe, null, 4)
    );

    return recipe;
}

const recipe = await scrape();

console.log(recipe);

}
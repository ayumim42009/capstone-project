import * as cheerio from 'cheerio';
import fs from 'fs';
import cloudscraper from 'cloudscraper';

//This file is for testing and should not be referenced
//refer to the script.js for the function

// const URL = "https://www.allrecipes.com/recipe/279991/lemony-almond-ricotta-cookies/";

var submitButton = document.getElementById("submit-button");
if (submitButton.addEventListener) {
    submitButton.addEventListener("click", scrape, false);
    submitButton.addEventListener("click", redirectToDownload, false);
}
else if (submitButton.attachEvent) {
    submitButton.attachEvent("onclick", scrape);
}


const numberWords = [
    "One", "Two", "Three", "Four",
    "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
    "Twenty"
];

async function scrape() {

    const HTMLURL = document.getElementById("input").getElementsByClassName("recipe-input")[0].value;

    const html = await cloudscraper.get(HTMLURL);

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
        HTMLURL,
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
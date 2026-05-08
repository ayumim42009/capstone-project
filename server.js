import express from "express";
import cors from "cors";
import fs from "fs";
import * as cheerio from "cheerio";
import cloudscraper from "cloudscraper";

const app = express();

app.use(cors());
app.use(express.json());

const numberWords = [
    "One", "Two", "Three", "Four",
    "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
    "Twenty"
];

app.post("/scrape", async (req, res) => {

    try {

        const { url } = req.body;

        const html = await cloudscraper.get(url);

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

                const stepName = `Step ${numberWords[i] || (i + 1)}`;

                instructions[stepName] = $(el)
                    .text()
                    .trim()
                    .replace(/\s+/g, " ");
            });

        const recipe = {
            url,
            name,
            ingredients,
            instructions
        };

        fs.writeFileSync(
            "recipe.json",
            JSON.stringify(recipe, null, 4)
        );

        res.json(recipe);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Scraping failed"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
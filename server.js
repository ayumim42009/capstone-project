import express from "express";
import cors from "cors";
import fs from "fs";
import * as cheerio from "cheerio";
import cloudscraper from "cloudscraper";
import serverless from "serverless-http";
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import * as mysql from "mysql2/promise";




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
  
  function getSecret(){
      const secret_name = "prod/MySQLCred";
  
      const client = new SecretsManagerClient({
      region: "us-east-2",
      });
  
      let response;
  
      try {
      response = await client.send(
          new GetSecretValueCommand({
          SecretId: secret_name,
          VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
          })
      );
      } catch (error) {
      // For a list of exceptions thrown, see
      // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
      throw error;
      }
      return response.SecretString;
      //const secret = response.SecretString;
  
      // Your code goes here
      //console.log(secret);
  }


app.use((req, res, next) => {
    console.log("PATH RECEIVED:", req.path);
    next();
});


/*const TOKEN = "2UV4HhR8ViFSxn170f34e00ac20ab892de337ab211e3124d3";
const url = `https://production-sfo.browserless.io/smart-scrape?token=${TOKEN}`;
const headers = {
  "Content-Type": "application/json"
};

const data = {
  url: "https://www.allrecipes.com/recipe/279991/lemony-almond-ricotta-cookies/",
  formats: ["html", "markdown", "links"]
};*/

/*const smartScrape = async () => {
  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log(result);
};*/

app.get("/readRecipe", (req, res) => {
    const secret = getSecret();
    const credentials = JSON.parse(secret);
  
      try{
          // 1. Establish connection
          const connection = await mysql.createConnection({
              host: credentials.host,
              user: credentials.username,
              password: credentials.password,
              database: credentials.dbname
          });
          // 2. Perform database operations (e.g., query, insert)
          const [rows, fields] = await connection.execute('SELECT name FROM recipes WHERE name = ?',
            [req.name]);
      } catch (error) {
          console.error("Error connecting to database:", error);
      } finally {
      // 3. Always close the connection to avoid exhausting RDS limits
      if (connection) await connection.end();
    }
    res.json({ message: "OK" });
  });

  app.post("/addRecipe", async (req, res) => {
    const secret = await getSecret();
    const credentials = JSON.parse(secret);
  
      try{
          // 1. Establish connection
          const connection = await mysql.createConnection({
              host: credentials.host,
              user: credentials.username,
              password: credentials.password,
              database: credentials.dbname
          });
          // 2. Perform database operations (e.g., query, insert)
          const [rows, fields] = await connection.execute(`INSERT INTO recipes (url, name, ingredients, instructions)
            VALUES(req.body.url, req.body.name, JSON.stringify(req.body.ingredients), JSON.stringify(req.body.instructions)`);
      } catch (error) {
          console.error("Error connecting to database:", error);
      } finally {
      // 3. Always close the connection to avoid exhausting RDS limits
      if (connection) await connection.end();
    }
    res.json({ message: "OK" });
  });

app.post("/scrape", async (req, res) => {

    try {

        const { url } = req.body;

        //const html = await fetch(url);
        //const htmlText = await html.text();

        //console.log(htmlText);

        //const parser = new DOMParser();
        //const doc = parser.parseFromString(htmlText, "text/html");


        const html = await cloudscraper.get(url);
        //const html = smartScrape();
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
            "/tmp/recipe.json",
            JSON.stringify(recipe, null, 4)
        );


        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(recipe);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message,
            stack: error.stack
        });
        /*res.setHeader("Access-Control-Allow-Origin", "*");
        res.status(500).json({
            error: "Scraping failed"
        });*/
    }
});



/*app.listen(3000, () => {
    console.log("Server running on port 3000");
});*/

/*app.get("/server/ManageRecipe", (req, res) => {
    res.json({ message: "OK" });
  });
  
app.get("/ping", (req, res) => {
    res.json({ ok: true });
});*/

export const handler = serverless(app);
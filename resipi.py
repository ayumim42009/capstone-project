import cloudscraper
from bs4 import BeautifulSoup
import json
import inflect

url = "https://www.allrecipes.com/recipe/279991/lemony-almond-ricotta-cookies/"
p = inflect.engine()

print(f"creating a recipe json from {url}...")

#ADD DRIVER
scraper = cloudscraper.create_scraper()

html = scraper.get(url).text

soup = BeautifulSoup(html, "html.parser")

# NAME
name = soup.find("h1", class_="article-heading text-headline-400").get_text(" ", strip =True)

# INGREDIENTS
ul = soup.find("ul", class_="mm-recipes-structured-ingredients__list")

ingredients = [
    li.get_text(" ", strip=True)
    for li in ul.find_all("li")
]

# INSTRUCTIONS
ol = soup.find("ol", class_="comp mntl-sc-block mntl-sc-block-startgroup mntl-sc-block-group--OL")

instructions = {
    f"Step {p.number_to_words(i)}": li.get_text(" ", strip=True)
    for i, li in enumerate(ol.find_all("li"), start=1)
}

print("file successfully created!")

data = {
    "name": name,
    "ingredients": ingredients,
    "instructions": instructions
    }

output_file = "recipe.json"
with open(output_file, 'w') as file:
    json.dump(data, file, indent=4)

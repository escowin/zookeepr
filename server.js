const { query } = require("express");
const express = require("express");
const { animals } = require("./data/animals.json");

const PORT = process.env.PORT || 3001;
// instantiates the server
const app = express();

function filterByQuery(query, animalsArray) {
  let personalityTraitArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // if traits is a string, place & save it to a new array
    if (typeof query.personalityTraits === "string") {
      personalityTraitArray = [query.personalityTraits];
    } else {
      personalityTraitArray = query.personalityTraits;
    }
  }

  // loops through each trait in the array
  personalityTraitArray.forEach((trait) => {
    // checks the trait against each animal in the array. this copy of [animalsArray] is being updated by the .forEach(trait) loop. the .filter(trait) targets each trait. this results in filteredResults containing only animals w/ filtered trait when the .forEach(trait) loop is done.
    filteredResults = filteredResults.filter(
      (animal) => animal.personalityTraits.indexOf(trait) !== -1
    );
  });
  if (query.diet) {
    filteredResults = filteredResults.filter(
      (animal) => animal.diet === query.diet
    );
  }
  if (query.species) {
    filteredResults = filteredResults.filter(
      (animal) => animal.species === query.species
    );
  }
  if (query.name) {
    filteredResults = filteredResults.filter(
      (animal) => animal.name === query.name
    );
  }
  // returns filtered results
  return filteredResults;
}

app.get("/api/animals", (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`api server now on port ${PORT}`);
});

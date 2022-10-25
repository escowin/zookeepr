const fs = require("fs");
const path = require("path");

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

    console.log(personalityTraitArray);
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
  
function findById(id, animalsArray) {
const result = animalsArray.filter((animal) => animal.id === id)[0];
return result;
}

// logic | accepts post route's req.body & animals array to add new data into
function createNewAnimal(body, animalsArray) {
const animal = body;
animalsArray.push(animal);
// synchronous version of fs.writeFile doesn't require a callback function. works for small files
fs.writeFileSync(
    path.join(__dirname, "../data/animals.json"),
    // formatting data | null, prevents editing existing data; 2, creates white space for readability
    JSON.stringify({ animals: animalsArray }, null, 2)
);

return animal;
}

// validate user input
function validateAnimal(animal) {
if (!animal.name || typeof animal.name !== 'string') {
    return false;
}
if (!animal.species || typeof animal.species !== 'string') {
    return false;
}
if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
}
if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false
}
return true;
}

// exports functions
module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal,
};
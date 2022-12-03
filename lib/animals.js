const fs = require("fs");
const path = require("path");

// functions
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // saves personality traits as a dedicated array. if personality traits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }

      console.log(personalityTraitsArray)
      // looping through each trait in personality traits array
      personalityTraitsArray.forEach(trait => {
        // checks trait against each animal in the filtered results array. it is initially a copy of the animals array, but here its updating for each trait in the .forEach loop. for each trait being targeted by the filter, the filtered results array will then contain only the entries that contain the trait. result is an array of animals that haeve every one of the traits when the .forEach loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
  };
  
  function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  };
  
  function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // synchronous .writeFile method | callback not required, works for small files
    fs.writeFileSync(
      // methods joins directory of file code is executed in and writes to animals.json in ./data
      path.join(__dirname, '../data/animals.json'),
      // converts javascript array data into json, null prevents edits to existing data, 2 creates whitespace for code legibility
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
  };
  
  // validation logic | prevents user-submitted null or malicious values
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
      return false;
    }
    return true;
  };

  module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };
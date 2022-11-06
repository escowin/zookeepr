const express = require('express');
const { animals } = require('./data/animals.json');

// instantiates the server
const app = express();

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

// routes
// - get method requires 2 arguments | the route the client will fetch as a string; callback function that executes with every get request
app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
})


// listens for requests
app.listen(3001, () => {
  console.log(`API server now on port 3001`);
});
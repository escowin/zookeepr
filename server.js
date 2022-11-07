const fs = require('fs');
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals.json');

// port set up for heroku or localhost
const PORT = process.env.PORT || 3001;

// instantiates the server
const app = express();

// middleware | .use method tells the express app to intercept POST requests before it gets to the callback function. data will firs tbe run through a couple of functions to take the raw data trasferred over http and convert it to a json object
// - express.urlencoded method takes incoming POST data, and converts it into key-value pairs that can be accessed in the req.body. extended true option inside the method informs server that there may be sub-array data nested in it as well, so it needs to look deep into the POST data to correctly parse all data.
app.use(express.urlencoded({ extended: true}));
// - express.json method takes incoming POST data foratted as json and parses it into the req.body javascript object
app.use(express.json());


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
    path.join(__dirname, './data/animals.json'),
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
}

// api get routes | getting data from server: "/path", callback function executes with each request;
// - req.query | gets all animals that matches the parameters. response parsed in json
app.get('/api/animals', (req, res) => {
  let results = animals;
  // if the user searches by filter, the results will be run through query request against animals.json
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  // server responds to request with the results parsed in json
  res.json(results);
});

// - req.params.id | gets an animal by its id. response parsed in json
app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// api post route | adds an animal object to animal.json
// - req.body accesses incoming POST data. needed in the endpoint's callback function
app.post('/api/animals', (req, res) => {
  // - sets unqiue id based on what the next index of the array will be. prevents id duplication
  req.body.id = animals.length.toString();

  // - sends back 400 error if any data in req.body is incorrect
  if (!validateAnimal(req.body)) {
    res.status(400).send('the animal is not properly formatted');
  } else {
    // - function adds animal to json file and animals array
    const animal = createNewAnimal(req.body, animals);
    // - response parses the animal variable into json
    res.json(animal);
  }
});



// listens for requests. conventiionally placed at the end, must be placed after app declaration.
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
});
const express = require('express');
const req = require('express/lib/request');
const { animals } = require('./data/animals');
const fs = require('fs');
// module built into the Node.js API that provides utilities for working with file and directory paths
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();
// parse incoming POST (string or array) data. converts data to key/value pairs. pairs accessed in req.body
// extended: true | informs server that there may exist nested sub-array data. looks DEEP & parses through post data correctly.
app.use(express.urlencoded({ extended: true }));
// parse incoming json data. above & below middleware functions need to be set up every time a server is created to accept POST data
app.use(express.json())

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    personalityTraitsArray.forEach(trait => {
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
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // synchronous version of fs.writeFile()
    // writes animals.json in ./data.
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        // converts JS array data to JSON
        // null prevents editing existing data. 2 creates white space between values
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return body;
}

// data validation | user-inputed
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

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404);
  }
});

// create route | listens for POST requests. client requesting the server to accept data
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // add animal to json file and animals array
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});

// ::route:: /api/animals
// imports
const router = require('express').Router(); // instantiates Router
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require("../../lib/animals");
const { animals } = require("../../data/animals.json")


//  ::get routes:: getting data from server: "/path", callback function executes with each request;
// - req.query | gets all animals that matches the parameters. response parsed in json
router.get('/animals', (req, res) => {
    let results = animals;
    // if the user searches by filter, the results will be run through query request against animals.json
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    // server responds to request with the results parsed in json
    res.json(results);
  });
  
  // - req.params.id | gets an animal by its id. response parsed in json
  router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });
  
  // ::post route:: adds an animal object to animal.json
  // - req.body accesses incoming POST data. needed in the endpoint's callback function
  router.post('/animals', (req, res) => {
    // - sets unique id by stringfying the array's length value
    req.body.id = animals.length.toString();
  
    // - sends back 400 error if any data in req.body is incorrect
    if (!validateAnimal(req.body)) {
      res.status(400).send('this animal is not properly formatted');
    } else {
      // - function adds animal to json file and animals array
      const animal = createNewAnimal(req.body, animals);
      // - response parses the animal variable into json
      res.json(animal);
    }
  });

  module.exports = router;